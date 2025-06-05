import type React from "react"
import Link from "next/link"
import { LayoutDashboard, ShoppingBag, HelpCircle, StickyNote, CreditCard, Home, ShieldAlert } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/40 dark:bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">RepliPay Admin</h1>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/"
            className="text-sm hover:underline flex items-center gap-1 text-muted-foreground hover:text-primary"
          >
            <Home size={14} /> View Storefront
          </Link>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex pt-14">
          <nav className="flex flex-col gap-1 p-4">
            <Link
              href="/admin/products"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
            >
              <ShoppingBag className="h-5 w-5" />
              Products
            </Link>
            <Link
              href="/admin/faqs"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
            >
              <HelpCircle className="h-5 w-5" />
              FAQs
            </Link>
            <Link
              href="/admin/notes"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
            >
              <StickyNote className="h-5 w-5" />
              Seller Notes
            </Link>
            <Link
              href="/admin/payment-config"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
            >
              <CreditCard className="h-5 w-5" />
              Payment Config
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6 sm:ml-60 pt-14 sm:pt-6">
          {process.env.NODE_ENV === "development" ? (
            <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Development Mode Active:</strong> This admin panel directly modifies
                local data files. It is intended for local use only and should not be accessible in a production
                environment without robust security measures.
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-sm flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-500" />
              <div>
                <strong className="font-semibold">Access Denied:</strong> The admin panel is disabled in production
                environments for security reasons.
              </div>
            </div>
          )}
          {process.env.NODE_ENV === "development" ? children : null}
        </main>
      </div>
    </div>
  )
}
