"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ShieldIcon,
  UsersIcon,
  PlaneIcon,
  Building2Icon,
  SparklesIcon,
  BarChart3Icon,
  ArrowRightIcon,
  TrendingUpIcon,
  DollarSignIcon,
} from "lucide-react";
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

export default function AdminOverviewPage() {
  const { data, isLoading } = useQuery<PlatformAnalytics>({
    queryKey: adminKeys.analytics,
    queryFn: () => apiClient.get("/api/admin/analytics"),
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 text-xs">
              <ShieldIcon className="size-3 text-primary" />
              Super Admin Console
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl mt-1">Platform Administration</h1>
          <p className="text-sm text-muted-foreground">
            Monitor system metrics, manage user roles, audit travel catalog, and analyze growth.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Registered Users</CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                <span>{data?.totalUsers.toLocaleString() ?? 0}</span>
                <UsersIcon className="size-5 text-primary" />
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUpIcon className="size-3.5 text-emerald-600" />
            <span className="text-emerald-600 font-medium">Active database</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Trips Created</CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                <span>{data?.totalTrips.toLocaleString() ?? 0}</span>
                <PlaneIcon className="size-5 text-primary" />
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="text-foreground font-medium">{data?.activeTrips ?? 0} active</span> · {data?.publicTrips ?? 0} public
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Avg. Trip Budget</CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                <span>${Number(data?.averageTripBudget ?? 0).toLocaleString()}</span>
                <DollarSignIcon className="size-5 text-emerald-600" />
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Avg duration: {data?.averageDurationDays ?? 0} days
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Completed Trips</CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                <span>{data?.completedTrips.toLocaleString() ?? 0}</span>
                <SparklesIcon className="size-5 text-primary" />
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {data?.draftTrips ?? 0} in draft status
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Administrative Modules</CardTitle>
            <CardDescription className="text-xs">Direct access to core administrative management tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[
              { title: "User & Role Management", desc: "Audit permissions and accounts", href: "/admin/users", icon: <UsersIcon className="size-4 text-primary" /> },
              { title: "Trip Moderation", desc: "Inspect and moderate traveler itineraries", href: "/admin/trips", icon: <PlaneIcon className="size-4 text-primary" /> },
              { title: "City Catalog & Geo Index", desc: "Destination cities and popularity scores", href: "/admin/cities", icon: <Building2Icon className="size-4 text-primary" /> },
              { title: "Activity & Tour Catalog", desc: "Attractions and price models", href: "/admin/activities", icon: <SparklesIcon className="size-4 text-primary" /> },
              { title: "Analytics & Growth Trends", desc: "Platform traffic and creation insights", href: "/admin/analytics", icon: <BarChart3Icon className="size-4 text-primary" /> },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">{item.title}</h4>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <ArrowRightIcon className="size-3.5 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Platform Destinations</CardTitle>
            <CardDescription className="text-xs">Most frequently added cities in user itineraries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (data?.popularCities ?? []).length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">No city data available</p>
            ) : (
              (data?.popularCities ?? []).map((c, i) => (
                <div key={c.id} className="flex items-center justify-between border-b pb-2.5 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                      {i + 1}
                    </span>
                    <span className="text-xs font-semibold text-foreground">{c.name}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    Score: {Number(c.popularityScore).toFixed(1)}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
