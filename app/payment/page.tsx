"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, CreditCard, Info, Copy, Check } from "lucide-react"
import productsData from "@/data/products.json"
import paymentConfigData from "@/data/payment_config.json"
import type { Product, Plan, PaymentConfig, PaymentAccount } from "@/types"
import { useState, useEffect } from "react"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [plan, setPlan] = useState<Plan | null>(null)
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})

  const paymentConfig: PaymentConfig = paymentConfigData

  useEffect(() => {
    const productSlug = searchParams.get("productSlug")
    const planId = searchParams.get("planId")

    if (productSlug && planId) {
      const allProducts: Product[] = productsData
      const foundProduct = allProducts.find((p) => p.slug === productSlug)
      if (foundProduct) {
        setProduct(foundProduct)
        const foundPlan = foundProduct.plans.find((pl) => pl.id === planId)
        if (foundPlan) {
          setPlan(foundPlan)
        } else {
          router.replace("/") // Plan not found
        }
      } else {
        router.replace("/") // Product not found
      }
    } else {
      router.replace("/") // Missing params
    }
  }, [searchParams, router])

  const handleCopyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates((prev) => ({ ...prev, [fieldId]: true }))
      setTimeout(() => setCopiedStates((prev) => ({ ...prev, [fieldId]: false })), 2000)
    })
  }

  if (!product || !plan) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p>Loading payment details or invalid selection...</p>
      </div>
    )
  }

  const handlePaymentDone = () => {
    router.push(`/confirmation?productSlug=${product.slug}&planId=${plan.id}&price=${plan.salePriceMMK}`)
  }

  const renderAccountDetail = (account: PaymentAccount, index: number) => (
    <div key={index} className="mb-4 p-4 border rounded-md bg-muted/30">
      <h4 className="font-semibold text-lg mb-1">{account.type}</h4>
      <p className="flex justify-between items-center">
        Account Name: {account.name}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCopyToClipboard(account.name, `name-${index}`)}
          className="ml-2"
        >
          {copiedStates[`name-${index}`] ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
        </Button>
      </p>
      <p className="flex justify-between items-center">
        Number/ID: {account.number}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCopyToClipboard(account.number, `number-${index}`)}
          className="ml-2"
        >
          {copiedStates[`number-${index}`] ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
        </Button>
      </p>
      {account.details && <p className="text-sm text-muted-foreground mt-1">{account.details}</p>}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button onClick={() => router.back()} variant="outline" size="sm">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Plans
      </Button>

      <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-md border border-border/40 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Purchase</CardTitle>
          <CardDescription>
            You are purchasing: {product.name} - {plan.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="default" className="bg-primary/10 border-primary/30">
            <CreditCard className="h-5 w-5 text-primary" />
            <AlertTitle className="text-primary font-semibold">Total Amount Due</AlertTitle>
            <AlertDescription className="text-2xl font-bold text-primary">
              {plan.salePriceMMK.toLocaleString()} MMK
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              {paymentConfig.paymentInstructionsTitle || "Payment Instructions"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {paymentConfig.paymentInstructions || "Please follow the payment steps."}
            </p>

            {/* Safety check for accounts array */}
            {paymentConfig.accounts && paymentConfig.accounts.length > 0 ? (
              paymentConfig.accounts.map(renderAccountDetail)
            ) : (
              <p className="text-muted-foreground">
                No payment accounts are currently configured. Please contact support.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handlePaymentDone}
            className="w-full text-lg py-6 bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="mr-2 h-5 w-5" /> I've Made Payment
          </Button>
        </CardFooter>
      </Card>
      <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
        <Info className="h-5 w-5" />
        <AlertTitle>Important Notice</AlertTitle>
        <AlertDescription>
          This is a UI demonstration. No real payment will be processed. Do NOT send money to the listed accounts as
          they are placeholders.
        </AlertDescription>
      </Alert>
    </div>
  )
}
