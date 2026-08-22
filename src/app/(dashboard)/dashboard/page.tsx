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
  MapPinIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  CompassIcon,
  RouteIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardData {
  user: { name: string };
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
  recommendedCities: Array<{
    id: string;
    name: string;
    imageUrl: string | null;
    costIndex: number;
    country: { name: string; iso2: string; region: string };
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
  const recommendedCities = data?.recommendedCities ?? [];
  const nextTrip = upcomingTrips[0];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      {/* Journey-board hero */}
      <section className="relative overflow-hidden rounded-3xl bg-sidebar px-5 py-6 text-sidebar-foreground shadow-lg sm:px-7 sm:py-8">
        <div className="absolute -right-20 -top-24 size-72 rounded-full border border-white/10" />
        <div className="absolute -right-5 -top-10 size-44 rounded-full border border-white/10" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sidebar-primary">
              <SparklesIcon className="size-3.5" /> Your journey board
            </p>
            <h1 className="font-serif text-3xl leading-tight sm:text-4xl">
              {data?.user.name ? `Where to next, ${data.user.name.split(" ")[0]}?` : "Where to next?"}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-sidebar-foreground/70">
              Shape each stop, keep the budget honest, and turn a loose idea into a day-by-day route.
            </p>
          </div>
          <Button asChild size="lg" className="w-fit bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
            <Link href="/trips/new"><PlusIcon />Plan a new trip</Link>
          </Button>
        </div>

        <div className="relative mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
            <RouteIcon className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.14em] text-sidebar-foreground/55">Next departure</p>
            <p className="truncate text-sm font-semibold">{nextTrip?.name ?? "Your route is wide open"}</p>
          </div>
          <span className="shrink-0 text-xs text-sidebar-foreground/65">
            {nextTrip?.startDate
              ? new Date(nextTrip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "Choose dates when ready"}
          </span>
        </div>
      </section>

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

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold"><CompassIcon className="size-4 text-primary" />Routes worth considering</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Popular cities to spark the next itinerary.</p>
          </div>
          <Button asChild variant="ghost" size="sm"><Link href="/discover/cities">Explore all<ArrowRightIcon /></Link></Button>
        </div>
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-40 rounded-2xl" />)}</div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedCities.map((city) => (
              <Link key={city.id} href={`/discover/cities/${city.id}`} className="group relative min-h-40 overflow-hidden rounded-2xl border bg-card shadow-sm">
                {city.imageUrl ? <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" style={{ backgroundImage: `url(${city.imageUrl})` }} /> : <div className="absolute inset-0 bg-linear-to-br from-primary/30 via-primary/10 to-accent" />}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="font-serif text-xl leading-none">{city.name}</p>
                  <p className="mt-1 text-[11px] text-white/70">{city.country.name} · {"$".repeat(Math.max(1, Math.min(city.costIndex, 5)))}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
