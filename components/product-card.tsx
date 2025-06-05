"use client"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Zap, PackageCheck, PackageX } from "lucide-react"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const totalStock = product.plans.reduce((sum, plan) => sum + plan.stock, 0)
  const lowestPrice = Math.min(...product.plans.map((plan) => plan.salePriceMMK))

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-out",
        "bg-card/60 dark:bg-card/40 backdrop-blur-lg border",
        "hover:scale-[1.03] hover:shadow-2xl",
        product.accentColorClass,
      )}
      style={{ perspective: "1000px" }}
    >
      <div className="p-6 transform transition-transform duration-300 hover:-translate-y-1">
        <div className="flex items-center mb-4">
          <Image
            src={product.logoUrl || "/placeholder.svg"}
            alt={`${product.name} logo`}
            width={60}
            height={60}
            className="rounded-md mr-4"
          />
          <div>
            <h3 className="text-2xl font-bold text-card-foreground">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.tagline}</p>
          </div>
        </div>

        <div className="mb-4 space-y-1 text-sm">
          <div className="flex items-center">
            {totalStock > 0 ? (
              <PackageCheck className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <PackageX className="w-4 h-4 mr-2 text-red-500" />
            )}
            <span>
              Stock:{" "}
              {totalStock > 0 ? (
                <span className="text-green-400">Available</span>
              ) : (
                <span className="text-red-400">Sold Out</span>
              )}
            </span>
          </div>
          {product.plans.length > 0 && (
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-yellow-500" />
              <span>
                Starts from <span className="font-semibold">{lowestPrice.toLocaleString()} MMK</span>
              </span>
            </div>
          )}
        </div>

        <Button asChild className="w-full bg-primary/80 hover:bg-primary text-primary-foreground" variant="default">
          <Link href={`/products/${product.slug}`}>View Plans</Link>
        </Button>
      </div>
    </div>
  )
}
