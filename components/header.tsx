"use client"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ShoppingBag className="h-7 w-7 text-cyan-500" />
          <h1 className="text-2xl font-bold">
            Repli<span className="text-violet-500">Pay</span>
          </h1>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
