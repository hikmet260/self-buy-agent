"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Bot,
  ShoppingCart,
  Shield,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Globe,
  Zap,
  CreditCard,
  Package,
  Star,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const features = [
  {
    icon: Bot,
    title: "AI-Powered Search",
    description: "Our intelligent agent scans official websites to find exactly what you need",
  },
  {
    icon: TrendingUp,
    title: "Smart Comparison",
    description: "Get top 3 products filtered and ranked based on your specific requirements",
  },
  {
    icon: Shield,
    title: "Fayda ID Verified",
    description: "Secure payments with Ethiopia's national digital ID verification",
  },
  {
    icon: Globe,
    title: "Official Sources Only",
    description: "We only search verified official websites for authentic products",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get personalized recommendations in seconds, not hours",
  },
  {
    icon: CreditCard,
    title: "Secure Checkout",
    description: "Complete your purchase safely with multiple payment options",
  },
]

const steps = [
  {
    step: "01",
    title: "Describe What You Need",
    description: "Tell our AI agent what product you're looking for with your requirements",
  },
  {
    step: "02",
    title: "AI Searches & Compares",
    description: "Our agent scans official websites and filters the best matches",
  },
  {
    step: "03",
    title: "Review Top 3 Options",
    description: "Get curated recommendations ranked by your criteria",
  },
  {
    step: "04",
    title: "Verify & Pay Securely",
    description: "Authenticate with Fayda ID and complete your purchase",
  },
]

const categories = [
  { name: "Electronics", icon: "laptop", count: "2,500+" },
  { name: "Fashion", icon: "shirt", count: "5,000+" },
  { name: "Home & Living", icon: "home", count: "3,200+" },
  { name: "Health & Beauty", icon: "heart", count: "1,800+" },
]

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ShopAgent</span>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Shopping Assistant
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight text-balance">
              Find the Best Products with{" "}
              <span className="text-primary">AI Intelligence</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Describe what you need, and our AI agent searches official websites
              to find and compare the top 3 products that match your requirements.
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="mt-10 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Describe the product you're looking for..."
                    className="pl-12 h-14 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" size="lg" className="h-14 px-8 gap-2">
                  <Bot className="h-5 w-5" />
                  Search with AI
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Try: &quot;Wireless headphones under 5000 ETB with noise cancellation&quot;
              </p>
            </form>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "100+", label: "Official Websites" },
              { value: "50K+", label: "Products Indexed" },
              { value: "99%", label: "Match Accuracy" },
              { value: "Instant", label: "Results" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              How ShopAgent Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              From search to purchase in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)]">
                    <div className="border-t-2 border-dashed border-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Why Choose ShopAgent?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Powered by advanced AI with secure Ethiopian payment integration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              See It In Action
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Example: Finding the best wireless earbuds
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-primary/5 p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Bot className="h-6 w-6 text-primary" />
                  <span className="font-medium text-foreground">ShopAgent AI</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Processing
                  </span>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Your Search:</p>
                  <p className="font-medium text-foreground">
                    &quot;Wireless earbuds with good bass, under 3000 ETB, with at least 6 hours battery&quot;
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Top 3 Recommendations:
                  </p>

                  {[
                    { name: "Samsung Galaxy Buds FE", price: "2,850 ETB", match: "95%", store: "Samsung Ethiopia" },
                    { name: "JBL Wave 200", price: "2,500 ETB", match: "92%", store: "JBL Official" },
                    { name: "Xiaomi Redmi Buds 4", price: "2,200 ETB", match: "88%", store: "Xiaomi Store" },
                  ].map((product, idx) => (
                    <div key={product.name} className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-muted px-2 py-0.5 rounded">#{idx + 1}</span>
                          <p className="font-medium text-foreground">{product.name}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{product.store}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{product.price}</p>
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <Star className="h-3 w-3 fill-current" />
                          {product.match} match
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Find Your Perfect Product?
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
                Join thousands of smart shoppers using AI to find the best deals.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Create Free Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/search">
                  <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10">
                    Try a Search
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">ShopAgent</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2024 ShopAgent. AI-powered shopping with Fayda ID verification.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
