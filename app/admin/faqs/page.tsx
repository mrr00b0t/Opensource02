// The detailed version from the previous response is good.
// Ensure it uses useToast and uuidv4 correctly.
// No structural changes needed if the previous one was functional.
// For brevity, I'm not repeating the full code here but assume the previous version is used.
"use client"
import { useState, useEffect, type ChangeEvent } from "react"
import type { FaqItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Save, Edit3, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentFaq, setCurrentFaq] = useState<Partial<FaqItem>>({})
  const { toast } = useToast()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/data?file=faqs.json")
      if (!res.ok) throw new Error("Failed to fetch FAQs")
      const data = await res.json()
      setFaqs(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Could not load FAQs.", variant: "destructive" })
      setFaqs([])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSaveFaqsToFile = async (faqsToSave: FaqItem[]) => {
    try {
      const res = await fetch("/api/admin/data?file=faqs.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqsToSave),
      })
      if (!res.ok) throw new Error("Failed to save FAQs to file")
      toast({ title: "Success", description: "FAQs saved successfully to file." })
      setFaqs(faqsToSave) // Update local state
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Could not save FAQs to file.", variant: "destructive" })
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentFaq((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditFaq = (faq: FaqItem) => {
    setCurrentFaq({ ...faq })
    setIsEditing(true)
  }

  const handleAddNewFaq = () => {
    setCurrentFaq({ id: uuidv4(), question: "", answer: "" })
    setIsEditing(true)
  }

  const handleSaveForm = () => {
    if (!currentFaq.question || !currentFaq.answer) {
      toast({ title: "Error", description: "Question and Answer are required.", variant: "destructive" })
      return
    }
    if (!currentFaq.id) {
      // Ensure ID exists for new FAQs
      currentFaq.id = uuidv4()
    }

    let updatedFaqsList: FaqItem[]
    const existingFaqIndex = faqs.findIndex((f) => f.id === currentFaq.id)

    if (existingFaqIndex > -1) {
      updatedFaqsList = faqs.map((f) => (f.id === currentFaq.id ? ({ ...currentFaq } as FaqItem) : f))
    } else {
      updatedFaqsList = [...faqs, { ...currentFaq } as FaqItem]
    }

    setFaqs(updatedFaqsList) // Update local state immediately
    toast({
      title: "FAQ Updated",
      description: `FAQ "${currentFaq.question?.substring(0, 20)}..." updated in list. Persist to save changes.`,
    })
    setIsEditing(false)
    setCurrentFaq({})
  }

  const handleDeleteFaq = (idToDelete: string) => {
    if (!confirm("Are you sure you want to delete this FAQ? This updates the list, persist to save to file.")) return
    const updatedFaqs = faqs.filter((f) => f.id !== idToDelete)
    setFaqs(updatedFaqs)
    toast({ title: "FAQ Removed", description: `FAQ removed from list. Persist to save changes.` })
    if (currentFaq?.id === idToDelete) {
      setIsEditing(false)
      setCurrentFaq({})
    }
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-32">
        <p>Loading FAQs...</p>
      </div>
    )

  return (
    <div className="space-y-6 pb-16">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage FAQs</h1>
        {!isEditing && (
          <Button onClick={handleAddNewFaq}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New FAQ
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardHeader className="relative">
            <CardTitle>
              {currentFaq.id && faqs.find((f) => f.id === currentFaq.id) ? "Edit FAQ" : "Add New FAQ"}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsEditing(false)
                setCurrentFaq({})
              }}
              className="absolute top-3 right-3"
              aria-label="Close editor"
            >
              <XCircle />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="question">Question</Label>
              <Input id="question" name="question" value={currentFaq.question || ""} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                name="answer"
                value={currentFaq.answer || ""}
                onChange={handleInputChange}
                rows={5}
              />
            </div>
            {/* ID is hidden but part of the form state */}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveForm} className="bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" />{" "}
              {currentFaq.id && faqs.find((f) => f.id === currentFaq.id) ? "Save Changes to FAQ" : "Add FAQ to List"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>FAQ List</CardTitle>
            <CardDescription>
              {faqs.length === 0
                ? 'No FAQs found. Click "Add New FAQ" to get started.'
                : "Click on an FAQ to edit. Remember to 'Persist All FAQs' to save changes to file."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {faqs.length > 0 && (
              <ul className="space-y-2">
                {faqs.map((faq) => (
                  <li
                    key={faq.id}
                    className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <span className="truncate w-3/4 flex-1" title={faq.question}>
                      {faq.question}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditFaq(faq)}>
                        <Edit3 className="mr-1 h-3 w-3" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteFaq(faq.id)}>
                        <Trash2 className="mr-1 h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
      <div className="fixed bottom-0 left-0 sm:left-60 right-0 p-4 bg-background/80 backdrop-blur-sm border-t z-40">
        <div className="container mx-auto flex justify-end max-w-screen-xl px-0">
          <Button
            onClick={() => handleSaveFaqsToFile(faqs)}
            className="shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            title="Persist all current FAQ data to file"
          >
            <Save className="mr-2 h-4 w-4" /> Persist All FAQs to File
          </Button>
        </div>
      </div>
    </div>
  )
}
