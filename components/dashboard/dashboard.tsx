"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Building2,
  CheckCircle2,
  LogOut,
  CreditCard,
  Settings,
  Bell,
  Shield,
  ChevronRight,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Demo user data
const demoUser = {
  firstName: "Abebe",
  fatherName: "Kebede",
  grandfatherName: "Haile",
  email: "abebe.kebede@email.com",
  phone: "+251 912 345 678",
  faydaId: "123456789012",
  faydaVerified: true,
  bankName: "Commercial Bank of Ethiopia",
  accountNumber: "1000123456789",
  accountHolderName: "Abebe Kebede Haile",
}

const quickActions = [
  { icon: ArrowUpRight, label: "Send Money", color: "text-primary" },
  { icon: ArrowDownLeft, label: "Request", color: "text-accent" },
  { icon: CreditCard, label: "Cards", color: "text-primary" },
  { icon: Wallet, label: "Top Up", color: "text-success" },
]

const recentTransactions = [
  { id: 1, name: "Tigist Alemu", type: "sent", amount: -1500, date: "Today" },
  { id: 2, name: "Salary Credit", type: "received", amount: 25000, date: "Yesterday" },
  { id: 3, name: "Electric Bill", type: "sent", amount: -850, date: "Yesterday" },
  { id: 4, name: "Yohannes G.", type: "received", amount: 500, date: "Apr 22" },
]

export function Dashboard() {
  const router = useRouter()
  const [balance] = useState(48650.75)

  const handleLogout = () => {
    router.push("/login")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SecureBank</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Balance */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome & Balance Card */}
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0 overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-50" />
              <CardContent className="p-6 relative">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-14 w-14 border-2 border-primary-foreground/20">
                    <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-xl font-bold">
                      {demoUser.firstName[0]}{demoUser.fatherName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-primary-foreground/80 text-sm">Welcome back,</p>
                    <h2 className="text-xl font-bold">
                      {demoUser.firstName} {demoUser.fatherName}
                    </h2>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-primary-foreground/80 text-sm">Available Balance</p>
                  <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                    {formatCurrency(balance)}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <TrendingUp className="h-4 w-4 text-primary-foreground/80" />
                  <span className="text-sm text-primary-foreground/80">
                    +2.5% from last month
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="grid grid-cols-4 gap-2 sm:gap-4">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <button
                        key={action.label}
                        className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl hover:bg-muted transition-colors"
                      >
                        <div className={cn("p-3 rounded-full bg-muted", action.color)}>
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-foreground">
                          {action.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recent Transactions</CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            tx.type === "received"
                              ? "bg-success/10 text-success"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {tx.type === "received" ? (
                            <ArrowDownLeft className="h-5 w-5" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{tx.name}</p>
                          <p className="text-xs text-muted-foreground">{tx.date}</p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "font-semibold",
                          tx.amount > 0 ? "text-success" : "text-foreground"
                        )}
                      >
                        {tx.amount > 0 ? "+" : ""}
                        {formatCurrency(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Summary */}
          <div className="space-y-6">
            {/* Profile Summary Card */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Full Name</span>
                    <span className="text-sm font-medium text-foreground">
                      {demoUser.firstName} {demoUser.fatherName} {demoUser.grandfatherName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="text-sm font-medium text-foreground truncate ml-4">
                      {demoUser.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Phone</span>
                    <span className="text-sm font-medium text-foreground">
                      {demoUser.phone}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fayda Verification Status */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Identity Verification
                </CardTitle>
                <CardDescription>
                  Fayda National ID verification status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg",
                    demoUser.faydaVerified
                      ? "bg-success/10 border border-success/20"
                      : "bg-warning/10 border border-warning/20"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    demoUser.faydaVerified ? "bg-success/20" : "bg-warning/20"
                  )}>
                    <CheckCircle2
                      className={cn(
                        "h-6 w-6",
                        demoUser.faydaVerified ? "text-success" : "text-warning"
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">Fayda ID</p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          demoUser.faydaVerified
                            ? "border-success text-success bg-success/10"
                            : "border-warning text-warning bg-warning/10"
                        )}
                      >
                        {demoUser.faydaVerified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono mt-1">
                      {demoUser.faydaId.replace(/(\d{4})/g, "$1-").slice(0, -1)}
                    </p>
                  </div>
                </div>

                {demoUser.faydaVerified ? (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-muted-foreground text-xs">Verified On</p>
                      <p className="font-medium">Apr 15, 2024</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-muted-foreground text-xs">Valid Until</p>
                      <p className="font-medium">Apr 15, 2034</p>
                    </div>
                  </div>
                ) : (
                  <Button 
                    className="w-full gap-2"
                    onClick={() => router.push("/fayda-verification")}
                  >
                    <Shield className="h-4 w-4" />
                    Verify Now
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Linked Bank Account */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Linked Bank Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {demoUser.bankName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {demoUser.accountHolderName}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">Account Number</p>
                    <p className="font-mono text-sm font-medium text-foreground">
                      ****{demoUser.accountNumber.slice(-4)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-0 shadow-sm bg-primary/5">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Your account is secure
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last login: Today at 10:30 AM from Addis Ababa
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
