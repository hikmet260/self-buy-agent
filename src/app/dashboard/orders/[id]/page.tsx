"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package, Loader2, Search, ShoppingCart, MapPin, ExternalLink } from "lucide-react";
import type { Database } from "@/lib/types";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type Candidate = Database["public"]["Tables"]["candidates"]["Row"];

const statusColors = {
  pending: "default",
  searching: "info",
  comparing: "info",
  awaiting_login: "warning",
  awaiting_2fa: "warning",
  awaiting_confirmation: "warning",
  purchasing: "info",
  purchased: "success",
  failed: "destructive",
  cancelled: "destructive",
  killed: "destructive",
} as const;

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const supabase = createSupabaseClient();

  const [order, setOrder] = useState<Order | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningAgent, setRunningAgent] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const stepsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!supabase) return;

    async function loadOrder() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (!orderData) {
        router.push("/dashboard");
        return;
      }

      setOrder(orderData);

      const { data: candidatesRes } = await supabase
        .from("candidates")
        .select("*")
        .eq("order_id", orderId)
        .order("landed_cost", { ascending: true });

      if (candidatesRes) setCandidates(candidatesRes);
      setLoading(false);
    }

    loadOrder();

    if (!supabase) return;

    const channel = supabase
      .channel(`order:${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder(payload.new as Order);
          if (payload.new.status === "awaiting_confirmation") {
            setShowConfirmModal(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, supabase, router]);

  useEffect(() => {
    stepsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [candidates]);

  const startAgent = async () => {
    setRunningAgent(true);
    try {
      await fetch(`/api/orders/${orderId}/run`, { method: "POST" });
    } catch (err) {
      console.error("Failed to start agent:", err);
    } finally {
      setRunningAgent(false);
    }
  };

  const handleConfirmOrder = async () => {
    setConfirming(true);
    try {
      await fetch(`/api/orders/${orderId}/confirm`, {
        method: "POST",
        body: JSON.stringify({ confirmed: true }),
      });
    } catch (err) {
      console.error("Failed to confirm:", err);
    } finally {
      setConfirming(false);
    }
  };

  const handleCancelOrder = async () => {
    setShowConfirmModal(false);
    try {
      await fetch(`/api/orders/${orderId}/confirm`, {
        method: "POST",
        body: JSON.stringify({ confirmed: false }),
      });
    } catch (err) {
      console.error("Failed to cancel:", err);
    }
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold">{order.product_name}</h1>
              <p className="text-sm text-muted-foreground">
                Max budget: ${order.max_price}
              </p>
            </div>
          </div>
          <Badge variant={statusColors[order.status as keyof typeof statusColors] || "default"}>
            {order.status}
          </Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Agent Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.status === "pending" ? (
                  <div className="text-center py-8">
                    <Button onClick={startAgent} disabled={runningAgent}>
                      {runningAgent ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Starting Agent...
                        </>
                      ) : (
                        <>
                        <ShoppingCart className="h-4 w-4" />
                        Start Autonomous Search
                      </>
                    )}
                  </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Search className="h-5 w-5 text-blue-500" />
                      <span>Searching sources...</span>
                    </div>
                    {order.status === "awaiting_login" && (
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-yellow-500" />
                        <span>Logging in to retailer...</span>
                      </div>
                    )}
                    {order.status === "awaiting_confirmation" && (
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <ShoppingCart className="h-5 w-5 text-green-500" />
                        <span>Ready for confirmation</span>
                      </div>
                    )}
                    <div ref={stepsEndRef} />
                  </div>
                )}
              </CardContent>
            </Card>

            {candidates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Found Deals</CardTitle>
                  <CardDescription>
                    {candidates.length} candidates found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {candidates.map((candidate, index) => (
                      <div
                        key={candidate.id}
                        className={`p-4 border rounded-lg ${
                          index === 0 ? "border-primary bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{candidate.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {candidate.source}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              ${candidate.landed_cost}
                            </p>
                            {candidate.review_score && (
                              <p className="text-sm text-yellow-600">
                                {candidate.review_score} stars
                              </p>
                            )}
                          </div>
                        </div>
                        {candidate.shipping !== null && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            Shipping: ${candidate.shipping} | Tax: ${candidate.tax || 0}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-medium">{order.product_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max Budget</p>
                  <p className="font-medium">${order.max_price}</p>
                </div>
                {order.final_price && (
                  <div>
                    <p className="text-sm text-muted-foreground">Final Price</p>
                    <p className="font-medium text-green-600">${order.final_price}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription>
              Review and confirm your purchase
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {candidates[0] && (
              <div className="space-y-2">
                <p className="font-medium">{candidates[0].title}</p>
                <div className="flex justify-between">
                  <span>Item:</span>
                  <span>${candidates[0].item_price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${candidates[0].shipping || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${candidates[0].tax || 0}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>${candidates[0].landed_cost}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelOrder} disabled={confirming}>
              Cancel
            </Button>
            <Button onClick={handleConfirmOrder} disabled={confirming}>
              {confirming ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Purchase"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}