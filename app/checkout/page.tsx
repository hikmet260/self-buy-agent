"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Bot,
  ArrowLeft,
  Package,
  Shield,
  CreditCard,
  CheckCircle2,
  Loader2,
  Building2,
  Phone,
  Smartphone,
  Fingerprint,
  ScanFace,
  ChevronRight,
  Lock,
  Truck,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Mock product data - in real app, fetch from API
const mockProduct = {
  id: "1",
  name: "Samsung Galaxy Buds FE",
  description: "Premium wireless earbuds with Active Noise Cancellation",
  price: 2850,
  originalPrice: 3200,
  store: "Samsung Ethiopia Official",
  image: "/placeholder-product.jpg",
}

const ethiopianBanks = [
  { id: "cbe", name: "Commercial Bank of Ethiopia" },
  { id: "awash", name: "Awash Bank" },
  { id: "dashen", name: "Dashen Bank" },
  { id: "abyssinia", name: "Bank of Abyssinia" },
  { id: "wegagen", name: "Wegagen Bank" },
  { id: "nib", name: "Nib International Bank" },
  { id: "oromia", name: "Oromia International Bank" },
  { id: "coop", name: "Cooperative Bank of Oromia" },
  { id: "bunna", name: "Bunna International Bank" },
  { id: "zemen", name: "Zemen Bank" },
]

const paymentMethods = [
  { id: "telebirr", name: "TeleBirr", icon: Smartphone },
  { id: "cbe_birr", name: "CBE Birr", icon: Phone },
  { id: "bank", name: "Bank Transfer", icon: Building2 },
  { id: "card", name: "Debit/Credit Card", icon: CreditCard },
]

type CheckoutStep = "shipping" | "fayda" | "payment" | "confirmation"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const productId = searchParams.get("productId")

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showBiometricDialog, setShowBiometricDialog] = useState(false)
  const [biometricMethod, setBiometricMethod] = useState<"fingerprint" | "face" | null>(null)
  const [biometricProgress, setBiometricProgress] = useState(0)
  const [faydaVerified, setFaydaVerified] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  // Form data
  const [shippingData, setShippingData] = useState({
    fullName: "",
    phone: "",
    city: "",
    subCity: "",
    specificLocation: "",
  })

  const [faydaId, setFaydaId] = useState("")
  const [selectedPayment, setSelectedPayment] = useState("")
  const [selectedBank, setSelectedBank] = useState("")

  const steps = [
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "fayda", label: "Verify Identity", icon: Shield },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "confirmation", label: "Confirm", icon: CheckCircle2 },
  ]

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep("fayda")
  }

  const handleFaydaSubmit = () => {
    if (faydaId.length === 12) {
      setShowBiometricDialog(true)
    }
  }

  const startBiometricVerification = async (method: "fingerprint" | "face") => {
    setBiometricMethod(method)
    setBiometricProgress(0)

    // Simulate biometric capture
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setBiometricProgress(i)
    }

    setShowBiometricDialog(false)
    setFaydaVerified(true)
    setCurrentStep("payment")
  }

  const handlePaymentSubmit = () => {
    setCurrentStep("confirmation")
  }

  const handleConfirmOrder = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setOrderComplete(true)
    setIsProcessing(false)
  }

  const getCurrentStepIndex = () => {
    return steps.findIndex((s) => s.id === currentStep)
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 h-16">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">ShopAgent</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-16">
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h1>
              <p className="text-muted-foreground mb-6">
                Your order has been placed successfully. You will receive a confirmation SMS shortly.
              </p>

              <div className="bg-muted/50 rounded-lg p-6 mb-6 text-left">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{mockProduct.name}</p>
                    <p className="text-sm text-muted-foreground">{mockProduct.store}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Order Number</p>
                    <p className="font-mono font-medium">SA-{Date.now().toString().slice(-8)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Paid</p>
                    <p className="font-semibold">{mockProduct.price.toLocaleString()} ETB</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={() => router.push("/search")} className="gap-2">
                  Continue Shopping
                </Button>
                <Button variant="outline" onClick={() => router.push("/")}>
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ShopAgent</span>
            </Link>
            <div className="flex-1" />
            <Badge variant="outline" className="gap-1">
              <Lock className="h-3 w-3" />
              Secure Checkout
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/search" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Link>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                      getCurrentStepIndex() > index
                        ? "bg-primary text-primary-foreground"
                        : getCurrentStepIndex() === index
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {getCurrentStepIndex() > index ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-xs mt-2 text-muted-foreground">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-16 sm:w-24 h-0.5 mx-2",
                      getCurrentStepIndex() > index ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Step */}
            {currentStep === "shipping" && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Shipping Information
                  </CardTitle>
                  <CardDescription>Where should we deliver your order?</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          value={shippingData.fullName}
                          onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="+251912345678"
                          value={shippingData.phone}
                          onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Select
                          value={shippingData.city}
                          onValueChange={(value) => setShippingData({ ...shippingData, city: value })}
                        >
                          <SelectTrigger id="city">
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="addis_ababa">Addis Ababa</SelectItem>
                            <SelectItem value="dire_dawa">Dire Dawa</SelectItem>
                            <SelectItem value="bahir_dar">Bahir Dar</SelectItem>
                            <SelectItem value="hawassa">Hawassa</SelectItem>
                            <SelectItem value="mekelle">Mekelle</SelectItem>
                            <SelectItem value="adama">Adama</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subCity">Sub City / Zone</Label>
                        <Input
                          id="subCity"
                          placeholder="e.g., Bole, Kirkos"
                          value={shippingData.subCity}
                          onChange={(e) => setShippingData({ ...shippingData, subCity: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specificLocation">Specific Location / Landmark</Label>
                      <Input
                        id="specificLocation"
                        placeholder="e.g., Near Edna Mall, Building Name"
                        value={shippingData.specificLocation}
                        onChange={(e) => setShippingData({ ...shippingData, specificLocation: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full gap-2">
                      Continue to Identity Verification
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Fayda Verification Step */}
            {currentStep === "fayda" && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Fayda ID Verification
                  </CardTitle>
                  <CardDescription>
                    Verify your identity securely using Ethiopia&apos;s National ID system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!faydaVerified ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="faydaId">Fayda ID Number</Label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="faydaId"
                            placeholder="Enter 12-digit Fayda ID"
                            className="pl-10 font-mono"
                            value={faydaId}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "").slice(0, 12)
                              setFaydaId(value)
                            }}
                            maxLength={12}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {faydaId.length}/12 digits entered
                        </p>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-medium text-foreground mb-2">Why verify with Fayda ID?</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            Secure payment protection
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            Prevents fraud and identity theft
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            Faster checkout on future orders
                          </li>
                        </ul>
                      </div>

                      <Button
                        onClick={handleFaydaSubmit}
                        disabled={faydaId.length !== 12}
                        className="w-full gap-2"
                      >
                        Verify with Biometrics
                        <Fingerprint className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="bg-success/10 border border-success/20 rounded-lg p-6 text-center">
                      <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Identity Verified</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your Fayda ID has been successfully verified
                      </p>
                      <p className="font-mono text-primary">
                        {faydaId.replace(/(\d{4})/g, "$1-").slice(0, -1)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Payment Step */}
            {currentStep === "payment" && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Choose how you would like to pay</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={selectedPayment}
                    onValueChange={setSelectedPayment}
                    className="grid gap-3"
                  >
                    {paymentMethods.map((method) => (
                      <div key={method.id}>
                        <RadioGroupItem
                          value={method.id}
                          id={method.id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={method.id}
                          className="flex items-center gap-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                        >
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <method.icon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <span className="font-medium">{method.name}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  {selectedPayment === "bank" && (
                    <div className="space-y-2">
                      <Label>Select Your Bank</Label>
                      <Select value={selectedBank} onValueChange={setSelectedBank}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {ethiopianBanks.map((bank) => (
                            <SelectItem key={bank.id} value={bank.id}>
                              {bank.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button
                    onClick={handlePaymentSubmit}
                    disabled={!selectedPayment || (selectedPayment === "bank" && !selectedBank)}
                    className="w-full gap-2"
                  >
                    Continue to Confirmation
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Confirmation Step */}
            {currentStep === "confirmation" && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Review Your Order
                  </CardTitle>
                  <CardDescription>Please review your order details before confirming</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Shipping Summary */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        Shipping Address
                      </h4>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep("shipping")}>
                        Edit
                      </Button>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-sm">
                      <p className="font-medium">{shippingData.fullName}</p>
                      <p className="text-muted-foreground">{shippingData.phone}</p>
                      <p className="text-muted-foreground">
                        {shippingData.subCity}, {shippingData.city}
                      </p>
                      <p className="text-muted-foreground">{shippingData.specificLocation}</p>
                    </div>
                  </div>

                  {/* Identity Summary */}
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      Identity Verified
                    </h4>
                    <div className="bg-success/10 rounded-lg p-4 text-sm flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <span className="font-mono">{faydaId.replace(/(\d{4})/g, "$1-").slice(0, -1)}</span>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        Payment Method
                      </h4>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep("payment")}>
                        Edit
                      </Button>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-sm">
                      <p className="font-medium">
                        {paymentMethods.find((p) => p.id === selectedPayment)?.name}
                      </p>
                      {selectedBank && (
                        <p className="text-muted-foreground">
                          {ethiopianBanks.find((b) => b.id === selectedBank)?.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleConfirmOrder}
                    disabled={isProcessing}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        Confirm & Pay {mockProduct.price.toLocaleString()} ETB
                        <Lock className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center shrink-0">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{mockProduct.name}</p>
                    <p className="text-xs text-muted-foreground">{mockProduct.store}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{mockProduct.price.toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  {mockProduct.originalPrice && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="text-success">
                        -{(mockProduct.originalPrice - mockProduct.price).toLocaleString()} ETB
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-lg">{mockProduct.price.toLocaleString()} ETB</span>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  Secured by Fayda ID verification
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Biometric Dialog */}
      <Dialog open={showBiometricDialog} onOpenChange={setShowBiometricDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Biometric Verification</DialogTitle>
          </DialogHeader>

          {!biometricMethod ? (
            <div className="space-y-4 py-4">
              <p className="text-center text-muted-foreground text-sm">
                Choose your preferred verification method
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => startBiometricVerification("fingerprint")}
                  className="flex flex-col items-center gap-3 p-6 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Fingerprint className="h-8 w-8 text-primary" />
                  </div>
                  <span className="font-medium">Fingerprint</span>
                </button>
                <button
                  onClick={() => startBiometricVerification("face")}
                  className="flex flex-col items-center gap-3 p-6 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <ScanFace className="h-8 w-8 text-primary" />
                  </div>
                  <span className="font-medium">Face ID</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-6">
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={351.86}
                    strokeDashoffset={351.86 - (351.86 * biometricProgress) / 100}
                    className="text-primary transition-all duration-200"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  {biometricMethod === "fingerprint" ? (
                    <Fingerprint className="h-12 w-12 text-primary animate-pulse" />
                  ) : (
                    <ScanFace className="h-12 w-12 text-primary animate-pulse" />
                  )}
                </div>
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {biometricMethod === "fingerprint" ? "Scanning Fingerprint..." : "Scanning Face..."}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please hold still
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
