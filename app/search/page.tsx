"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Search,
  Bot,
  Filter,
  ArrowLeft,
  Package,
  Star,
  ExternalLink,
  ShoppingCart,
  CheckCircle2,
  Loader2,
  Globe,
  Tag,
  Clock,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  matchScore: number
  store: string
  storeUrl: string
  image: string
  features: string[]
  rating: number
  reviews: number
  inStock: boolean
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Samsung Galaxy Buds FE",
    description: "Premium wireless earbuds with Active Noise Cancellation, powerful bass, and up to 8 hours of battery life.",
    price: 2850,
    originalPrice: 3200,
    matchScore: 95,
    store: "Samsung Ethiopia Official",
    storeUrl: "https://samsung.com/et",
    image: "/placeholder-product.jpg",
    features: ["Active Noise Cancellation", "8hr Battery", "IPX2 Water Resistant", "Wireless Charging"],
    rating: 4.7,
    reviews: 234,
    inStock: true,
  },
  {
    id: "2",
    name: "JBL Wave 200 TWS",
    description: "True wireless earbuds with JBL Deep Bass Sound, 20 hours total playback, and dual connect technology.",
    price: 2500,
    matchScore: 92,
    store: "JBL Official Store",
    storeUrl: "https://jbl.com",
    image: "/placeholder-product.jpg",
    features: ["Deep Bass", "20hr Total Battery", "Dual Connect", "Voice Assistant"],
    rating: 4.5,
    reviews: 189,
    inStock: true,
  },
  {
    id: "3",
    name: "Xiaomi Redmi Buds 4 Active",
    description: "Lightweight wireless earbuds with 12mm drivers, Google Fast Pair, and up to 28 hours total battery.",
    price: 2200,
    originalPrice: 2600,
    matchScore: 88,
    store: "Xiaomi Official Ethiopia",
    storeUrl: "https://xiaomi.com",
    image: "/placeholder-product.jpg",
    features: ["12mm Drivers", "28hr Total Battery", "Google Fast Pair", "Low Latency Mode"],
    rating: 4.3,
    reviews: 156,
    inStock: true,
  },
]

const searchSteps = [
  { label: "Analyzing your requirements", duration: 1000 },
  { label: "Searching official websites", duration: 1500 },
  { label: "Comparing products", duration: 1200 },
  { label: "Ranking by your criteria", duration: 800 },
  { label: "Preparing recommendations", duration: 500 },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(query)
  const [isSearching, setIsSearching] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [searchProgress, setSearchProgress] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (query) {
      performSearch()
    }
  }, [])

  const performSearch = async () => {
    setIsSearching(true)
    setHasSearched(true)
    setProducts([])
    setCurrentStep(0)
    setSearchProgress(0)

    for (let i = 0; i < searchSteps.length; i++) {
      setCurrentStep(i)
      setSearchProgress(((i + 1) / searchSteps.length) * 100)
      await new Promise((resolve) => setTimeout(resolve, searchSteps[i].duration))
    }

    setProducts(mockProducts)
    setIsSearching(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      performSearch()
    }
  }

  const handleBuyNow = (product: Product) => {
    setSelectedProduct(product)
    router.push(`/checkout?productId=${product.id}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground hidden sm:block">ShopAgent</span>
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for products..."
                  className="pl-10 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <Link href="/login">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button & Query */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          {query && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-muted-foreground">Searching for:</span>
              <Badge variant="secondary" className="text-sm font-normal">
                {query}
              </Badge>
            </div>
          )}
        </div>

        {/* AI Search Progress */}
        {isSearching && (
          <Card className="border-0 shadow-lg mb-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">AI Agent Working</h2>
                  <p className="text-sm text-muted-foreground">
                    {searchSteps[currentStep]?.label || "Processing..."}
                  </p>
                </div>
              </div>

              <Progress value={searchProgress} className="h-2 mb-4" />

              <div className="space-y-3">
                {searchSteps.map((step, index) => (
                  <div
                    key={step.label}
                    className={cn(
                      "flex items-center gap-3 text-sm",
                      index < currentStep
                        ? "text-primary"
                        : index === currentStep
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {index < currentStep ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : index === currentStep ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-current" />
                    )}
                    {step.label}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {!isSearching && hasSearched && products.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Top 3 Recommendations</h2>
                <p className="text-muted-foreground">
                  Based on your search criteria, ranked by match score
                </p>
              </div>
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                Official Sources Only
              </Badge>
            </div>

            <div className="grid gap-6">
              {products.map((product, index) => (
                <Card key={product.id} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Rank Badge */}
                      <div className="bg-primary/5 p-4 lg:p-6 flex lg:flex-col items-center justify-center gap-2 lg:w-24">
                        <span className="text-3xl font-bold text-primary">#{index + 1}</span>
                        <div className="flex items-center gap-1 text-sm text-primary">
                          <Star className="h-4 w-4 fill-current" />
                          {product.matchScore}%
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                          {/* Product Image Placeholder */}
                          <div className="w-full lg:w-32 h-32 bg-muted rounded-lg flex items-center justify-center shrink-0">
                            <Package className="h-12 w-12 text-muted-foreground" />
                          </div>

                          {/* Details */}
                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{product.store}</span>
                                <Badge variant="outline" className="text-xs">Official</Badge>
                              </div>
                            </div>

                            <p className="text-muted-foreground text-sm">{product.description}</p>

                            <div className="flex flex-wrap gap-2">
                              {product.features.map((feature) => (
                                <Badge key={feature} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <span className="font-medium">{product.rating}</span>
                                <span className="text-muted-foreground">({product.reviews} reviews)</span>
                              </div>
                              {product.inStock ? (
                                <Badge variant="outline" className="text-xs text-success border-success">
                                  In Stock
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs text-destructive border-destructive">
                                  Out of Stock
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Price & Actions */}
                          <div className="lg:text-right space-y-3 shrink-0">
                            <div>
                              <div className="flex items-center gap-2 lg:justify-end">
                                <span className="text-2xl font-bold text-foreground">
                                  {product.price.toLocaleString()} ETB
                                </span>
                              </div>
                              {product.originalPrice && (
                                <div className="flex items-center gap-2 lg:justify-end">
                                  <span className="text-sm text-muted-foreground line-through">
                                    {product.originalPrice.toLocaleString()} ETB
                                  </span>
                                  <Badge variant="destructive" className="text-xs">
                                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                  </Badge>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col gap-2">
                              <Button
                                onClick={() => handleBuyNow(product)}
                                className="gap-2"
                              >
                                <ShoppingCart className="h-4 w-4" />
                                Buy Now
                              </Button>
                              <Button variant="outline" size="sm" className="gap-2" asChild>
                                <a href={product.storeUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                  View on Store
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search Again */}
            <Card className="border-0 shadow-sm bg-muted/30">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Not what you&apos;re looking for? Try refining your search.
                </p>
                <Button variant="outline" onClick={() => setHasSearched(false)}>
                  Search Again
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!isSearching && !hasSearched && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Start Your Search</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Describe the product you&apos;re looking for and our AI agent will find
                the top 3 matches from official websites.
              </p>
              <form onSubmit={handleSearch} className="max-w-lg mx-auto">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="e.g., Laptop for video editing under 50000 ETB"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" className="gap-2">
                    <Bot className="h-4 w-4" />
                    Search
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
