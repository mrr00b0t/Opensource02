"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Copy, Send, Home } from "lucide-react"
import productsData from "@/data/products.json"
import paymentConfigData from "@/data/payment_config.json"
import type { Product, PaymentConfig } from "@/types"
import { useState, useEffect, useRef } from "react"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [productName, setProductName] = useState<string>("")
  const [planName, setPlanName] = useState<string>("")
  const [price, setPrice] = useState<string>("")
  const [receiptText, setReceiptText] = useState<string>("")
  const [isCopied, setIsCopied] = useState(false)
  const receiptRef = useRef<HTMLDivElement>(null)

  const paymentConfig: PaymentConfig = paymentConfigData

  useEffect(() => {
    const productSlug = searchParams.get("productSlug")
    const planId = searchParams.get("planId")
    const paidPrice = searchParams.get("price")

    if (productSlug && planId && paidPrice) {
      const allProducts: Product[] = productsData
      const foundProduct = allProducts.find((p) => p.slug === productSlug)
      if (foundProduct) {
        const foundPlan = foundProduct.plans.find((pl) => pl.id === planId)
        if (foundPlan) {
          setProductName(foundProduct.name)
          setPlanName(foundPlan.name)
          setPrice(Number.parseFloat(paidPrice).toLocaleString() + " MMK")

          const generatedReceipt = `
------------------------------------
RepliPay - Order Confirmation
------------------------------------
Product: ${foundProduct.name}
Plan: ${foundPlan.name}
Price Paid: ${Number.parseFloat(paidPrice).toLocaleString()} MMK
Date: ${new Date().toLocaleString()}
------------------------------------
${paymentConfig.confirmationNote || "Thank you for your purchase!"}
Contact: ${paymentConfig.telegramContact || "Support"}
------------------------------------
          `
          setReceiptText(generatedReceipt.trim())
          return
        }
      }
    }
    // If data is missing or invalid, redirect
    // router.replace("/");
    // For demo, show generic message if params are missing
    setProductName("N/A")
    setPlanName("N/A")
    setPrice("N/A")
    setReceiptText("Error: Could not retrieve order details.")
  }, [searchParams, router, paymentConfig.confirmationNote, paymentConfig.telegramContact])

  const handleCopyToClipboard = () => {
    if (receiptRef.current) {
      navigator.clipboard.writeText(receiptRef.current.innerText).then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      })
    }
  }

  const telegramLink =
    paymentConfig.telegramLink ||
    `https://t.me/${(paymentConfig.telegramContact || "replipaysupport").replace("@", "")}`

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-md border border-border/40 shadow-xl">
        <CardHeader className="items-center text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <CardTitle className="text-3xl">Thank You!</CardTitle>
          <CardDescription className="text-lg">Your order has been received.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="default" className="bg-green-500/10 border-green-500/30">
            <AlertTitle className="font-semibold text-green-600 dark:text-green-400">Order Summary</AlertTitle>
            <AlertDescription>
              <p>
                <strong>Product:</strong> {productName}
              </p>
              <p>
                <strong>Plan:</strong> {planName}
              </p>
              <p>
                <strong>Price Paid:</strong> {price}
              </p>
            </AlertDescription>
          </Alert>

          <div className="p-4 border rounded-md bg-muted/30">
            <h4 className="font-semibold mb-2">Your Receipt:</h4>
            <pre ref={receiptRef} className="whitespace-pre-wrap text-sm p-3 bg-background rounded-md overflow-x-auto">
              {receiptText}
            </pre>
            <Button onClick={handleCopyToClipboard} variant="outline" size="sm" className="mt-2 w-full">
              <Copy className="mr-2 h-4 w-4" /> {isCopied ? "Copied!" : "Copy Receipt"}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            {paymentConfig.confirmationNote || "Please contact support if you have any questions."}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button asChild className="w-full sm:w-auto flex-1 bg-cyan-600 hover:bg-cyan-700 text-white">
            <a href={telegramLink} target="_blank" rel="noopener noreferrer">
              <Send className="mr-2 h-4 w-4" /> Contact Support
            </a>
          </Button>
          <Button onClick={() => router.push("/")} variant="outline" className="w-full sm:w-auto flex-1">
            <Home className="mr-2 h-4 w-4" /> Back to Homepage
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
