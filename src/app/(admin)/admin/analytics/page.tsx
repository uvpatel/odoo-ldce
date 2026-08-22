"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3Icon, TrendingUpIcon, UsersIcon, PlaneIcon, CompassIcon, DollarSignIcon, SparklesIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { adminKeys } from "@/lib/query-keys";

interface PlatformAnalytics {
  totalUsers: number;
  totalTrips: number;
  activeTrips: number;
  completedTrips: number;
  draftTrips: number;
  cancelledTrips: number;
  publicTrips: number;
  averageDurationDays: number;
  averageTripBudget: number;
  creationTrends: Array<{
    period: string;
    count: number;
  }>;
  popularCities: Array<{
    id: string;
    name: string;
    popularityScore: string;
  }>;
  popularActivities: Array<{
    id: string;
    name: string;
    popularityScore: string;
    rating: string | null;
  }>;
}

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useQuery<PlatformAnalytics>({
    queryKey: adminKeys.analytics,
    queryFn: () => apiClient.get("/api/admin/analytics"),
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-2">
            <BarChart3Icon className="size-7 text-primary" />
            Platform Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time traveler metrics, destination adoption index, and itinerary creation trends.
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          Realtime Live Metrics
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Users</CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <CardTitle className="text-2xl font-bold">{data?.totalUsers ?? 0}</CardTitle>
            )}
          </CardHeader>
          <CardContent className="text-xs text-emerald-600 flex items-center gap-1">
            <TrendingUpIcon className="size-3.5" />
            Active platform travelers
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Trips</CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <CardTitle className="text-2xl font-bold">{data?.totalTrips ?? 0}</CardTitle>
            )}
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {data?.activeTrips ?? 0} active, {data?.completedTrips ?? 0} completed
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Avg. Trip Budget</CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <CardTitle className="text-2xl font-bold">${Number(data?.averageTripBudget ?? 0).toLocaleString()}</CardTitle>
            )}
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Target per-trip planned expense
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Avg. Duration</CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <CardTitle className="text-2xl font-bold">{data?.averageDurationDays ?? 0} Days</CardTitle>
            )}
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Across all multi-city itineraries
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Cities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CompassIcon className="size-4 text-primary" />
              Most Popular Destination Cities
            </CardTitle>
            <CardDescription className="text-xs">Ranked by traveler stops added</CardDescription>
          </CardHeader>
          <CardContent className="p-0 divide-y">
            {isLoading ? (
              <div className="p-4 space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (data?.popularCities ?? []).map((c, i) => (
              <div key={c.id} className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold">{c.name}</span>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  Score: {Number(c.popularityScore).toFixed(1)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <SparklesIcon className="size-4 text-primary" />
              Top Rated Activities
            </CardTitle>
            <CardDescription className="text-xs">Highest rated catalog sights</CardDescription>
          </CardHeader>
          <CardContent className="p-0 divide-y">
            {isLoading ? (
              <div className="p-4 space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (data?.popularActivities ?? []).map((a, i) => (
              <div key={a.id} className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold text-xs">
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold line-clamp-1">{a.name}</span>
                </div>
                {a.rating && (
                  <Badge variant="secondary" className="text-[10px] text-amber-600 font-semibold shrink-0">
                    ★ {Number(a.rating).toFixed(1)}
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
