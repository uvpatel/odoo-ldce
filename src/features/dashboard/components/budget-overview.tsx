import * as React from "react";
import { DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";

export interface BudgetOverviewProps {
  totalAllocated?: number;
  totalSpent?: number;
  currency?: string;
}

export function BudgetOverview({
  totalAllocated = 0,
  totalSpent = 0,
  currency = "USD",
}: BudgetOverviewProps) {
  const remaining = totalAllocated - totalSpent;
  const percentage = totalAllocated > 0 ? Math.min(100, Math.round((totalSpent / totalAllocated) * 100)) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="size-5 text-primary" />
          Budget Summary
        </CardTitle>
        <CardDescription>Overall travel budget tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Total Budget</span>
            <p className="text-lg font-bold">{formatCurrency(totalAllocated, currency)}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Total Spent</span>
            <p className="text-lg font-bold text-primary">{formatCurrency(totalSpent, currency)}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span>Spent ({percentage}%)</span>
            <span>Remaining: {formatCurrency(remaining, currency)}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
