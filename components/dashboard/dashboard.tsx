"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Bot,
  Search,
  Shield,
  ShoppingCart,
  Package,
  Clock,
  CheckCircle2,
  ChevronRight,
  LogOut,
  Settings,
  User,
  Star,
  TrendingUp,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Demo user data
const demoUser = {
  name: "Abebe Kebede",
  email: "abebe.kebede@email.com",
  phone: "+251912345678",
  faydaId: "123456789012",
  faydaVerified: true,
  memberSince: "March 2024",
}

// Demo recent searches
const recentSearches = [
  { query: "Wireless headphones under 5000 ETB", date: "2 hours ago", results: 3 },
  { query: "Samsung Galaxy A54 best price", date: "Yesterday", results: 3 },
  { query: "Running shoes Nike size 42", date: "3 days ago", results: 3 },
]

// Demo orders
const recentOrders = [
  {
    id: "SA-12345678",
    product: "Samsung Galaxy Buds FE",
    store: "Samsung Ethiopia",
    price: 2850,
    status: "delivered",
    date: "Apr 20, 2024",
  },
  {
    id: "SA-12345679",
    product: "JBL Flip 6 Speaker",
    store: "JBL Official",
    price: 4500,
    status: "shipping",
    date: "Apr 22, 2024",
  },
  {
    id: "SA-12345680",
    product: "Xiaomi Mi Band 8",
    store: "Xiaomi Store",
    price: 1800,
    status: "processing",
    date: "Apr 24, 2024",
  },
]

const statusColors = {
  delivered: "bg-success/10 text-success border-success/20",
  shipping: "bg-primary/10 text-primary border-primary/20",
  processing: "bg-warning/10 text-warning border-warning/20",
}

export function Dashboard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ShopAgent</span>
            </Link>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {demoUser.name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            Ready to find your next great product?
          </p>
        </div>

        {/* Quick Search */}
        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Describe what you're looking for..."
                  className="pl-12 h-12 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="gap-2 h-12">
                <Bot className="h-5 w-5" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Searches */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Searches
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1 text-primary">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(`/search?q=${encodeURIComponent(search.query)}`)}
                    className="w-full flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Search className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{search.query}</p>
                      <p className="text-sm text-muted-foreground">{search.date}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {search.results} results
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    Recent Orders
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1 text-primary">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{order.product}</p>
                      <p className="text-sm text-muted-foreground">{order.store}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-foreground">
                        {order.price.toLocaleString()} ETB
                      </p>
                      <Badge
                        variant="outline"
                        className={cn("text-xs capitalize", statusColors[order.status as keyof typeof statusColors])}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">
                      {demoUser.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{demoUser.name}</p>
                    <p className="text-sm text-muted-foreground">{demoUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-primary">12</p>
                    <p className="text-xs text-muted-foreground">Searches</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-primary">5</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
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
                  Fayda ID verification status
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

            {/* Quick Stats */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Total Spent</span>
                  </div>
                  <span className="font-semibold">9,150 ETB</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Avg Match Score</span>
                  </div>
                  <span className="font-semibold">92%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Products Found</span>
                  </div>
                  <span className="font-semibold">36</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
