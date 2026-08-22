"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  WalletCardsIcon,
  PlusIcon,
  ReceiptIcon,
  Trash2Icon,
  Loader2Icon,
  TrendingUpIcon,
  BarChart3Icon,
  CalendarDaysIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { tripKeys } from "@/lib/query-keys";
import { apiClient } from "@/lib/api-client";
import {
  tripsApi,
  type BudgetCategorySummary,
  type BudgetSummary,
  type ExpenseCategory,
  type ExpenseListResponse,
  type TripDetails,
} from "@/features/trips/api/trips.api";

const addExpenseSchema = z.object({
  title: z.string().trim().min(1, "Description is required"),
  amount: z.string().refine(
    (value) => Number.isFinite(Number(value)) && Number(value) > 0,
    "Amount must be greater than 0"
  ),
  category: z.enum(["transport", "accommodation", "activity", "food", "shopping", "other"]),
  expenseDate: z.string().optional(),
  description: z.string().trim().max(1000, "Notes are too long").optional(),
});
type AddExpenseValues = z.infer<typeof addExpenseSchema>;

const CATEGORY_COLORS: Record<string, string> = {
  transport: "bg-amber-100 text-amber-700",
  accommodation: "bg-purple-100 text-purple-700",
  activity: "bg-blue-100 text-blue-700",
  food: "bg-emerald-100 text-emerald-700",
  shopping: "bg-pink-100 text-pink-700",
  other: "bg-gray-100 text-gray-700",
};

const CATEGORY_LABELS: Record<string, string> = {
  transport: "Transport",
  accommodation: "Accommodation",
  activity: "Activity",
  food: "Food",
  shopping: "Shopping",
  other: "Other",
};

export default function TripBudgetPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const queryClient = useQueryClient();

  const { data: budget, isLoading: budgetLoading } = useQuery<BudgetSummary>({
    queryKey: tripKeys.budget(tripId),
    queryFn: () => tripsApi.budget(tripId),
    enabled: !!tripId,
  });

  const { data: expenseData, isLoading: expensesLoading } = useQuery<ExpenseListResponse>({
    queryKey: tripKeys.expenses(tripId),
    queryFn: () => apiClient.get(`/api/trips/${tripId}/expenses`),
    enabled: !!tripId,
  });

  const { data: tripData, isLoading: tripLoading } = useQuery<TripDetails>({
    queryKey: tripKeys.detail(tripId),
    queryFn: () => apiClient.get(`/api/trips/${tripId}`),
    enabled: !!tripId,
  });

  const isLoading = budgetLoading || expensesLoading || tripLoading;
  const canManageBudget = tripData?.permissions.canManageBudget === true;
  const expenses = expenseData?.items ?? [];
  const totalBudget = budget?.totalBudget ?? 0;
  const totalSpent = budget?.totalSpent ?? 0;
  const remaining = budget?.remainingBudget ?? totalBudget;
  const percentUsed = budget?.percentageUsed ?? 0;
  const currency = budget?.currency ?? "USD";
  const tripDays = tripData?.days.length ?? 0;
  const averagePerDay = tripDays > 0 ? totalSpent / tripDays : 0;
  const categoryBreakdown = budget
    ? (Object.entries(budget.breakdown) as [ExpenseCategory, BudgetCategorySummary][]).filter(
        ([, value]) => value.planned > 0 || value.spent > 0
      )
    : [];

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<AddExpenseValues>({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: { category: "food", amount: "" },
  });

  const selectedCategory = useWatch({ control, name: "category" });

  const addExpenseMutation = useMutation({
    mutationFn: (data: AddExpenseValues) =>
      apiClient.post(`/api/trips/${tripId}/expenses`, {
        title: data.title.trim(),
        amount: Number(data.amount),
        category: data.category,
        description: data.description?.trim() || null,
        expenseDate: data.expenseDate || null,
        currency,
        isEstimated: false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: tripKeys.budget(tripId) });
      queryClient.invalidateQueries({ queryKey: tripKeys.expenses(tripId) });
      toast.success("Expense logged!");
      reset();
    },
    onError: (e: Error) => toast.error(e.message || "Failed to add expense"),
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (expenseId: string) =>
      apiClient.delete(`/api/trips/${tripId}/expenses/${expenseId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: tripKeys.budget(tripId) });
      queryClient.invalidateQueries({ queryKey: tripKeys.expenses(tripId) });
      toast.info("Expense removed.");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to delete expense"),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Budget summary cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs flex items-center gap-1.5">
              <WalletCardsIcon className="size-3.5 text-primary" />
              Total Budget
            </CardDescription>
            <CardTitle className="text-2xl font-bold tabular-nums">
              {currency} {totalBudget > 0 ? totalBudget.toLocaleString() : "—"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {totalBudget > 0 ? "Target maximum spending" : "No budget limit set"}
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs flex items-center gap-1.5">
              <ReceiptIcon className="size-3.5 text-emerald-600" />
              Total Tracked
            </CardDescription>
            <CardTitle className="text-2xl font-bold tabular-nums text-emerald-600">
              {currency} {totalSpent.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={percentUsed} className="h-1.5 mb-1" />
            <p className="text-xs text-muted-foreground">{percentUsed.toFixed(1)}% of budget</p>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs flex items-center gap-1.5">
              <TrendingUpIcon className={`size-3.5 ${remaining < 0 ? "text-destructive" : "text-primary"}`} />
              Remaining
            </CardDescription>
            <CardTitle
              className={`text-2xl font-bold tabular-nums ${
                remaining < 0 ? "text-destructive" : "text-primary"
              }`}
            >
              {currency} {Math.abs(remaining).toLocaleString()}
              {remaining < 0 ? " over" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {remaining >= 0 ? "Available to spend" : "Over budget"}
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5 text-xs">
              <CalendarDaysIcon className="size-3.5 text-primary" />
              Average per Day
            </CardDescription>
            <CardTitle className="text-2xl font-bold tabular-nums">
              {currency} {averagePerDay.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {tripDays > 0 ? `Across ${tripDays} planned day${tripDays === 1 ? "" : "s"}` : "Add trip dates to calculate"}
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown + Add Expense */}
      {categoryBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3Icon className="size-4 text-primary" />
              Spending by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryBreakdown.map(([category, summary]) => {
                const pct = totalSpent > 0 ? (summary.spent / totalSpent) * 100 : 0;
                return (
                  <div key={category} className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded capitalize w-28 shrink-0 text-center ${
                        CATEGORY_COLORS[category] ?? CATEGORY_COLORS.other
                      }`}
                    >
                      {CATEGORY_LABELS[category] ?? category}
                    </span>
                    <Progress value={pct} className="flex-1 h-1.5" />
                    <span className="text-xs font-mono font-semibold w-20 text-right shrink-0">
                      {currency} {summary.spent.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Expense log */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-base">Expense Log</CardTitle>
                <CardDescription className="text-xs">
                  All tracked expenses for this trip
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">
                {expenseData?.total ?? expenses.length} transactions
              </Badge>
            </CardHeader>
            <CardContent className="p-0 divide-y">
              {expenses.length === 0 ? (
                <p className="text-sm text-muted-foreground px-4 py-8 text-center">
                  No expenses logged yet. Add your first expense to start tracking.
                </p>
              ) : (
                expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors group"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground line-clamp-1">
                          {expense.title}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded capitalize shrink-0 ${
                            CATEGORY_COLORS[expense.category] ?? CATEGORY_COLORS.other
                          }`}
                        >
                          {CATEGORY_LABELS[expense.category] ?? expense.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {expense.isEstimated ? "Estimated" : "Actual expense"}
                        {expense.expenseDate
                          ? ` · ${new Date(expense.expenseDate).toLocaleDateString()}`
                          : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <span className="text-sm font-bold font-mono text-foreground">
                        {expense.currency} {Number(expense.amount).toFixed(2)}
                      </span>
                      {canManageBudget ? <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => deleteExpenseMutation.mutate(expense.id)}
                        disabled={deleteExpenseMutation.isPending}
                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {deleteExpenseMutation.isPending ? (
                          <Loader2Icon className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2Icon className="size-3.5" />
                        )}
                      </Button> : null}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add expense form */}
        {canManageBudget ? <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ReceiptIcon className="size-4 text-primary" />
                Log New Expense
              </CardTitle>
              <CardDescription className="text-xs">
                Record a shared cost or personal spend
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit((data) => addExpenseMutation.mutate(data))}
                className="space-y-3.5"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="expenseTitle">Description *</Label>
                  <Input
                    id="expenseTitle"
                    placeholder="e.g. Dinner, Train ticket..."
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="expenseAmount">Amount ({currency})</Label>
                  <Input
                    id="expenseAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="45.00"
                    {...register("amount")}
                  />
                  {errors.amount && (
                    <p className="text-xs text-destructive">{errors.amount.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="expenseCategory">Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(v) => setValue("category", v as AddExpenseValues["category"])}
                  >
                    <SelectTrigger id="expenseCategory">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="accommodation">Accommodation</SelectItem>
                      <SelectItem value="activity">Activity</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="expenseDate">Date</Label>
                  <Input id="expenseDate" type="date" {...register("expenseDate")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="expenseDescription">Notes</Label>
                  <Input
                    id="expenseDescription"
                    placeholder="Optional details"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-xs text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={addExpenseMutation.isPending}
                >
                  {addExpenseMutation.isPending ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <PlusIcon className="size-4" />
                  )}
                  {addExpenseMutation.isPending ? "Adding..." : "Add Expense"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div> : (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center">
              <WalletCardsIcon className="mx-auto mb-3 size-9 text-muted-foreground/35" />
              <p className="text-sm font-semibold">View-only budget</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Only the trip owner and editors can add or remove expenses.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
