"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Package, 
  CreditCard, 
  MapPin, 
  Settings, 
  Plus, 
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/lib/types";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type ShippingAddress = Database["public"]["Tables"]["shipping_addresses"]["Row"];
type PaymentMethod = Database["public"]["Tables"]["payment_methods"]["Row"];

const statusColors: Record<string, "default" | "secondary" | "destructive" | "success" | "warning" | "info"> = {
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
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  searching: "Searching",
  comparing: "Comparing",
  awaiting_login: "Awaiting Login",
  awaiting_2fa: "Awaiting 2FA",
  awaiting_confirmation: "Confirm",
  purchasing: "Purchasing",
  purchased: "Purchased",
  failed: "Failed",
  cancelled: "Cancelled",
  killed: "Killed",
};

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createSupabaseClient();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState("");
  const [newMaxPrice, setNewMaxPrice] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [creating, setCreating] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [productResults, setProductResults] = useState<{name: string; price: string; source: string; url: string; image: string}[]>([]);

  useEffect(() => {
    if (!supabase) return;
    
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
        setUser(user);

        const [ordersRes, addressesRes, paymentsRes] = await Promise.all([
          supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
          supabase.from("shipping_addresses").select("*").eq("user_id", user.id),
          supabase.from("payment_methods").select("*").eq("user_id", user.id),
        ]);

        if (ordersRes.error && ordersRes.error.code === "PGRST205") {
          alert("Database tables are missing. Please run the scripts/schema.sql in your Supabase SQL Editor.");
        }

        if (ordersRes.data) setOrders(ordersRes.data);
        if (addressesRes.data) setAddresses(addressesRes.data);
        if (paymentsRes.data) setPayments(paymentsRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [supabase, router]);

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct || !newMaxPrice) return;

    setCreating(true);
    try {
      const response = await fetch('/api/products/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: newProduct, maxPrice: newMaxPrice }),
      });
      
      const products = await response.json();
      setProductResults(products.slice(0, 3));
      setShowProducts(true);
    } catch (err) {
      console.error("Failed to search products:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleSelectProduct = (product: {name: string; price: string; source: string; url: string; image: string}) => {
    window.open(product.url, "_blank");
    setShowProducts(false);
    setProductResults([]);
    setNewProduct("");
    setNewMaxPrice("");
  };

  if (loading) {
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
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Buyer Agent</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  New Order
                </CardTitle>
                <CardDescription>
                  Enter product details to start autonomous purchasing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateOrder} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Product Name</Label>
                      <Input
                        placeholder="e.g., Sony WH-1000XM5"
                        value={newProduct}
                        onChange={(e) => setNewProduct(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="e.g., 299.99"
                        value={newMaxPrice}
                        onChange={(e) => setNewMaxPrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Shipping Address (Optional)</Label>
                      <Select value={selectedAddress} onValueChange={setSelectedAddress}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select address" />
                        </SelectTrigger>
                        <SelectContent>
                          {addresses.map((addr) => (
                            <SelectItem key={addr.id} value={addr.id}>
                              {addr.name} - {addr.line1}, {addr.city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Method (Optional)</Label>
                      <Select value={selectedPayment} onValueChange={setSelectedPayment}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment" />
                        </SelectTrigger>
                        <SelectContent>
                          {payments.map((pm) => (
                            <SelectItem key={pm.id} value={pm.id}>
                              {pm.label} •••• {pm.last4}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={creating || !newProduct || !newMaxPrice}>
                    {creating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Package className="h-4 w-4" />
                        Start Autonomous Purchase
                      </>
                    )}
                  </Button>
                </form>
                {showProducts && (
                  <div className="mt-6 space-y-3">
                    <h3 className="font-semibold">Found 3 Products</h3>
                    {productResults.map((product, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-medium">{product.source}</p>
                          <p className="text-sm text-muted-foreground">${product.price}</p>
                        </div>
                        <Button size="sm" onClick={() => handleSelectProduct(product)}>
                          View
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-2" onClick={() => { setShowProducts(false); setProductResults([]); }}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No orders yet. Create your first order above.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                      >
                        <div className="flex-1">
                          <p className="font-medium">{order.product_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Max: ${order.max_price} • {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <Badge variant={statusColors[order.status] || "default"}>
                          {statusLabels[order.status] || order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Addresses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {addresses.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No addresses added</p>
                ) : (
                  addresses.map((addr) => (
                    <div key={addr.id} className="p-2 border rounded text-sm">
                      <p className="font-medium">{addr.name}</p>
                      <p className="text-muted-foreground">{addr.line1}</p>
                      <p className="text-muted-foreground">{addr.city}, {addr.region} {addr.postal}</p>
                    </div>
                  ))
                )}
                <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/dashboard/settings?tab=address")}>
                    <Plus className="h-4 w-4" />
                    Add Address
                  </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {payments.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No payment methods added</p>
                ) : (
                  payments.map((pm) => (
                    <div key={pm.id} className="p-2 border rounded text-sm">
                      <p className="font-medium">{pm.label}</p>
                      <p className="text-muted-foreground">•••• {pm.last4}</p>
                    </div>
                  ))
                )}
                <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/dashboard/settings?tab=payment")}>
                    <Plus className="h-4 w-4" />
                    Add Payment Method
                  </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}