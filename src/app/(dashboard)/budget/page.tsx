import * as React from "react"
import Link from "next/link"
import { WalletCardsIcon, DollarSignIcon, TrendingUpIcon, ArrowRightIcon, PlusIcon, PieChartIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const ALL_TRIP_BUDGETS = [
  {
    tripId: "trip-tokyo-2026",
    tripName: "Tokyo Spring Sakura Tour",
    totalBudget: 3200,
    spent: 2140,
    currency: "USD",
    categoryBreakdown: { Accommodation: 980, Dining: 620, Transit: 340, Activities: 200 },
  },
  {
    tripId: "trip-paris-2026",
    tripName: "Paris & French Riviera Roadtrip",
    totalBudget: 4500,
    spent: 1200,
    currency: "USD",
    categoryBreakdown: { Accommodation: 650, Dining: 320, Transit: 150, Activities: 80 },
  },
  {
    tripId: "trip-iceland-2026",
    tripName: "Iceland Ring Road & Aurora Hunt",
    totalBudget: 2800,
    spent: 450,
    currency: "USD",
    categoryBreakdown: { Accommodation: 300, Dining: 50, Transit: 100, Activities: 0 },
  },
]

export default function BudgetOverviewPage() {
  const totalAllocated = ALL_TRIP_BUDGETS.reduce((acc, t) => acc + t.totalBudget, 0)
  const totalSpent = ALL_TRIP_BUDGETS.reduce((acc, t) => acc + t.spent, 0)

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Trip Budgets & Expenses</h1>
          <p className="text-sm text-muted-foreground">
            Monitor expenditure, track budget ceilings, and analyze category breakdowns across all trips.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Cumulative Budget</CardDescription>
            <CardTitle className="text-2xl font-bold">${totalAllocated.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Across 3 active and upcoming trips
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Tracked Expenses</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-600">${totalSpent.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {Math.round((totalSpent / totalAllocated) * 100)}% of total allocated funds
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Remaining Allowance</CardDescription>
            <CardTitle className="text-2xl font-bold text-primary">
              ${(totalAllocated - totalSpent).toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Available across all itineraries
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">Active Trip Budgets</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {ALL_TRIP_BUDGETS.map((b) => {
            const pct = Math.round((b.spent / b.totalBudget) * 100)
            return (
              <Card key={b.tripId} className="flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base line-clamp-1">{b.tripName}</CardTitle>
                  <CardDescription className="text-xs">
                    ${b.spent.toLocaleString()} of ${b.totalBudget.toLocaleString()} spent
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-muted-foreground flex justify-between">
                    <span>{pct}% utilized</span>
                    <span>${(b.totalBudget - b.spent).toLocaleString()} remaining</span>
                  </div>
                </CardContent>
                <div className="p-3 border-t bg-muted/10">
                  <Button size="sm" variant="ghost" render={<Link href={`/trips/${b.tripId}/budget`} />} className="w-full text-xs gap-1">
                    <span>Manage Trip Expenses</span>
                    <ArrowRightIcon className="size-3" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
