"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Building2Icon, MapPinIcon, StarIcon, SearchIcon, ArrowRightIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { adminKeys } from "@/lib/query-keys";
import type { City } from "@/features/discover/api/discover.api";

export default function AdminCitiesPage() {
  const { data, isLoading } = useQuery<{
    items: City[];
    total: number;
  }>({
    queryKey: adminKeys.cities(),
    queryFn: () => apiClient.get("/api/admin/cities", { limit: 50 }),
  });

  const cities = data?.items ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-2">
            <Building2Icon className="size-7 text-primary" />
            City Destination Catalog
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and manage destination cities, popularity indices, and geographical data.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-base">Catalog Cities ({data?.total ?? 0})</CardTitle>
          <CardDescription className="text-xs">Global cities indexed for itinerary stops</CardDescription>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : cities.length === 0 ? (
            <p className="text-sm text-muted-foreground p-8 text-center">No cities in catalog.</p>
          ) : (
            cities.map((city) => (
              <div key={city.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3">
                  {city.imageUrl ? (
                    <img src={city.imageUrl} alt={city.name} className="size-12 rounded-lg object-cover" />
                  ) : (
                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Building2Icon className="size-6" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{city.name}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {city.country?.name} ({city.country?.iso2})
                      </Badge>
                      {city.popularityScore && (
                        <span className="text-xs text-amber-500 font-semibold flex items-center gap-0.5">
                          <StarIcon className="size-3 fill-current" />
                          {Number(city.popularityScore).toFixed(1)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Cost: {"$".repeat(city.costIndex || 3)} · Timezone: {city.timezone || "UTC"}
                    </p>
                  </div>
                </div>

                <Button asChild size="sm" variant="ghost" className="text-xs gap-1">
                  <Link href={`/discover/cities/${city.id}`}>
                    <span>Guide</span>
                    <ArrowRightIcon className="size-3" />
                  </Link>
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
