"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  CreditCard, 
  Plus, 
  Loader2,
  Trash2,
  Key,
  ArrowLeft,
  Check,
  X
} from "lucide-react";
import type { Database } from "@/lib/types";

type ShippingAddress = Database["public"]["Tables"]["shipping_addresses"]["Row"];
type PaymentMethod = Database["public"]["Tables"]["payment_methods"]["Row"];
type SiteCredential = Database["public"]["Tables"]["site_credentials"]["Row"];

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") as "address" | "payment" | "credentials" || "payment";
  const supabase = createSupabaseClient();
  const [user, setUser] = useState<any>(null);
  
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [credentials, setCredentials] = useState<SiteCredential[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"address" | "payment" | "credentials">(initialTab);

  const [showAddressForm, setShowAddressForm] = useState(initialTab === "address");
  const [showPaymentForm, setShowPaymentForm] = useState(initialTab === "payment");
  const [showCredentialForm, setShowCredentialForm] = useState(false);

  const [addressForm, setAddressForm] = useState({
    name: "",
    line1: "",
    line2: "",
    city: "",
    region: "",
    postal: "",
    country: "ET",
    phone: "",
    is_default: false,
  });

  const [paymentForm, setPaymentForm] = useState({
    account_name: "",
    account_number: "",
  });

  const [credentialForm, setCredentialForm] = useState({
    domain: "",
    username: "",
    password: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const [addrRes, payRes, credRes] = await Promise.all([
        supabase.from("shipping_addresses").select("*").eq("user_id", user.id),
        supabase.from("payment_methods").select("*").eq("user_id", user.id),
        supabase.from("site_credentials").select("*").eq("user_id", user.id),
      ]);

      if (addrRes.error && addrRes.error.code === "PGRST205") {
        alert("Database tables are missing. Please run the scripts/schema.sql in your Supabase SQL Editor.");
      }

      if (addrRes.data) setAddresses(addrRes.data);
      if (payRes.data) setPayments(payRes.data);
      if (credRes.data) setCredentials(credRes.data);
      setLoading(false);
    }
    loadData();
  }, [supabase, router]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      if (addressForm.is_default) {
        await supabase.from("shipping_addresses").update({ is_default: false }).eq("user_id", user.id);
      }

      const { error } = await supabase.from("shipping_addresses").insert({
        user_id: user.id,
        ...addressForm,
      });

      if (error) throw error;

      const { data } = await supabase.from("shipping_addresses").select("*").eq("user_id", user.id);
      if (data) setAddresses(data);

      setShowAddressForm(false);
      setAddressForm({
        name: "",
        line1: "",
        line2: "",
        city: "",
        region: "",
        postal: "",
        country: "ET",
        phone: "",
        is_default: false,
      });
    } catch (err) {
      console.error("Failed to add address:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("payment_methods").insert({
        user_id: user.id,
        label: "Dashen Bank",
        last4: paymentForm.account_number.slice(-4),
        card_brand: "Dashen Bank",
        is_default: true,
        virtual_card_enabled: false,
      });

      if (error) throw error;

      const { data } = await supabase.from("payment_methods").select("*").eq("user_id", user.id);
      if (data) setPayments(data);

      setShowPaymentForm(false);
      setPaymentForm({
        account_name: "",
        account_number: "",
      });
    } catch (err) {
      console.error("Failed to add payment:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("site_credentials").insert({
        user_id: user.id,
        domain: credentialForm.domain,
        username: credentialForm.username,
        encrypted_password: credentialForm.password,
        passkey_supported: false,
      });

      if (error) throw error;

      const { data } = await supabase.from("site_credentials").select("*").eq("user_id", user.id);
      if (data) setCredentials(data);

      setShowCredentialForm(false);
      setCredentialForm({
        domain: "",
        username: "",
        password: "",
      });
    } catch (err) {
      console.error("Failed to add credential:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    await supabase.from("shipping_addresses").delete().eq("id", id);
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleDeletePayment = async (id: string) => {
    await supabase.from("payment_methods").delete().eq("id", id);
    setPayments(payments.filter((p) => p.id !== id));
  };

  const handleDeleteCredential = async (id: string) => {
    await supabase.from("site_credentials").delete().eq("id", id);
    setCredentials(credentials.filter((c) => c.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push("/dashboard")}
              className="gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Settings</h1>
                <p className="text-xs text-slate-500">Manage your account</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
              <button
                onClick={() => setActiveTab("payment")}
                className={`w-full px-6 py-4 text-left flex items-center gap-3 transition-all ${
                  activeTab === "payment" 
                    ? "bg-blue-50 border-l-4 border-blue-600" 
                    : "hover:bg-slate-50 border-l-4 border-transparent"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activeTab === "payment" ? "bg-blue-600" : "bg-slate-100"
                }`}>
                  <CreditCard className={`h-5 w-5 ${activeTab === "payment" ? "text-white" : "text-slate-500"}`} />
                </div>
                <div>
                  <p className={`font-semibold ${activeTab === "payment" ? "text-blue-900" : "text-slate-700"}`}>Payment</p>
                  <p className="text-xs text-slate-500">Dashen Bank</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("address")}
                className={`w-full px-6 py-4 text-left flex items-center gap-3 transition-all ${
                  activeTab === "address" 
                    ? "bg-blue-50 border-l-4 border-blue-600" 
                    : "hover:bg-slate-50 border-l-4 border-transparent"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activeTab === "address" ? "bg-blue-600" : "bg-slate-100"
                }`}>
                  <MapPin className={`h-5 w-5 ${activeTab === "address" ? "text-white" : "text-slate-500"}`} />
                </div>
                <div>
                  <p className={`font-semibold ${activeTab === "address" ? "text-blue-900" : "text-slate-700"}`}>Address</p>
                  <p className="text-xs text-slate-500">{addresses.length} saved</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("credentials")}
                className={`w-full px-6 py-4 text-left flex items-center gap-3 transition-all border-t border-slate-100 ${
                  activeTab === "credentials" 
                    ? "bg-blue-50 border-l-4 border-blue-600" 
                    : "hover:bg-slate-50 border-l-4 border-transparent"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activeTab === "credentials" ? "bg-blue-600" : "bg-slate-100"
                }`}>
                  <Key className={`h-5 w-5 ${activeTab === "credentials" ? "text-white" : "text-slate-500"}`} />
                </div>
                <div>
                  <p className={`font-semibold ${activeTab === "credentials" ? "text-blue-900" : "text-slate-700"}`}>Credentials</p>
                  <p className="text-xs text-slate-500">{credentials.length} saved</p>
                </div>
              </button>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === "payment" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-2xl p-8 text-white shadow-xl">
                  <div className="flex items-center gap-6 mb-4">
                    <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
                      <img src="/dashen-bank-logo.jpg" alt="Dashen Bank" className="w-20 h-20 object-contain" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Dashen Bank</h2>
                      <p className="text-slate-300 text-lg">Ethiopia's Premier Commercial Bank</p>
                    </div>
                  </div>
                  <p className="text-slate-200 text-base">
                    Add your Dashen Bank account to receive payments and process transactions securely.
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-semibold text-slate-900">Saved Accounts</h3>
                    <p className="text-sm text-slate-500">Your registered payment methods</p>
                  </div>
                  <div className="p-6">
                    {payments.length > 0 ? (
                      <div className="space-y-4">
                        {payments.map((pm) => (
                          <div key={pm.id} className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 relative group hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-slate-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                                <img src="/dashen-bank-logo.jpg" alt="Dashen Bank" className="w-10 h-10 object-contain" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-slate-900">{pm.label}</p>
                                <p className="text-sm text-slate-500">Account ending in {pm.last4}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {pm.is_default && (
                                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                                    Default
                                  </span>
                                )}
                                <button
                                  onClick={() => handleDeletePayment(pm.id)}
                                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CreditCard className="h-10 w-10 text-slate-400" />
                        </div>
                        <p className="text-slate-600 font-medium">No accounts added yet</p>
                        <p className="text-slate-400 text-sm mt-1">Add your Dashen Bank account to get started</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {showPaymentForm ? "Cancel" : "Add New Account"}
                    </h3>
                  </div>
                  <div className="p-6">
                    {!showPaymentForm ? (
                      <Button 
                        onClick={() => setShowPaymentForm(true)}
                        className="w-full h-14 text-base gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25"
                      >
                        <Plus className="h-5 w-5" />
                        Add Dashen Bank Account
                      </Button>
                    ) : (
                      <form onSubmit={handleAddPayment} className="space-y-6">
                        <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl p-4 border border-slate-200">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center overflow-hidden">
                              <img src="/dashen-bank-logo.jpg" alt="Dashen Bank" className="w-8 h-8 object-contain" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">Dashen Bank</p>
                              <p className="text-xs text-slate-600">Ethiopia's Premier Commercial Bank</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-700 font-medium">Account Holder Name</Label>
                          <Input
                            placeholder="Enter account holder name"
                            value={paymentForm.account_name}
                            onChange={(e) => setPaymentForm({ ...paymentForm, account_name: e.target.value })}
                            className="h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-700 font-medium">Account Number</Label>
                          <Input
                            placeholder="Enter account number"
                            value={paymentForm.account_number}
                            onChange={(e) => setPaymentForm({ ...paymentForm, account_number: e.target.value })}
                            className="h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                            required
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setShowPaymentForm(false)}
                            className="flex-1 h-12 rounded-xl"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={saving}
                            className="flex-1 h-12 bg-slate-600 hover:bg-slate-700 rounded-xl"
                          >
                            {saving ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <>
                                <Check className="h-5 w-5 mr-2" />
                                Save Account
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "address" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <h3 className="text-lg font-semibold text-slate-900">Shipping Addresses</h3>
                  <p className="text-sm text-slate-500">Manage your delivery locations</p>
                </div>
                <div className="p-6">
                  <div className="grid gap-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative group hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                              <MapPin className="h-5 w-5 text-slate-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{addr.name}</p>
                              <p className="text-sm text-slate-600">{addr.line1}</p>
                              <p className="text-sm text-slate-600">{addr.city}, {addr.region} {addr.postal}</p>
                              {addr.phone && <p className="text-sm text-slate-500">{addr.phone}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {addr.is_default && (
                              <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">Default</span>
                            )}
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {!showAddressForm ? (
                    <Button 
                      onClick={() => setShowAddressForm(true)}
                      className="w-full mt-4 h-12 text-base gap-2"
                      variant="outline"
                    >
                      <Plus className="h-5 w-5" />
                      Add New Address
                    </Button>
                  ) : (
                    <form onSubmit={handleAddAddress} className="mt-4 space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Label</Label>
                          <Input
                            placeholder="Home, Work, etc."
                            value={addressForm.name}
                            onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                            required
                            className="h-12 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>City</Label>
                          <Input
                            placeholder="Addis Ababa"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            required
                            className="h-12 rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Address Line 1</Label>
                        <Input
                          placeholder="Bole Road, Near Atlas Hotel"
                          value={addressForm.line1}
                          onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                          required
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Sub City</Label>
                          <Input
                            placeholder="Bole"
                            value={addressForm.region}
                            onChange={(e) => setAddressForm({ ...addressForm, region: e.target.value })}
                            required
                            className="h-12 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>House Number</Label>
                          <Input
                            placeholder="123"
                            value={addressForm.postal}
                            onChange={(e) => setAddressForm({ ...addressForm, postal: e.target.value })}
                            className="h-12 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            placeholder="0912345678"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                            className="h-12 rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)} className="flex-1 h-12 rounded-xl">
                          Cancel
                        </Button>
                        <Button type="submit" disabled={saving} className="flex-1 h-12 bg-slate-600 hover:bg-slate-700 rounded-xl">
                          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save"}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {activeTab === "credentials" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <h3 className="text-lg font-semibold text-slate-900">Site Credentials</h3>
                  <p className="text-sm text-slate-500">Store login credentials for auto-checkout</p>
                </div>
                <div className="p-6">
                  <div className="grid gap-4">
                    {credentials.map((cred) => (
                      <div key={cred.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative group hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                              <Key className="h-5 w-5 text-slate-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{cred.domain}</p>
                              <p className="text-sm text-slate-600">{cred.username}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteCredential(cred.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {!showCredentialForm ? (
                    <Button 
                      onClick={() => setShowCredentialForm(true)}
                      className="w-full mt-4 h-12 text-base gap-2"
                      variant="outline"
                    >
                      <Plus className="h-5 w-5" />
                      Add Site Credential
                    </Button>
                  ) : (
                    <form onSubmit={handleAddCredential} className="mt-4 space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="space-y-2">
                        <Label>Domain</Label>
                        <Input
                          placeholder="amazon.com"
                          value={credentialForm.domain}
                          onChange={(e) => setCredentialForm({ ...credentialForm, domain: e.target.value })}
                          required
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Username/Email</Label>
                        <Input
                          placeholder="you@example.com"
                          value={credentialForm.username}
                          onChange={(e) => setCredentialForm({ ...credentialForm, username: e.target.value })}
                          required
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <Input
                          type="password"
                          placeholder="Enter password"
                          value={credentialForm.password}
                          onChange={(e) => setCredentialForm({ ...credentialForm, password: e.target.value })}
                          required
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button type="button" variant="outline" onClick={() => setShowCredentialForm(false)} className="flex-1 h-12 rounded-xl">
                          Cancel
                        </Button>
                        <Button type="submit" disabled={saving} className="flex-1 h-12 bg-slate-600 hover:bg-slate-700 rounded-xl">
                          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save"}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
