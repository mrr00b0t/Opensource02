import { Button } from "@/components/ui/button"
// Content from previous response (AdminDashboardPage) is suitable.
// No changes needed here if the previous version was okay.
// It links to /admin/products, /admin/faqs, etc.
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ShoppingBag, HelpCircle, StickyNote, CreditCard } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to the RepliPay local data editor. Select a category below to manage your storefront's content.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShoppingBag className="text-primary" /> Products
            </CardTitle>
            <CardDescription>Manage your digital products, their details, and pricing plans.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/admin/products">Go to Products &rarr;</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <HelpCircle className="text-primary" /> FAQs
            </CardTitle>
            <CardDescription>Add, edit, or remove frequently asked questions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/admin/faqs">Go to FAQs &rarr;</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <StickyNote className="text-primary" /> Seller Notes
            </CardTitle>
            <CardDescription>Update important notes displayed on your storefront.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/admin/notes">Go to Seller Notes &rarr;</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CreditCard className="text-primary" /> Payment Config
            </CardTitle>
            <CardDescription>Manage payment instructions and account details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/admin/payment-config">Go to Payment Config &rarr;</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
