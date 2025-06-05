// The form-based UI from the previous response is good.
// For brevity, I'm not repeating the full code here but assume the previous version is used.
"use client"
import { useState, useEffect, type ChangeEvent } from "react"
import type { SellerNotes } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Save, Edit3 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AdminSellerNotesPage() {
  const [notesData, setNotesData] = useState<SellerNotes>({ title: "", notes: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [currentNoteText, setCurrentNoteText] = useState("")
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null)
  const { toast } = useToast()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/data?file=seller_notes.json")
      if (!res.ok) throw new Error("Failed to fetch seller notes")
      const data = await res.json()
      setNotesData(
        data && typeof data.title === "string" && Array.isArray(data.notes) ? data : { title: "", notes: [] },
      )
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Could not load seller notes.", variant: "destructive" })
      setNotesData({ title: "", notes: [] })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSaveToFile = async () => {
    try {
      const res = await fetch("/api/admin/data?file=seller_notes.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notesData),
      })
      if (!res.ok) throw new Error("Failed to save seller notes")
      toast({ title: "Success", description: "Seller notes saved successfully to file." })
      // Optionally re-fetch or assume local state is source of truth after save
      // fetchData();
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Could not save seller notes to file.", variant: "destructive" })
    }
  }

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNotesData((prev) => ({ ...prev, title: e.target.value }))
  }

  const handleAddOrUpdateNote = () => {
    if (!currentNoteText.trim()) {
      toast({ title: "Info", description: "Note text cannot be empty." })
      return
    }
    const newNotes = [...(notesData.notes || [])]
    if (editingNoteIndex !== null) {
      newNotes[editingNoteIndex] = currentNoteText
      toast({ title: "Note Updated", description: "Note updated in the list. Persist to save." })
    } else {
      newNotes.push(currentNoteText)
      toast({ title: "Note Added", description: "Note added to the list. Persist to save." })
    }
    setNotesData((prev) => ({ ...prev, notes: newNotes }))
    setCurrentNoteText("")
    setEditingNoteIndex(null)
  }

  const handleEditNote = (note: string, index: number) => {
    setCurrentNoteText(note)
    setEditingNoteIndex(index)
  }

  const handleDeleteNote = (indexToDelete: number) => {
    if (!confirm("Are you sure you want to delete this note from the list?")) return
    const newNotes = (notesData.notes || []).filter((_, index) => index !== indexToDelete)
    setNotesData((prev) => ({ ...prev, notes: newNotes }))
    if (editingNoteIndex === indexToDelete) {
      setCurrentNoteText("")
      setEditingNoteIndex(null)
    }
    toast({ title: "Note Removed", description: "Note removed from the list. Persist to save." })
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-32">
        <p>Loading seller notes...</p>
      </div>
    )

  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-3xl font-bold">Manage Seller Notes</h1>
      <Card>
        <CardHeader>
          <CardTitle>Edit Seller Notes</CardTitle>
          <CardDescription>
            Update the title and list of notes displayed on your storefront. Remember to 'Persist All Notes' to save
            changes to file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notesTitle">Title</Label>
            <Input
              id="notesTitle"
              value={notesData.title || ""}
              onChange={handleTitleChange}
              placeholder="e.g., Important Seller Notes"
            />
          </div>

          <div className="space-y-3">
            <Label className="block mb-1">Notes List</Label>
            {(notesData.notes || []).length > 0 && (
              <ul className="space-y-2 mb-4 max-h-60 overflow-y-auto p-1 border rounded-md">
                {(notesData.notes || []).map((note, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2 border-b last:border-b-0 rounded-md bg-muted/30 hover:bg-muted/50"
                  >
                    <span className="flex-1 mr-2 text-sm">{note}</span>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditNote(note, index)}
                        title="Edit Note"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteNote(index)}
                        title="Delete Note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="p-3 border rounded-md bg-muted/20">
              <Label htmlFor="newNoteText" className="text-sm font-medium">
                {editingNoteIndex !== null ? "Edit Note Text:" : "Add New Note:"}
              </Label>
              <Textarea
                id="newNoteText"
                value={currentNoteText}
                onChange={(e) => setCurrentNoteText(e.target.value)}
                placeholder="Enter note text here..."
                rows={3}
                className="mt-1 mb-2"
              />
              <div className="flex items-center gap-2">
                <Button onClick={handleAddOrUpdateNote} size="sm">
                  {editingNoteIndex !== null ? <Save className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
                  <span className="ml-2">{editingNoteIndex !== null ? "Update Note in List" : "Add Note to List"}</span>
                </Button>
                {editingNoteIndex !== null && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCurrentNoteText("")
                      setEditingNoteIndex(null)
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="fixed bottom-0 left-0 sm:left-60 right-0 p-4 bg-background/80 backdrop-blur-sm border-t z-40">
        <div className="container mx-auto flex justify-end max-w-screen-xl px-0">
          <Button
            onClick={handleSaveToFile}
            className="shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            title="Persist all current seller notes to file"
          >
            <Save className="mr-2 h-4 w-4" /> Persist All Notes to File
          </Button>
        </div>
      </div>
    </div>
  )
}
