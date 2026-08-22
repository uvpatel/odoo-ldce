"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import {
  WalletCardsIcon,
  PlusIcon,
  DollarSignIcon,
  CreditCardIcon,
  ReceiptIcon,
  Trash2Icon,
  TrendingUpIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Expense = {
  id: string
  title: string
  category: string
  amount: number
  date: string
  paidBy: string
}

const INITIAL_EXPENSES: Expense[] = [
  { id: "e-1", title: "Shibuya Stream Hotel (3 nights)", category: "Accommodation", amount: 640, date: "2026-04-10", paidBy: "You" },
  { id: "e-2", title: "Shinkansen Express Tokyo -> Kyoto", category: "Transit", amount: 280, date: "2026-04-14", paidBy: "Elena" },
  { id: "e-3", title: "Tsukiji Sushi Tasting Dinner", category: "Food & Dining", amount: 160, date: "2026-04-11", paidBy: "Marco" },
  { id: "e-4", title: "Shibuya Sky & Museum Passes", category: "Activities", amount: 95, date: "2026-04-10", paidBy: "You" },
]

export default function TripBudgetPage() {
  const params = useParams()
  const [expenses, setExpenses] = React.useState<Expense[]>(INITIAL_EXPENSES)
  const [newTitle, setNewTitle] = React.useState("")
  const [newAmount, setNewAmount] = React.useState("")
  const [newCategory, setNewCategory] = React.useState("Food & Dining")

  const totalBudget = 3200
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0)
  const remaining = totalBudget - totalSpent
  const spentPercent = Math.round((totalSpent / totalBudget) * 100)

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newAmount) {
      toast.error("Please provide both title and amount.")
      return
    }

    const item: Expense = {
      id: `exp-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      amount: parseFloat(newAmount),
      date: new Date().toISOString().split("T")[0],
      paidBy: "You",
    }

    setExpenses([item, ...expenses])
    setNewTitle("")
    setNewAmount("")
    toast.success("Expense logged successfully!")
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id))
    toast.info("Expense removed.")
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Trip Budget</CardDescription>
            <CardTitle className="text-2xl font-bold">${totalBudget.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Target maximum spending
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Expenses Tracked</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-600">${totalSpent.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {spentPercent}% of budget allocated
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Remaining Balance</CardDescription>
            <CardTitle className="text-2xl font-bold text-primary">${remaining.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Available for remaining days
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-base">Expense Log</CardTitle>
                <CardDescription className="text-xs">Itemized expenses logged by group members</CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">
                {expenses.length} transactions
              </Badge>
            </CardHeader>
            <CardContent className="p-0 divide-y">
              {expenses.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{item.title}</span>
                      <Badge variant="outline" className="text-[10px] py-0">{item.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Paid by {item.paidBy} on {item.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-foreground font-mono">
                      ${item.amount.toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleDeleteExpense(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2Icon className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ReceiptIcon className="size-4 text-primary" />
                Log New Expense
              </CardTitle>
              <CardDescription className="text-xs">Record shared cost or personal spend</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddExpense} className="space-y-3.5">
                <Field>
                  <FieldLabel htmlFor="expenseTitle">Expense Description</FieldLabel>
                  <Input
                    id="expenseTitle"
                    placeholder="e.g. Dinner, Train ticket..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="expenseAmount">Amount ($ USD)</FieldLabel>
                  <Input
                    id="expenseAmount"
                    type="number"
                    step="0.01"
                    placeholder="45.00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="category">Category</FieldLabel>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Accommodation">Accommodation</SelectItem>
                      <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                      <SelectItem value="Transit">Transit</SelectItem>
                      <SelectItem value="Activities">Activities</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Button type="submit" className="w-full gap-2">
                  <PlusIcon className="size-4" />
                  Add Expense
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
