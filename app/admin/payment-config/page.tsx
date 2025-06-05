"use client"
import { useState, useEffect, type ChangeEvent } from "react"
import type { PaymentConfig, PaymentAccount } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Save, Edit3 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
// import { v4 as uuidv4 } // Only if you decide to use UUIDs for account IDs, not strictly needed for array index management

const initialPaymentConfig: PaymentConfig = {
  telegramContact: "",
  telegramLink: "",
  paymentInstructionsTitle: "",
  paymentInstructions: "",
  accounts: [],
  confirmationNote: "",
}

export default function AdminPaymentConfigPage() {
  const [config, setConfig] = useState<PaymentConfig>(initialPaymentConfig)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const [isEditingAccount, setIsEditingAccount] = useState(false)
  const [currentAccountForm, setCurrentAccountForm] = useState<Partial<PaymentAccount>>({})
  const [editingAccountIndex, setEditingAccountIndex] = useState<number | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/data?file=payment_config.json")
      if (!res.ok) throw new Error("Failed to fetch payment configuration")
      const data = await res.json()
      setConfig(data && typeof data === "object" ? data : initialPaymentConfig)
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Could not load payment configuration.", variant: "destructive" })
      setConfig(initialPaymentConfig)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSaveToFile = async () => {
    try {
      const res = await fetch("/api/admin/data?file=payment_config.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      if (!res.ok) throw new Error("Failed to save payment configuration")
      toast({ title: "Success", description: "Payment configuration saved successfully to file." })
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Could not save payment configuration to file.", variant: "destructive" })
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setConfig((prev) => ({ ...prev, [name]: value }))
  }

  const handleAccountInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentAccountForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddNewAccountClick = () => {
    setCurrentAccountForm({ type: "", name: "", number: "", details: "" })
    setEditingAccountIndex(null)
    setIsEditingAccount(true)
  }

  const handleEditAccountClick = (account: PaymentAccount, index: number) => {
    setCurrentAccountForm({ ...account })
    setEditingAccountIndex(index)
    setIsEditingAccount(true)
  }

  const handleSaveAccountForm = () => {
    if (!currentAccountForm.type || !currentAccountForm.name || !currentAccountForm.number) {
      toast({ title: "Error", description: "Account Type, Name, and Number are required.", variant: "destructive" })
      return
    }

    const newAccount: PaymentAccount = {
      type: currentAccountForm.type!,
      name: currentAccountForm.name!,
      number: currentAccountForm.number!,
      details: currentAccountForm.details || "",
    }

    let updatedAccounts: PaymentAccount[]
    if (editingAccountIndex !== null) {
      updatedAccounts = (config.accounts || []).map((acc, index) => (index === editingAccountIndex ? newAccount : acc))
      toast({ title: "Account Updated", description: "Account updated in list. Persist to save." })
    } else {
      updatedAccounts = [...(config.accounts || []), newAccount]
      toast({ title: "Account Added", description: "Account added to list. Persist to save." })
    }
    setConfig((prev) => ({ ...prev, accounts: updatedAccounts }))
    setIsEditingAccount(false)
    setCurrentAccountForm({})
    setEditingAccountIndex(null)
  }

  const handleDeleteAccount = (indexToDelete: number) => {
    if (!confirm("Are you sure you want to delete this payment account from the list?")) return
    const updatedAccounts = (config.accounts || []).filter((_, index) => index !== indexToDelete)
    setConfig((prev) => ({ ...prev, accounts: updatedAccounts }))
    if (editingAccountIndex === indexToDelete) {
      setIsEditingAccount(false)
      setCurrentAccountForm({})
      setEditingAccountIndex(null)
    }
    toast({ title: "Account Removed", description: "Account removed from list. Persist to save." })
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-32">
        <p>Loading payment configuration...</p>
      </div>
    )

  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-3xl font-bold">Manage Payment Configuration</h1>
      <Card>
        <CardHeader>
          <CardTitle>Edit Payment Details</CardTitle>
          <CardDescription>
            Update general payment settings and manage payment accounts. Remember to 'Persist All Config' to save
            changes to file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telegramContact">Telegram Contact (@username)</Label>
              <Input
                id="telegramContact"
                name="telegramContact"
                value={config.telegramContact || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="telegramLink">Telegram Link (Full URL)</Label>
              <Input
                id="telegramLink"
                name="telegramLink"
                value={config.telegramLink || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="paymentInstructionsTitle">Payment Instructions Title</Label>
            <Input
              id="paymentInstructionsTitle"
              name="paymentInstructionsTitle"
              value={config.paymentInstructionsTitle || ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="paymentInstructions">Payment Instructions (General Text)</Label>
            <Textarea
              id="paymentInstructions"
              name="paymentInstructions"
              value={config.paymentInstructions || ""}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="confirmationNote">Order Confirmation Note</Label>
            <Textarea
              id="confirmationNote"
              name="confirmationNote"
              value={config.confirmationNote || ""}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <Card className="bg-muted/30 dark:bg-background/50">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">Payment Accounts</CardTitle>
              {!isEditingAccount && (
                <Button size="sm" onClick={handleAddNewAccountClick}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Account
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {(config.accounts || []).map((account, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-md flex justify-between items-start bg-background dark:bg-muted/20"
                >
                  <div>
                    <p className="font-semibold">
                      {account.type} - {account.name}
                    </p>
                    <p className="text-sm">Number: {account.number}</p>
                    {account.details && <p className="text-sm text-muted-foreground">Details: {account.details}</p>}
                  </div>
                  <div className="flex flex-col gap-1 ml-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditAccountClick(account, index)}>
                      <Edit3 className="mr-1 h-3 w-3" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteAccount(index)}>
                      <Trash2 className="mr-1 h-3 w-3" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
              {isEditingAccount && (
                <div className="p-4 border-t mt-4 space-y-3 bg-background dark:bg-muted/20 rounded-md">
                  <h4 className="font-semibold text-md">
                    {editingAccountIndex !== null ? "Edit Account" : "Add New Account"}
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="accountType">Type</Label>
                      <Input
                        id="accountType"
                        name="type"
                        value={currentAccountForm.type || ""}
                        onChange={handleAccountInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountName">Name</Label>
                      <Input
                        id="accountName"
                        name="name"
                        value={currentAccountForm.name || ""}
                        onChange={handleAccountInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Number/ID</Label>
                    <Input
                      id="accountNumber"
                      name="number"
                      value={currentAccountForm.number || ""}
                      onChange={handleAccountInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountDetails">Details (Optional)</Label>
                    <Textarea
                      id="accountDetails"
                      name="details"
                      value={currentAccountForm.details || ""}
                      onChange={handleAccountInputChange}
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSaveAccountForm} size="sm">
                      <Save className="mr-2 h-4 w-4" />{" "}
                      {editingAccountIndex !== null ? "Update Account in List" : "Add Account to List"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditingAccount(false)
                        setCurrentAccountForm({})
                        setEditingAccountIndex(null)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      <div className="fixed bottom-0 left-0 sm:left-60 right-0 p-4 bg-background/80 backdrop-blur-sm border-t z-40">
        <div className="container mx-auto flex justify-end max-w-screen-xl px-0">
          <Button
            onClick={handleSaveToFile}
            className="shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            title="Persist all current payment configuration to file"
          >
            <Save className="mr-2 h-4 w-4" /> Persist All Config to File
          </Button>
        </div>
      </div>
    </div>
  )
}
