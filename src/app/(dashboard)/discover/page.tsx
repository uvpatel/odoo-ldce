"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { catalogKeys } from "@/lib/query-keys";
import {
  CompassIcon,
  SearchIcon,
  MapPinIcon,
  StarIcon,
  ArrowRightIcon,
  SparklesIcon,
  BookmarkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToggleSaveDestination, useSavedDestinations } from "@/features/discover/hooks/use-discover";
import type { City, Activity } from "@/features/discover/api/discover.api";

function CostIndexDisplay({ costIndex }: { costIndex: number }) {
  const signs = ["$", "$$", "$$$", "$$$$", "$$$$$"];
  const label = signs[Math.min(costIndex - 1, 4)] ?? "$$$";
  return <span className="font-mono text-xs">{label}</span>;
}

function CityCard({ city, savedCityIds }: { city: City; savedCityIds: Set<string> }) {
  const toggleSave = useToggleSaveDestination();
  const isSaved = savedCityIds.has(city.id);

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/70">
      <Link href={`/discover/cities/${city.id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          {city.imageUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: `url(${city.imageUrl})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-primary/30 via-primary/10 to-secondary/30 flex items-center justify-center">
              <MapPinIcon className="size-12 text-primary/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-bold text-lg leading-tight">{city.name}</h3>
            <p className="text-white/80 text-xs">
              {city.country?.name} · {city.country?.region}
            </p>
          </div>
        </div>
      </Link>

      <CardContent className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CostIndexDisplay costIndex={city.costIndex} />
          {city.popularityScore && (
            <>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <StarIcon className="size-3 fill-amber-400 text-amber-400" />
                {Number(city.popularityScore).toFixed(1)}
              </span>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => toggleSave.mutate(city.id)}
          disabled={toggleSave.isPending}
          className={isSaved ? "text-primary" : "text-muted-foreground"}
        >
          <BookmarkIcon className={`size-3.5 ${isSaved ? "fill-primary" : ""}`} />
        </Button>
      </CardContent>
    </Card>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-200 border-border/70">
      <div className="relative h-32 overflow-hidden">
        {activity.imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundImage: `url(${activity.imageUrl})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <SparklesIcon className="size-8 text-primary/30" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className="text-[10px] py-0 px-1.5 bg-black/60 text-white border-0">
            {activity.category?.name}
          </Badge>
        </div>
      </div>

      <CardContent className="p-3 space-y-1.5">
        <p className="text-sm font-semibold line-clamp-1">{activity.name}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPinIcon className="size-3" />
            {activity.city?.name}
          </span>
          {activity.rating && (
            <span className="flex items-center gap-0.5">
              <StarIcon className="size-3 fill-amber-400 text-amber-400" />
              {Number(activity.rating).toFixed(1)}
            </span>
          )}
        </div>
        {Number(activity.estimatedCost) > 0 && (
          <p className="text-xs font-semibold text-emerald-600">
            {activity.currency} {Number(activity.estimatedCost).toFixed(0)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function DiscoverPage() {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data: popularCities, isLoading: citiesLoading } = useQuery<City[]>({
    queryKey: catalogKeys.popularCities(),
    queryFn: () => apiClient.get("/api/cities", { popular: "true", limit: "8" }),
  });

  const { data: topActivities, isLoading: activitiesLoading } = useQuery<{
    items: Activity[];
    total: number;
  }>({
    queryKey: catalogKeys.activityList({ sortBy: "popularity", limit: 6 }),
    queryFn: () => apiClient.get("/api/activities", { sortBy: "popularity", limit: "6" }),
  });

  const { data: searchResults, isLoading: searchLoading } = useQuery<{
    items: City[];
    total: number;
  }>({
    queryKey: catalogKeys.cityList({ search: debouncedSearch }),
    queryFn: () => apiClient.get("/api/cities", { search: debouncedSearch, limit: "12" }),
    enabled: debouncedSearch.length >= 2,
  });

  const { data: savedData } = useSavedDestinations();
  const savedCityIds = new Set((savedData ?? []).map((s) => s.cityId));

  const showSearch = debouncedSearch.length >= 2;

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CompassIcon className="size-6 text-primary" />
            Discover
          </h1>
          <p className="text-sm text-muted-foreground">
            Explore popular destinations and curated activities for your next adventure.
          </p>
        </div>

        <div className="relative max-w-xl">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search cities, countries, or regions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
      </div>

      {/* Search results */}
      {showSearch && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">
              Search Results{" "}
              {searchResults && (
                <span className="text-muted-foreground font-normal text-sm">
                  ({searchResults.total} cities found)
                </span>
              )}
            </h2>
            <Button variant="ghost" size="sm" asChild className="text-xs gap-1 h-7">
              <Link href="/discover/cities">
                View all cities <ArrowRightIcon className="size-3" />
              </Link>
            </Button>
          </div>

          {searchLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : (searchResults?.items ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No cities found for &quot;{debouncedSearch}&quot;.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {(searchResults?.items ?? []).map((city) => (
                <CityCard key={city.id} city={city} savedCityIds={savedCityIds} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Popular destinations */}
      {!showSearch && (
        <>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <MapPinIcon className="size-4 text-primary" />
                Popular Destinations
              </h2>
              <Button variant="ghost" size="sm" asChild className="text-xs gap-1 h-7">
                <Link href="/discover/cities">
                  All cities <ArrowRightIcon className="size-3" />
                </Link>
              </Button>
            </div>

            {citiesLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {(popularCities ?? []).map((city) => (
                  <CityCard key={city.id} city={city} savedCityIds={savedCityIds} />
                ))}
              </div>
            )}
          </div>

          {/* Top Activities */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <SparklesIcon className="size-4 text-primary" />
                Top-Rated Activities
              </h2>
              <Button variant="ghost" size="sm" asChild className="text-xs gap-1 h-7">
                <Link href="/discover/activities">
                  All activities <ArrowRightIcon className="size-3" />
                </Link>
              </Button>
            </div>

            {activitiesLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-44 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(topActivities?.items ?? []).map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
