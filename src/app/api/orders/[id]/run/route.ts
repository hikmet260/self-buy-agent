import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";
import {
  logStep,
  updateOrderStatus,
  addCandidate,
  getShippingAddress,
  getPaymentMethod,
  calculateLandedCost,
} from "@/lib/agent";
import { createVirtualCard } from "@/lib/stripe";

const SEARCH_SOURCES = [
  { name: "Amazon", url: "https://www.amazon.com/s?k=" },
  { name: "Walmart", url: "https://www.walmart.com/search/?query=" },
  { name: "Target", url: "https://www.target.com/s?searchTerm=" },
  { name: "eBay", url: "https://www.ebay.com/sch/i.html?_nkw=" },
];

function extractPrice(text: string): number {
  const match = text.match(/\$?[\d,]+\.?\d*/);
  if (!match) return 0;
  return parseFloat(match[0].replace(/[$,]/g, ""));
}

function extractTitle(text: string): string {
  const lines = text.split("\n").filter(Boolean);
  return lines[0] || "Unknown Product";
}

async function searchSource(
  source: { name: string; url: string },
  productName: string,
  orderId: string,
  runId: string,
  supabase: ReturnType<typeof createSupabaseClient>
): Promise<any> {
  await logStep(
    runId,
    "discovery",
    "search_source",
    { source: source.name, product: productName },
    { status: "initiated" },
    `Searching ${source.name} for ${productName}`
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const title = `${productName} - ${source.name}`;
  const itemPrice = Math.random() * 200 + 50;
  const shipping = itemPrice > 35 ? 0 : 5.99;
  const tax = itemPrice * 0.08;
  const landedCost = calculateLandedCost(itemPrice, shipping, tax);

  const searchUrl = `${source.url}${encodeURIComponent(productName)}`;

  try {
    const candidate = await addCandidate(orderId, {
      source: source.name,
      url: searchUrl,
      title,
      item_price: itemPrice,
      shipping,
      tax,
      discount_code: null,
      landed_cost: landedCost,
      in_stock: true,
      eta: "2-5 business days",
      review_score: 4 + Math.random(),
      return_rate_flag: false,
      price_history_json: null,
      screenshot_url: null,
    });

    await logStep(
      runId,
      "discovery",
      "search_source",
      { source: source.name },
      { candidate_id: candidate.id, landed_cost: landedCost },
      `Found ${title} at $${landedCost.toFixed(2)} on ${source.name}`
    );

    return candidate;
  } catch (error) {
    console.error(`Failed to search ${source.name}:`, error);
    return null;
  }
}

async function accessSite(
  orderId: string,
  runId: string,
  url: string,
  supabase: ReturnType<typeof createSupabaseClient>
): Promise<{ success: boolean; requiresLogin: boolean; requires2FA: boolean }> {
  await logStep(
    runId,
    "access",
    "navigate",
    { url },
    { status: "navigating" },
    `Navigating to ${url}`
  );

  await new Promise((resolve) => setTimeout(resolve, 1500));

  const requiresLogin = url.includes("amazon") || url.includes("walmart");

  await logStep(
    runId,
    "access",
    "check_auth",
    { url },
    { requires_login: requiresLogin },
    requiresLogin ? "Site requires login" : "Already signed in"
  );

  return {
    success: true,
    requiresLogin,
    requires2FA: Math.random() > 0.7,
  };
}

async function performCheckout(
  orderId: string,
  runId: string,
  candidate: any,
  shippingAddress: any,
  paymentMethod: any,
  supabase: ReturnType<typeof createSupabaseClient>
): Promise<{ success: boolean; orderNumber: string }> {
  await logStep(
    runId,
    "transaction",
    "add_to_cart",
    { candidate_id: candidate.id, item: candidate.title },
    { status: "added" },
    `Adding ${candidate.title} to cart`
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));

  await logStep(
    runId,
    "transaction",
    "fill_shipping",
    { address: shippingAddress.line1 },
    { status: "filled" },
    `Shipping address filled: ${shippingAddress.line1}`
  );

  await new Promise((resolve) => setTimeout(resolve, 500));

  await logStep(
    runId,
    "transaction",
    "select_payment",
    { payment_id: paymentMethod.id },
    { status: "selected" },
    `Payment method selected`
  );

  await new Promise((resolve) => setTimeout(resolve, 500));

  await logStep(
    runId,
    "transaction",
    "review_order",
    { total: candidate.landed_cost },
    { status: "reviewed" },
    `Order reviewed. Total: $${candidate.landed_cost}`
  );

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    orderNumber: `ORD-${Date.now()}`,
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await params;
  const supabase = createSupabaseClient();

  if (!supabase) {
    return new NextResponse(JSON.stringify({ error: "Server not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          controller.enqueue(encoder.encode("data: unauthorized\n\n"));
          controller.close();
          return;
        }

        const { data: order } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .eq("user_id", user.id)
          .single();

        if (!order) {
          controller.enqueue(encoder.encode("data: order_not_found\n\n"));
          controller.close();
          return;
        }

        const { data: run } = await supabase
          .from("agent_runs")
          .insert({
            order_id: orderId,
            status: "running",
          })
          .select()
          .single();

        if (!run) {
          controller.enqueue(encoder.encode("data: run_failed\n\n"));
          controller.close();
          return;
        }

        await supabase
          .from("orders")
          .update({
            status: "searching",
            agent_run_id: run.id,
          })
          .eq("id", orderId);

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "status", status: "searching" })}\n\n`
          )
        );

        const candidates: any[] = [];
        for (const source of SEARCH_SOURCES) {
          const candidate = await searchSource(
            source,
            order.product_name,
            orderId,
            run.id,
            supabase
          );
          if (candidate) {
            candidates.push(candidate);
          }
        }

        if (candidates.length === 0) {
          await updateOrderStatus(orderId, "failed", undefined, undefined, undefined);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", message: "No products found" })}\n\n`
            )
          );
          controller.close();
          return;
        }

        candidates.sort((a, b) => a.landed_cost - b.landed_cost);
        const best = candidates[0];

        await supabase
          .from("orders")
          .update({ status: "comparing" })
          .eq("id", orderId);

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "status",
              status: "comparing",
              candidates: candidates.length,
            })}\n\n`
          )
        );

        let qualityPasses = true;
        if (best.return_rate_flag || (best.review_score && best.review_score < 3.5)) {
          qualityPasses = false;
        }

        if (!qualityPasses) {
          for (let i = 1; i < candidates.length && !qualityPasses; i++) {
            const c = candidates[i];
            if (!c.return_rate_flag && c.review_score && c.review_score >= 3.5) {
              qualityPasses = true;
            }
          }
        }

        if (best.landed_cost > order.max_price) {
          await updateOrderStatus(orderId, "failed", undefined, undefined, undefined);
          controller.enqueue(encoder.encode(`data: over_budget\n\n`));
          controller.close();
          return;
        }

        await logStep(
          run.id,
          "comparing",
          "select_best",
          { candidate_id: best.id },
          { selected: true },
          `Selected best deal: $${best.landed_cost} from ${best.source}`
        );

        await supabase
          .from("orders")
          .update({ status: "awaiting_login" })
          .eq("id", orderId);

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "status",
              status: "awaiting_login",
              best: best.title,
              price: best.landed_cost,
            })}\n\n`
          )
        );

        const accessResult = await accessSite(orderId, run.id, best.url, supabase);

        if (accessResult.requiresLogin) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "login_required",
                domain: new URL(best.url).hostname,
              })}\n\n`
            )
          );
        }

        if (accessResult.requires2FA) {
          await supabase
            .from("orders")
            .update({ status: "awaiting_2fa" })
            .eq("id", orderId);

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "2fa_required" })}\n\n`
            )
          );

          await new Promise((resolve) => setTimeout(resolve, 5000));

          await supabase.from("pending_2fa").insert({
            run_id: run.id,
            code: "123456",
          });

          await new Promise((resolve) => setTimeout(resolve, 5000));
        }

        await supabase
          .from("orders")
          .update({ status: "purchasing" })
          .eq("id", orderId);

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "purchasing" })}\n\n`)
        );

        const shippingAddress = await getShippingAddress(order.shipping_address_id);
        const paymentMethod = await getPaymentMethod(order.payment_method_id);

        if (!shippingAddress || !paymentMethod) {
          await updateOrderStatus(orderId, "failed", undefined, undefined, undefined);
          controller.enqueue(
            encoder.encode(`data: missing_info\n\n`)
          );
          controller.close();
          return;
        }

        let virtualCard = null;
        if (paymentMethod.virtual_card_enabled) {
          virtualCard = await createVirtualCard(
            order.user_id,
            best.landed_cost * 1.1,
            order.currency
          );
        }

        const checkoutResult = await performCheckout(
          orderId,
          run.id,
          best,
          shippingAddress,
          paymentMethod,
          supabase
        );

        await supabase
          .from("orders")
          .update({
            status: "awaiting_confirmation",
            final_url: best.url,
            final_price: best.landed_cost,
          })
          .eq("id", orderId);

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "confirm",
              product: best.title,
              total: best.landed_cost,
              item: best.item_price,
              shipping: best.shipping,
              tax: best.tax,
              source: best.source,
              card: paymentMethod.last4,
            })}\n\n`
          )
        );

        controller.close();
      } catch (error: any) {
        console.error("Agent error:", error);

        await supabase
          .from("orders")
          .update({ status: "failed" })
          .eq("id", orderId);

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", message: error.message })}\n\n`
          )
        );
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}