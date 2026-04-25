import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await params;
  const supabase = createSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { confirmed } = body;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: order } = await supabase
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const currentStatus = (order as any).status;
    if (currentStatus !== "awaiting_confirmation") {
      return NextResponse.json(
        { error: "Order is not awaiting confirmation" },
        { status: 400 }
      );
    }

    const newStatus = confirmed ? "purchasing" : "cancelled";
    await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    return NextResponse.json({ success: true, action: newStatus });
  } catch (error: any) {
    console.error("Confirm error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}