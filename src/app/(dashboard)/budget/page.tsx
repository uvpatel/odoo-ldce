"use client";

import * as React from "react";
import Link from "next/link";
import { useTrips } from "@/features/trips/hooks/use-trips";
import {
  WalletCardsIcon,
  ArrowRightIcon,
  PlusIcon,
  PlaneIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Trip } from "@/features/trips/api/trips.api";

export default function BudgetOverviewPage() {
  const { data, isLoading } = useTrips({ limit: 50, sortBy: "createdAt", sortOrder: "desc" });
  const trips = data?.items ?? [];

  const tripsWithBudget = trips.filter((t) => t.budgetLimit && parseFloat(t.budgetLimit) > 0);
  const totalsByCurrency = Object.entries(
    tripsWithBudget.reduce<Record<string, number>>((totals, trip) => {
      totals[trip.currency] = (totals[trip.currency] ?? 0) + Number(trip.budgetLimit ?? 0);
      return totals;
    }, {})
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-2">
            <WalletCardsIcon className="size-7 text-primary" />
            Trip Budgets & Expenses
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor expenditure, track budget ceilings, and analyze category breakdowns across all trips.
          </p>
        </div>
        <Button asChild size="sm" className="gap-1.5 shrink-0">
          <Link href="/trips/new">
            <PlusIcon className="size-4" />
            Plan New Trip
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Cumulative Budget Limit</CardDescription>
              <CardTitle className="text-lg font-bold font-mono leading-relaxed">
                {totalsByCurrency.length > 0
                  ? totalsByCurrency
                      .map(([currency, total]) => `${currency} ${total.toLocaleString()}`)
                      .join(" · ")
                  : "—"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Across {tripsWithBudget.length} budgeted journeys
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Active Trips</CardDescription>
              <CardTitle className="text-2xl font-bold text-emerald-600 font-mono">
                {trips.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              {trips.filter((t) => t.status === "ongoing" || t.status === "planned").length} upcoming or ongoing
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Budgeted Trips</CardDescription>
              <CardTitle className="text-2xl font-bold text-primary font-mono">
                {tripsWithBudget.length} / {trips.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Trips with financial ceilings defined
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">All Trip Budgets</h2>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <PlaneIcon className="size-12 mx-auto text-muted-foreground opacity-30 mb-3" />
            <CardTitle className="text-base">No trips found</CardTitle>
            <CardDescription className="text-xs mt-1">
              Create your first trip to start managing travel budgets and expenses.
            </CardDescription>
            <Button asChild size="sm" className="mt-4 gap-1.5">
              <Link href="/trips/new">
                <PlusIcon className="size-3.5" />
                Create Trip
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {trips.map((trip: Trip) => {
              const limit = trip.budgetLimit ? parseFloat(trip.budgetLimit) : 0;
              return (
                <Card key={trip.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <Badge variant="outline" className="capitalize text-[10px]">
                        {trip.status}
                      </Badge>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {trip.currency}
                      </span>
                    </div>
                    <CardTitle className="text-base line-clamp-1">{trip.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {limit > 0
                        ? `Target: ${trip.currency} ${limit.toLocaleString()}`
                        : "No budget limit configured"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Budget Tracking</span>
                      <span className="font-semibold text-foreground">
                        {limit > 0 ? `${trip.currency} ${limit.toLocaleString()}` : "Flexible"}
                      </span>
                    </div>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Button asChild variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                      <Link href={`/trips/${trip.id}/budget`}>
                        <span>Manage Expenses</span>
                        <ArrowRightIcon className="size-3" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
