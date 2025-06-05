"use client"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, ShoppingCart, Package, ArrowLeft } from "lucide-react"
import productsData from "@/data/products.json"
import type { Product } from "@/types"
import { cn } from "@/lib/utils"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const allProducts: Product[] = productsData
  const product = allProducts.find((p) => p.slug === slug)

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold">Product not found</h2>
        <Button onClick={() => router.push("/")} variant="link" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go back to homepage
        </Button>
      </div>
    )
  }

  const handleBuyNow = (planId: string) => {
    router.push(`/payment?productSlug=${product.slug}&planId=${planId}`)
  }

  return (
    <div className="space-y-8">
      <Button onClick={() => router.back()} variant="outline" size="sm" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Button>

      <header className="flex flex-col md:flex-row items-center gap-6 mb-8 p-6 rounded-lg bg-card/60 dark:bg-card/40 backdrop-blur-md border border-border/40 shadow-lg">
        <Image
          src={product.logoUrl || "/placeholder.svg"}
          alt={`${product.name} logo`}
          width={100}
          height={100}
          className="rounded-lg"
        />
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-xl text-muted-foreground mt-1">{product.tagline}</p>
        </div>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Available Plans</h2>
        {product.plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.plans.map((plan) => (
              <Card
                key={plan.id}
                className={cn(
                  "flex flex-col justify-between bg-card/70 dark:bg-card/50 backdrop-blur-sm border transition-all hover:shadow-xl",
                  product.accentColorClass,
                  plan.stock === 0 ? "opacity-70" : "",
                )}
              >
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  {plan.officialPriceUSD && (
                    <CardDescription className="line-through">Official: ${plan.officialPriceUSD}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <p className="text-3xl font-bold text-primary">{plan.salePriceMMK.toLocaleString()} MMK</p>
                  <div className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        {feature.includes("✅") ? (
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                        ) : feature.includes("❌") ? (
                          <XCircle className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2 text-muted-foreground/50 flex-shrink-0" />
                        )}
                        <span>{feature.replace("✅", "").replace("❌", "").trim()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch gap-2">
                  <Badge
                    variant={plan.stock > 0 ? "default" : "destructive"}
                    className="self-start mb-2 py-1 px-3 bg-opacity-80"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    {plan.stock > 0 ? `${plan.stock} in stock` : "Sold Out"}
                  </Badge>
                  <Button
                    onClick={() => handleBuyNow(plan.id)}
                    disabled={plan.stock === 0}
                    className="w-full"
                    variant={
                      plan.stock > 0 ? (product.accentColorClass.includes("cyan") ? "default" : "secondary") : "outline"
                    }
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {plan.stock > 0 ? "Buy Now" : "Out of Stock"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No plans currently available for this product.</p>
        )}
      </section>
    </div>
  )
}
