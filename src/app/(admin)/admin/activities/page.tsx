"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { SparklesIcon, MapPinIcon, StarIcon, ClockIcon, DollarSignIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { adminKeys } from "@/lib/query-keys";
import type { Activity } from "@/features/discover/api/discover.api";

export default function AdminActivitiesPage() {
  const { data, isLoading } = useQuery<{
    items: Activity[];
    total: number;
  }>({
    queryKey: adminKeys.activities(),
    queryFn: () => apiClient.get("/api/admin/activities", { limit: 50 }),
  });

  const activities = data?.items ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-2">
            <SparklesIcon className="size-7 text-primary" />
            Activity Catalog Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Maintain sights, tours, entrance tickets, and cost estimates across destinations.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-base">Catalog Activities ({data?.total ?? 0})</CardTitle>
          <CardDescription className="text-xs">Curated experiences available for day itineraries</CardDescription>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : activities.length === 0 ? (
            <p className="text-sm text-muted-foreground p-8 text-center">No activities in catalog.</p>
          ) : (
            activities.map((act) => (
              <div key={act.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3">
                  {act.imageUrl ? (
                    <img src={act.imageUrl} alt={act.name} className="size-12 rounded-lg object-cover" />
                  ) : (
                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <SparklesIcon className="size-6" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{act.name}</span>
                      {act.category?.name && (
                        <Badge variant="secondary" className="text-[10px] py-0">
                          {act.category.name}
                        </Badge>
                      )}
                      {act.rating && (
                        <span className="text-xs text-amber-500 font-semibold flex items-center gap-0.5">
                          <StarIcon className="size-3 fill-current" />
                          {Number(act.rating).toFixed(1)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {act.city?.name} · {act.currency} {Number(act.estimatedCost).toFixed(0)}
                      {act.durationMinutes ? ` · ${act.durationMinutes} mins` : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
