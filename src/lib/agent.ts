import { createSupabaseClient } from "@/lib/supabase";
import { encrypt, decrypt } from "@/lib/encryption";
import type { Database } from "./types";
import { z } from "zod";

type Candidate = Database["public"]["Tables"]["candidates"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];
type AgentStep = Database["public"]["Tables"]["agent_steps"]["Row"];
type AgentRun = Database["public"]["Tables"]["agent_runs"]["Row"];

export interface AgentContext {
  orderId: string;
  runId: string;
  phase: "discovery" | "access" | "transaction" | "confirmation" | "cleanup";
  productName: string;
  maxPrice: number;
  userId: string;
  shippingAddressId: string;
  paymentMethodId: string;
  candidates: Candidate[];
  bestCandidate: Candidate | null;
  sessionIds: string[];
  stepIndex: number;
}

export interface AgentTool {
  name: string;
  description: string;
  parameters: z.ZodType<any>;
}

export async function getOrderContext(orderId: string): Promise<AgentContext | null> {
  const supabase = createSupabaseClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!order) return null;

  const { data: run } = await supabase
    .from("agent_runs")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!run) return null;

  return {
    orderId: order.id,
    runId: run.id,
    phase: "discovery",
    productName: order.product_name,
    maxPrice: order.max_price,
    userId: order.user_id,
    shippingAddressId: order.shipping_address_id || "",
    paymentMethodId: order.payment_method_id || "",
    candidates: [],
    bestCandidate: null,
    sessionIds: run.browserbase_session_ids || [],
    stepIndex: 0,
  };
}

export async function logStep(
  runId: string,
  phase: string,
  toolName: string | null,
  toolInput: any,
  toolOutput: any,
  reasoning: string,
  screenshotUrl?: string
): Promise<AgentStep> {
  const supabase = createSupabaseClient();

  const { data: lastStep } = await supabase
    .from("agent_steps")
    .select("step_index")
    .eq("run_id", runId)
    .order("step_index", { ascending: false })
    .limit(1)
    .single();

  const stepIndex = (lastStep?.step_index || 0) + 1;

  const { data: step, error } = await supabase
    .from("agent_steps")
    .insert({
      run_id: runId,
      step_index: stepIndex,
      phase,
      tool_name: toolName,
      tool_input_json: toolInput,
      tool_output_json: toolOutput,
      screenshot_blob_url: screenshotUrl,
      reasoning,
    })
    .select()
    .single();

  if (error) throw (error as any);
  return step!;
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  finalPrice?: number,
  finalUrl?: string,
  receiptUrl?: string
): Promise<void> {
  const supabase = createSupabaseClient();

  await supabase
    .from("orders")
    .update({
      status,
      final_price: finalPrice,
      final_url: finalUrl,
      receipt_blob_url: receiptUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);
}

export async function addCandidate(
  orderId: string,
  candidate: Omit<Candidate, "id" | "order_id" | "created_at" | "rank">
): Promise<Candidate> {
  const supabase = createSupabaseClient();

  const { data: count } = await supabase
    .from("candidates")
    .select("id")
    .eq("order_id", orderId);

  const rank = (count?.length || 0) + 1;

  const { data: result, error } = await supabase
    .from("candidates")
    .insert({
      order_id: orderId,
      ...candidate,
      rank,
    })
    .select()
    .single();

  if (error) throw (error as any);
  return result!;
}

export async function getEncryptedCredential(
  userId: string,
  domain: string
): Promise<{ username: string; password: string; contextId?: string } | null> {
  const supabase = createSupabaseClient();

  const { data: cred } = await supabase
    .from("site_credentials")
    .select("*")
    .eq("user_id", userId)
    .eq("domain", domain)
    .single();

  if (!cred) return null;

  return {
    username: cred.username,
    password: decrypt(cred.encrypted_password),
    contextId: cred.browserbase_context_id || undefined,
  };
}

export async function getShippingAddress(
  addressId: string
): Promise<Database["public"]["Tables"]["shipping_addresses"]["Row"] | null> {
  const supabase = createSupabaseClient();

  const { data } = await supabase
    .from("shipping_addresses")
    .select("*")
    .eq("id", addressId)
    .single();

  return data;
}

export async function getPaymentMethod(
  paymentId: string
): Promise<Database["public"]["Tables"]["payment_methods"]["Row"] | null> {
  const supabase = createSupabaseClient();

  const { data } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("id", paymentId)
    .single();

  return data;
}

export async function pollFor2FA(runId: string, timeoutSeconds: number = 90): Promise<string | null> {
  const supabase = createSupabaseClient();
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutSeconds * 1000) {
    const { data } = await supabase
      .from("pending_2fa")
      .select("code")
      .eq("run_id", runId)
      .order("received_at", { ascending: false })
      .limit(1)
      .single();

    if (data) {
      await supabase.from("pending_2fa").delete().eq("run_id", runId);
      return data.code;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return null;
}

export function calculateLandedCost(
  itemPrice: number,
  shipping: number | null,
  tax: number | null,
  discount: number = 0
): number {
  return itemPrice + (shipping || 0) + (tax || 0) - discount;
}

export function meetsBudget(
  landedCost: number,
  maxPrice: number,
  quality: { reviewScore?: number | null; returnRateFlag?: boolean }
): boolean {
  if (landedCost > maxPrice) return false;
  if (quality.reviewScore && quality.reviewScore < 3.5) return false;
  if (quality.returnRateFlag) return false;
  return true;
}