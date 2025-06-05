import ProductCard from "@/components/product-card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, HelpCircle } from "lucide-react"

// Simulating data fetching. In a real app, this might be an API call.
// For Next.js, direct import of JSON is fine.
import productsData from "@/data/products.json"
import faqsData from "@/data/faqs.json"
import sellerNotesData from "@/data/seller_notes.json"
import type { Product, FaqItem, SellerNotes } from "@/types"

export default function HomePage() {
  const products: Product[] = productsData
  const faqs: FaqItem[] = faqsData
  const sellerNotes: SellerNotes = sellerNotesData

  return (
    <div className="space-y-12">
      <section id="products">
        <h2 className="text-3xl font-bold mb-8 text-center tracking-tight">
          Our Digital <span className="text-cyan-400">Products</span> &{" "}
          <span className="text-violet-400">Services</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section id="seller-notes">
        <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-md border border-border/40 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Lightbulb className="w-6 h-6 mr-2 text-yellow-400" />
              {sellerNotes.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            {sellerNotes.notes.map((note, index) => (
              <p key={index}>{note}</p>
            ))}
          </CardContent>
        </Card>
      </section>

      <section id="faq">
        <h2 className="text-3xl font-bold mb-8 text-center tracking-tight">
          <HelpCircle className="inline-block w-8 h-8 mr-2 text-violet-400" />
          Frequently Asked <span className="text-cyan-400">Questions</span>
        </h2>
        <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-md border border-border/40 shadow-lg">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-lg hover:text-cyan-400 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
