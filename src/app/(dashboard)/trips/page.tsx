"use client";

import * as React from "react";
import Link from "next/link";
import { useTrips, useDeleteTrip } from "@/features/trips/hooks/use-trips";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PlaneIcon,
  PlusIcon,
  CalendarIcon,
  SearchIcon,
  ArrowRightIcon,
  Trash2Icon,
  GlobeIcon,
  LockIcon,
  UsersIcon,
  MoreVerticalIcon,
  Settings2Icon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Trip } from "@/features/trips/api/trips.api";

const STATUS_TABS = [
  { value: "all", label: "All Trips" },
  { value: "planned", label: "Planned" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "draft", label: "Drafts" },
] as const;

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  planned: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  ongoing: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  completed: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  cancelled: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300",
};

export default function TripsPage() {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useTrips({
    search: debouncedSearch || undefined,
    status: statusFilter === "all" ? undefined : (statusFilter as "draft" | "planned" | "ongoing" | "completed" | "cancelled"),
    limit: 50,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const deleteTrip = useDeleteTrip();
  const trips = data?.items ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-2">
            <PlaneIcon className="size-7 text-primary" />
            My Trips
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Plan, organize, and collaborate on your personalized multi-city travel itineraries.
          </p>
        </div>
        <Button asChild className="gap-2 shrink-0">
          <Link href="/trips/new">
            <PlusIcon className="size-4" />
            Plan New Trip
          </Link>
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search trips..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.value
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <PlaneIcon className="size-12 text-muted-foreground mb-4 opacity-30" />
          <CardTitle className="text-lg">No trips found</CardTitle>
          <CardDescription className="max-w-sm mt-2">
            {search || statusFilter !== "all"
              ? "Try changing your search or status filter to find your trips."
              : "Start planning your next adventure by creating your first trip."}
          </CardDescription>
          <Button asChild className="mt-6 gap-2">
            <Link href="/trips/new">
              <PlusIcon className="size-4" />
              Plan Your First Trip
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip: Trip) => (
            <Card
              key={trip.id}
              className="group overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 border-border/70"
            >
              <Link href={`/trips/${trip.id}`} className="block">
                <div className="relative h-44 w-full overflow-hidden bg-muted">
                  {trip.coverImageUrl ? (
                    <div
                      className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${trip.coverImageUrl})` }}
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
                      <PlaneIcon className="size-10 text-primary/40" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shadow-sm ${
                        STATUS_STYLES[trip.status] ?? STATUS_STYLES.draft
                      }`}
                    >
                      {trip.status}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium shadow-sm">
                    {trip.visibility === "public" ? (
                      <>
                        <GlobeIcon className="size-3 text-primary" />
                        <span>Public</span>
                      </>
                    ) : trip.visibility === "friends" ? (
                      <>
                        <UsersIcon className="size-3 text-primary" />
                        <span>Shared</span>
                      </>
                    ) : (
                      <>
                        <LockIcon className="size-3 text-muted-foreground" />
                        <span>Private</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>

              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-bold group-hover:text-primary transition-colors line-clamp-1">
                  <Link href={`/trips/${trip.id}`}>{trip.name}</Link>
                </CardTitle>
                <CardDescription className="line-clamp-2 text-xs mt-1">
                  {trip.description || "Personalized travel journey."}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pt-1 flex-1 flex flex-col justify-end gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="size-3.5 text-primary shrink-0" />
                  <span className="line-clamp-1">
                    {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : "Flexible dates"}
                    {trip.endDate ? ` – ${new Date(trip.endDate).toLocaleDateString()}` : ""}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-3 border-t bg-muted/20 flex items-center justify-between">
                <span className="font-semibold text-xs text-foreground font-mono">
                  {trip.budgetLimit
                    ? `${trip.currency} ${Number(trip.budgetLimit).toLocaleString()}`
                    : "No budget limit"}
                </span>

                <div className="flex items-center gap-1.5">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-muted-foreground hover:text-destructive"
                        title="Delete trip"
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete &quot;{trip.name}&quot;?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this trip and its itinerary, budget, and expenses.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteTrip.mutate(trip.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Trip
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button asChild size="sm" className="text-xs gap-1 h-7">
                    <Link href={`/trips/${trip.id}`}>
                      <span>Open</span>
                      <ArrowRightIcon className="size-3" />
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
