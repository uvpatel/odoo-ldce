"use client";

import * as React from "react";
import Link from "next/link";
import { Building2Icon, MapPinIcon, StarIcon, SearchIcon, BookmarkIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCities, useSavedDestinations, useToggleSaveDestination } from "@/features/discover/hooks/use-discover";

function CostIndexDisplay({ costIndex }: { costIndex: number }) {
  const signs = ["$", "$$", "$$$", "$$$$", "$$$$$"];
  const label = signs[Math.min(costIndex - 1, 4)] ?? "$$$";
  return <span className="font-mono text-xs font-semibold">{label}</span>;
}

export default function DiscoverCitiesPage() {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"popularity" | "name" | "cost">("popularity");
  const [region, setRegion] = React.useState("all");
  const [maxCost, setMaxCost] = React.useState("all");

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useCities({
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder: sortBy === "cost" || sortBy === "name" ? "asc" : "desc",
    region: region === "all" ? undefined : region,
    maxCost: maxCost === "all" ? undefined : Number(maxCost),
    limit: 30,
  });

  const { data: savedData } = useSavedDestinations();
  const savedCityIds = new Set((savedData ?? []).map((s) => s.cityId));
  const toggleSave = useToggleSaveDestination();

  const cities = data?.items ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-2">
            <Building2Icon className="size-7 text-primary" />
            Explore Cities
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discover global travel destinations with curated insights, cost tiers, and top attractions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by city or country name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        <Select value={region} onValueChange={(value) => setRegion(value ?? "all")}>
          <SelectTrigger className="w-full h-10"><SelectValue placeholder="All regions" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All regions</SelectItem>
            <SelectItem value="Africa">Africa</SelectItem>
            <SelectItem value="Asia">Asia</SelectItem>
            <SelectItem value="Europe">Europe</SelectItem>
            <SelectItem value="Middle East">Middle East</SelectItem>
            <SelectItem value="North America">North America</SelectItem>
            <SelectItem value="South America">South America</SelectItem>
            <SelectItem value="Oceania">Oceania</SelectItem>
          </SelectContent>
        </Select>

        <Select value={maxCost} onValueChange={(value) => setMaxCost(value ?? "all")}>
          <SelectTrigger className="w-full h-10"><SelectValue placeholder="Any cost" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any cost</SelectItem>
            <SelectItem value="2">Budget · $$</SelectItem>
            <SelectItem value="3">Moderate · $$$</SelectItem>
            <SelectItem value="5">All price tiers</SelectItem>
          </SelectContent>
        </Select>

          <Select value={sortBy} onValueChange={(val) => setSortBy(val as typeof sortBy)}>
            <SelectTrigger className="w-full h-10">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="name">City Name (A-Z)</SelectItem>
              <SelectItem value="cost">Affordability</SelectItem>
            </SelectContent>
          </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      ) : cities.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl border-dashed">
          <MapPinIcon className="size-12 mx-auto mb-3 text-muted-foreground opacity-30" />
          <h3 className="text-lg font-semibold">No cities found</h3>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => {
            const isSaved = savedCityIds.has(city.id);
            return (
              <Card key={city.id} className="group overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 border-border/70">
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  {city.imageUrl ? (
                    <img
                      src={city.imageUrl}
                      alt={city.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
                      <MapPinIcon className="size-10 text-primary/40" />
                    </div>
                  )}
                  {city.popularityScore && (
                    <div className="absolute top-3 right-3 rounded-full bg-background/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold flex items-center gap-1 shadow-sm">
                      <StarIcon className="size-3.5 fill-yellow-400 text-yellow-400" />
                      <span>{Number(city.popularityScore).toFixed(1)}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSave.mutate(city.id);
                    }}
                    className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-sm transition-colors ${isSaved
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-background/80 text-foreground hover:bg-background"
                      }`}
                  >
                    <BookmarkIcon className={`size-3.5 ${isSaved ? "fill-current" : ""}`} />
                  </button>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    <Link href={`/discover/cities/${city.id}`}>{city.name}</Link>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {city.country?.name} {city.country?.region ? `• ${city.country.region}` : ""}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 pb-4">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {city.description || "Discover landmarks, cultural treasures, and local activities."}
                  </p>
                </CardContent>

                <CardFooter className="border-t pt-3 bg-muted/20 flex items-center justify-between">
                  <CostIndexDisplay costIndex={city.costIndex} />
                  <Button asChild size="sm" className="text-xs gap-1">
                    <Link href={`/discover/cities/${city.id}`}>
                      <span>View City Guide</span>
                      <ArrowRightIcon className="size-3" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
