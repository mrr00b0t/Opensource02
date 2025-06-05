// The detailed version from the previous response is good.
// Ensure it uses useToast correctly and handles product/plan forms.
// No structural changes needed if the previous one was functional.
// For brevity, I'm not repeating the full code here but assume the previous version is used.
"use client"
import { useState, useEffect, type ChangeEvent } from "react"
import type { Product, Plan } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Save, Edit3, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditingProduct, setIsEditingProduct] = useState(false)
  const [currentProductForm, setCurrentProductForm] = useState<Partial<Product>>({})
  const [currentPlanForm, setCurrentPlanForm] = useState<Partial<Plan>>({})
  const [editingPlanIndex, setEditingPlanIndex] = useState<number | null>(null)
  const { toast } = useToast()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/data?file=products.json")
      if (!res.ok) throw new Error("Failed to fetch products")
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Could not load products.", variant: "destructive" })
      setProducts([])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSaveProductsToFile = async (productsToSave: Product[]) => {
    try {
      const res = await fetch("/api/admin/data?file=products.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productsToSave),
      })
      if (!res.ok) throw new Error("Failed to save products to file")
      toast({ title: "Success", description: "All products persisted to file." })
      // No need to fetchData() here as we are directly manipulating the source of truth for this action
      setProducts(productsToSave) // Update local state to reflect persisted state
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Could not persist products to file.", variant: "destructive" })
    }
  }

  const handleProductInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentProductForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
    setCurrentProductForm({ ...product }) // Deep copy plans as well
    setIsEditingProduct(true)
    setEditingPlanIndex(null)
    setCurrentPlanForm({})
  }

  const handleAddNewProduct = () => {
    setSelectedProduct(null)
    const newSlug = `new-product-${uuidv4().slice(0, 8)}`
    setCurrentProductForm({
      slug: newSlug,
      name: "New Product",
      tagline: "",
      logoUrl: "/placeholder.svg?width=80&height=80&text=New",
      accentColorClass: "shadow-gray-500/50 border-gray-500/50",
      plans: [],
    })
    setIsEditingProduct(true)
  }

  const handleSaveProductForm = () => {
    if (!currentProductForm.name || !currentProductForm.slug) {
      toast({ title: "Error", description: "Product Name and Slug are required.", variant: "destructive" })
      return
    }

    let updatedProductsList: Product[]
    const productToSave = { ...currentProductForm } as Product
    if (!Array.isArray(productToSave.plans)) productToSave.plans = []

    if (selectedProduct && selectedProduct.slug === productToSave.slug) {
      // Editing existing product, slug unchanged
      updatedProductsList = products.map((p) => (p.slug === selectedProduct.slug ? productToSave : p))
    } else if (selectedProduct && selectedProduct.slug !== productToSave.slug) {
      // Editing existing product, but slug changed
      if (products.find((p) => p.slug === productToSave.slug)) {
        toast({ title: "Error", description: "New slug already exists. Choose a unique slug.", variant: "destructive" })
        return
      }
      updatedProductsList = products.filter((p) => p.slug !== selectedProduct.slug)
      updatedProductsList.push(productToSave)
    } else {
      // Adding new product
      if (products.find((p) => p.slug === productToSave.slug)) {
        toast({ title: "Error", description: "Slug already exists. Choose a unique slug.", variant: "destructive" })
        return
      }
      updatedProductsList = [...products, productToSave]
    }

    setProducts(updatedProductsList) // Update local state immediately
    toast({
      title: "Product Updated",
      description: `${productToSave.name} has been updated in the list. Remember to persist all changes.`,
    })

    // Optionally, select the newly saved/updated product
    setSelectedProduct(productToSave)
    setCurrentProductForm({ ...productToSave })
    // setIsEditingProduct(false); // Or keep editing form open
  }

  const handleDeleteProduct = (slugToDelete: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This action will update the product list but requires a final 'Persist All Products' to save to file.",
      )
    )
      return
    const updatedProducts = products.filter((p) => p.slug !== slugToDelete)
    setProducts(updatedProducts)
    toast({
      title: "Product Removed",
      description: `Product with slug ${slugToDelete} removed from list. Persist to save changes.`,
    })

    if (selectedProduct?.slug === slugToDelete) {
      setSelectedProduct(null)
      setIsEditingProduct(false)
      setCurrentProductForm({})
    }
  }

  // Plan Management
  const handlePlanInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let processedValue: string | number | string[] = value

    if (name === "salePriceMMK" || name === "stock" || name === "officialPriceUSD") {
      processedValue = value === "" ? "" : Number(value) // Allow empty string for clearing, then convert to number
      if (isNaN(processedValue as number) && value !== "") {
        // If not a number and not empty, do not update
        toast({ title: "Input Error", description: `${name} must be a number.`, variant: "destructive" })
        return
      }
    } else if (name === "features") {
      processedValue = (value as string)
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s) // Filter out empty strings
    }

    setCurrentPlanForm((prev) => ({ ...prev, [name]: processedValue }))
  }

  const handleAddOrUpdatePlan = () => {
    if (!currentProductForm || !currentProductForm.plans) {
      toast({ title: "Error", description: "No product selected or plans array missing.", variant: "destructive" })
      return
    }
    if (!currentPlanForm.name || !currentPlanForm.id) {
      toast({ title: "Error", description: "Plan ID and Name are required.", variant: "destructive" })
      return
    }
    if (
      currentPlanForm.salePriceMMK === undefined ||
      currentPlanForm.salePriceMMK === null ||
      isNaN(Number(currentPlanForm.salePriceMMK))
    ) {
      toast({
        title: "Error",
        description: "Plan Sale Price (MMK) is required and must be a number.",
        variant: "destructive",
      })
      return
    }
    if (currentPlanForm.stock === undefined || currentPlanForm.stock === null || isNaN(Number(currentPlanForm.stock))) {
      toast({ title: "Error", description: "Plan Stock is required and must be a number.", variant: "destructive" })
      return
    }

    let updatedPlans: Plan[]
    const planToSave = { ...currentPlanForm } as Plan
    if (!Array.isArray(planToSave.features)) {
      // Ensure features is an array
      planToSave.features =
        typeof planToSave.features === "string"
          ? (planToSave.features as string)
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : []
    }

    if (editingPlanIndex !== null) {
      // Editing existing plan
      updatedPlans = currentProductForm.plans.map((plan, index) => (index === editingPlanIndex ? planToSave : plan))
    } else {
      // Adding new plan
      if (currentProductForm.plans.find((p) => p.id === planToSave.id)) {
        toast({
          title: "Error",
          description: "Plan ID already exists for this product. Choose a unique ID.",
          variant: "destructive",
        })
        return
      }
      updatedPlans = [...currentProductForm.plans, planToSave]
    }
    setCurrentProductForm((prev) => ({ ...prev, plans: updatedPlans }))
    setEditingPlanIndex(null)
    setCurrentPlanForm({ id: uuidv4().slice(0, 8) }) // Reset form, maybe with new ID
    toast({ title: "Plan Updated", description: `Plan ${planToSave.name} updated for current product.` })
  }

  const handleEditPlan = (plan: Plan, index: number) => {
    setCurrentPlanForm({ ...plan, features: Array.isArray(plan.features) ? plan.features.join(", ") : "" })
    setEditingPlanIndex(index)
  }

  const handleDeletePlan = (planIdToDelete: string) => {
    if (!currentProductForm || !currentProductForm.plans) return
    const updatedPlans = currentProductForm.plans.filter((plan) => plan.id !== planIdToDelete)
    setCurrentProductForm((prev) => ({ ...prev, plans: updatedPlans }))
    if (currentPlanForm.id === planIdToDelete) {
      setEditingPlanIndex(null)
      setCurrentPlanForm({ id: uuidv4().slice(0, 8) })
    }
    toast({ title: "Plan Removed", description: `Plan with ID ${planIdToDelete} removed from current product.` })
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-32">
        <p>Loading products...</p>
      </div>
    )

  return (
    <div className="space-y-6 pb-16">
      {" "}
      {/* Padding bottom for the fixed button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Button onClick={handleAddNewProduct} variant="default">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>
      {!isEditingProduct ? (
        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
            <CardDescription>
              {products.length === 0
                ? 'No products found. Click "Add New Product" to get started.'
                : "Click on a product to edit or view its details. Remember to 'Persist All Products' to save changes to file."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {products.length > 0 && (
              <ul className="space-y-2">
                {products.map((product) => (
                  <li
                    key={product.slug}
                    className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">({product.slug})</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleSelectProduct(product)}>
                        <Edit3 className="mr-1 h-3 w-3" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.slug)}>
                        <Trash2 className="mr-1 h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="relative">
            <CardTitle>{selectedProduct ? "Edit Product" : "Add New Product"}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsEditingProduct(false)
                setSelectedProduct(null)
              }}
              className="absolute top-3 right-3"
              aria-label="Close editor"
            >
              <XCircle />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="slug">Slug (unique identifier)</Label>
              <Input
                id="slug"
                name="slug"
                value={currentProductForm.slug || ""}
                onChange={handleProductInputChange}
                placeholder="e.g., coursera-plus"
              />
            </div>
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={currentProductForm.name || ""}
                onChange={handleProductInputChange}
                placeholder="e.g., Coursera Plus"
              />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                name="tagline"
                value={currentProductForm.tagline || ""}
                onChange={handleProductInputChange}
                placeholder="Short description"
              />
            </div>
            <div>
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                value={currentProductForm.logoUrl || ""}
                onChange={handleProductInputChange}
                placeholder="/placeholder.svg?..."
              />
            </div>
            <div>
              <Label htmlFor="accentColorClass">Accent Color CSS Class (Tailwind)</Label>
              <Input
                id="accentColorClass"
                name="accentColorClass"
                value={currentProductForm.accentColorClass || ""}
                onChange={handleProductInputChange}
                placeholder="e.g., shadow-cyan-500/50 border-cyan-500"
              />
            </div>

            {/* Plans Management */}
            <Card className="bg-muted/30 dark:bg-background/50">
              <CardHeader>
                <CardTitle>Manage Plans</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(currentProductForm.plans || []).length > 0 && (
                  <div className="space-y-2">
                    {(currentProductForm.plans || []).map((plan, index) => (
                      <div
                        key={plan.id || index}
                        className="p-3 border rounded-md flex justify-between items-start bg-background dark:bg-muted/20"
                      >
                        <div>
                          <p className="font-semibold">
                            {plan.name || "Unnamed Plan"} (ID: {plan.id || "N/A"})
                          </p>
                          <p className="text-sm">
                            Price: {plan.salePriceMMK} MMK, Stock: {plan.stock}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Features: {Array.isArray(plan.features) ? plan.features.join(", ") : ""}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 ml-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan, index)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeletePlan(plan.id!)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="p-4 border-t mt-4 space-y-3 bg-background dark:bg-muted/20 rounded-b-md">
                  <h4 className="font-semibold">{editingPlanIndex !== null ? "Edit Plan" : "Add New Plan"}</h4>
                  <div>
                    <Label htmlFor="planId">Plan ID (unique per product)</Label>
                    <Input
                      id="planId"
                      name="id"
                      value={currentPlanForm.id || ""}
                      onChange={handlePlanInputChange}
                      placeholder="e.g., 1-year"
                      disabled={editingPlanIndex !== null}
                    />
                  </div>
                  <div>
                    <Label htmlFor="planName">Plan Name</Label>
                    <Input
                      id="planName"
                      name="name"
                      value={currentPlanForm.name || ""}
                      onChange={handlePlanInputChange}
                      placeholder="e.g., 1 Year Subscription"
                    />
                  </div>
                  <div>
                    <Label htmlFor="planOfficialPriceUSD">Official Price (USD, Optional)</Label>
                    <Input
                      id="planOfficialPriceUSD"
                      name="officialPriceUSD"
                      type="number"
                      value={
                        currentPlanForm.officialPriceUSD === undefined || currentPlanForm.officialPriceUSD === null
                          ? ""
                          : String(currentPlanForm.officialPriceUSD)
                      }
                      onChange={handlePlanInputChange}
                      placeholder="e.g., 399"
                    />
                  </div>
                  <div>
                    <Label htmlFor="planSalePriceMMK">Sale Price (MMK)</Label>
                    <Input
                      id="planSalePriceMMK"
                      name="salePriceMMK"
                      type="number"
                      value={
                        currentPlanForm.salePriceMMK === undefined || currentPlanForm.salePriceMMK === null
                          ? ""
                          : String(currentPlanForm.salePriceMMK)
                      }
                      onChange={handlePlanInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="planStock">Stock</Label>
                    <Input
                      id="planStock"
                      name="stock"
                      type="number"
                      value={
                        currentPlanForm.stock === undefined || currentPlanForm.stock === null
                          ? "0"
                          : String(currentPlanForm.stock)
                      }
                      onChange={handlePlanInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="planFeatures">Features (comma-separated)</Label>
                    <Textarea
                      id="planFeatures"
                      name="features"
                      value={
                        Array.isArray(currentPlanForm.features)
                          ? currentPlanForm.features.join(", ")
                          : typeof currentPlanForm.features === "string"
                            ? currentPlanForm.features
                            : ""
                      }
                      onChange={handlePlanInputChange}
                      placeholder="Feature 1, Feature 2"
                      rows={2}
                    />
                  </div>
                  <Button onClick={handleAddOrUpdatePlan} size="sm">
                    {editingPlanIndex !== null ? "Update Plan" : "Add Plan to Product"}
                  </Button>
                  {editingPlanIndex !== null && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingPlanIndex(null)
                        setCurrentPlanForm({ id: uuidv4().slice(0, 8) })
                      }}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveProductForm} className="bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" />{" "}
              {selectedProduct ? "Save Changes to This Product" : "Add This Product to List"}
            </Button>
          </CardFooter>
        </Card>
      )}
      <div className="fixed bottom-0 left-0 sm:left-60 right-0 p-4 bg-background/80 backdrop-blur-sm border-t z-40">
        <div className="container mx-auto flex justify-end max-w-screen-xl px-0">
          <Button
            onClick={() => handleSaveProductsToFile(products)}
            className="shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            title="Persist all current product data to file"
          >
            <Save className="mr-2 h-4 w-4" /> Persist All Products to File
          </Button>
        </div>
      </div>
    </div>
  )
}
