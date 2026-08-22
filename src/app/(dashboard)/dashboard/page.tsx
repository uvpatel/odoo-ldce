"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { userKeys } from "@/lib/query-keys";
import {
  PlaneIcon,
  PlusIcon,
  CalendarIcon,
  WalletCardsIcon,
  TrendingUpIcon,
  MapPinIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardData {
  stats: {
    totalTrips: number;
    activeTrips: number;
    completedTrips: number;
    draftTrips: number;
  };
  recentTrips: Array<{
    id: string;
    name: string;
    status: string;
    startDate: string | null;
    endDate: string | null;
    currency: string;
    budgetLimit: string | null;
    coverImageUrl: string | null;
    description: string | null;
  }>;
  upcomingTrips: Array<{
    id: string;
    name: string;
    startDate: string | null;
    endDate: string | null;
    status: string;
    currency: string;
    budgetLimit: string | null;
  }>;
  recentExpenses: Array<{
    id: string;
    title: string;
    amount: string;
    category: string;
    date: string | null;
    currency: string;
    tripName: string;
    tripId: string;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  planned: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  ongoing: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  completed: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  cancelled: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300",
};

function StatCard({
  label,
  value,
  icon: Icon,
  color = "text-primary",
  loading,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color?: string;
  loading?: boolean;
}) {
  return (
    <Card className="border-border/70">
      <CardHeader className="pb-2">
        <CardDescription className="text-xs flex items-center gap-1.5">
          <Icon className={`size-3.5 ${color}`} />
          {label}
        </CardDescription>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <CardTitle className="text-3xl font-bold tabular-nums">{value}</CardTitle>
        )}
      </CardHeader>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: userKeys.dashboard,
    queryFn: () => apiClient.get("/api/dashboard"),
  });

  const stats = data?.stats;
  const recentTrips = data?.recentTrips ?? [];
  const upcomingTrips = data?.upcomingTrips ?? [];
  const recentExpenses = data?.recentExpenses ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      {/* Page header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <SparklesIcon className="size-6 text-primary" />
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here&apos;s an overview of your travel plans.
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Link href="/trips/new">
            <PlusIcon className="size-4" />
            New Trip
          </Link>
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Trips"
          value={stats?.totalTrips ?? 0}
          icon={PlaneIcon}
          loading={isLoading}
        />
        <StatCard
          label="Active Trips"
          value={stats?.activeTrips ?? 0}
          icon={MapPinIcon}
          color="text-emerald-600"
          loading={isLoading}
        />
        <StatCard
          label="Completed"
          value={stats?.completedTrips ?? 0}
          icon={CheckCircleIcon}
          color="text-violet-600"
          loading={isLoading}
        />
        <StatCard
          label="Drafts"
          value={stats?.draftTrips ?? 0}
          icon={ClockIcon}
          color="text-muted-foreground"
          loading={isLoading}
        />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Trips - takes 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <PlaneIcon className="size-4 text-primary" />
              Recent Trips
            </h2>
            <Button variant="ghost" size="sm"  className="text-xs gap-1 h-7">
              <Link href="/trips">
                View all
                <ArrowRightIcon className="size-3" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : recentTrips.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-12 text-center border-dashed">
              <PlaneIcon className="size-10 text-muted-foreground opacity-40 mb-3" />
              <p className="text-sm font-medium">No trips yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create your first trip to get started!
              </p>
              <Button  size="sm" className="mt-4 gap-1">
                <Link href="/trips/new">
                  <PlusIcon className="size-3.5" />
                  Create Trip
                </Link>
              </Button>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {recentTrips.map((trip) => (
                <Link
                  key={trip.id}
                  href={`/trips/${trip.id}`}
                  className="block group"
                >
                  <Card className="overflow-hidden border-border/70 group-hover:border-primary/40 group-hover:shadow-md transition-all duration-200">
                    {trip.coverImageUrl ? (
                      <div
                        className="h-28 bg-cover bg-center"
                        style={{ backgroundImage: `url(${trip.coverImageUrl})` }}
                      />
                    ) : (
                      <div className="h-28 bg-linear-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
                        <PlaneIcon className="size-8 text-primary/40" />
                      </div>
                    )}
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                          {trip.name}
                        </p>
                        <span
                          className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full capitalize ${
                            STATUS_COLORS[trip.status] ?? STATUS_COLORS.draft
                          }`}
                        >
                          {trip.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <CalendarIcon className="size-3" />
                        {trip.startDate
                          ? new Date(trip.startDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Flexible dates"}
                      </div>
                      {trip.budgetLimit && (
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <WalletCardsIcon className="size-3" />
                          {trip.currency} {Number(trip.budgetLimit).toLocaleString()} budget
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right column: upcoming + expenses */}
        <div className="space-y-4">
          {/* Upcoming Trips */}
          <Card className="border-border/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CalendarIcon className="size-4 text-primary" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="px-4 pb-4 space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : upcomingTrips.length === 0 ? (
                <p className="text-xs text-muted-foreground px-4 pb-4">
                  No upcoming trips planned yet.
                </p>
              ) : (
                <div className="divide-y">
                  {upcomingTrips.map((trip) => (
                    <Link
                      key={trip.id}
                      href={`/trips/${trip.id}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-medium text-foreground line-clamp-1">{trip.name}</p>
                        <p className="text-muted-foreground">
                          {trip.startDate
                            ? new Date(trip.startDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "TBD"}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full capitalize ${
                          STATUS_COLORS[trip.status] ?? ""
                        }`}
                      >
                        {trip.status}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Expenses */}
          <Card className="border-border/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <WalletCardsIcon className="size-4 text-primary" />
                Recent Expenses
              </CardTitle>
              <CardDescription className="text-[11px]">Last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="px-4 pb-4 space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : recentExpenses.length === 0 ? (
                <p className="text-xs text-muted-foreground px-4 pb-4">
                  No expenses tracked in the last 30 days.
                </p>
              ) : (
                <div className="divide-y">
                  {recentExpenses.map((expense) => (
                    <Link
                      key={expense.id}
                      href={`/trips/${expense.tripId}/budget`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors text-xs"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-medium text-foreground line-clamp-1">{expense.title}</p>
                        <p className="text-muted-foreground line-clamp-1">{expense.tripName}</p>
                      </div>
                      <span className="font-semibold font-mono text-foreground shrink-0 ml-2">
                        {expense.currency} {Number(expense.amount).toFixed(2)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
