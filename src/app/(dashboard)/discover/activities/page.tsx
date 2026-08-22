"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SparklesIcon, MapPinIcon, StarIcon, SearchIcon, ClockIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivities, useActivityCategories } from "@/features/discover/hooks/use-discover";

export default function DiscoverActivitiesPage() {
  const searchParams = useSearchParams();
  const initialCityId = searchParams.get("cityId") || undefined;

  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [categoryId, setCategoryId] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<"popularity" | "rating" | "cost" | "duration">("popularity");
  const [maxCost, setMaxCost] = React.useState("all");
  const [maxDuration, setMaxDuration] = React.useState("all");

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data: categories } = useActivityCategories();

  const { data, isLoading } = useActivities({
    search: debouncedSearch || undefined,
    categoryId: categoryId === "all" ? undefined : categoryId,
    cityId: initialCityId,
    sortBy,
    sortOrder: sortBy === "cost" || sortBy === "duration" ? "asc" : "desc",
    maxCost: maxCost === "all" ? undefined : Number(maxCost),
    maxDuration: maxDuration === "all" ? undefined : Number(maxDuration),
    limit: 30,
  });

  const activities = data?.items ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-2">
            <SparklesIcon className="size-7 text-primary" />
            Activities & Experiences
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Search top attractions, sightseeing tours, museum tickets, and local culinary experiences worldwide.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search activities or sights..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "all")}>
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {(categories ?? []).map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={maxCost} onValueChange={(value) => setMaxCost(value ?? "all")}>
          <SelectTrigger className="w-full h-10"><SelectValue placeholder="Any price" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any price</SelectItem>
            <SelectItem value="25">Up to 25</SelectItem>
            <SelectItem value="75">Up to 75</SelectItem>
            <SelectItem value="150">Up to 150</SelectItem>
          </SelectContent>
        </Select>

        <Select value={maxDuration} onValueChange={(value) => setMaxDuration(value ?? "all")}>
          <SelectTrigger className="w-full h-10"><SelectValue placeholder="Any duration" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any duration</SelectItem>
            <SelectItem value="60">Under 1 hour</SelectItem>
            <SelectItem value="180">Under 3 hours</SelectItem>
            <SelectItem value="360">Under 6 hours</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(val) => setSortBy(val as typeof sortBy)}>
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Most Popular</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="cost">Lowest Cost</SelectItem>
            <SelectItem value="duration">Shortest Duration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl border-dashed">
          <SparklesIcon className="size-12 mx-auto mb-3 text-muted-foreground opacity-30" />
          <h3 className="text-lg font-semibold">No activities found</h3>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your category or search keyword</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((act) => (
            <Card key={act.id} className="group overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 border-border/70">
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {act.imageUrl ? (
                  <img
                    src={act.imageUrl}
                    alt={act.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-linear-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
                    <SparklesIcon className="size-10 text-primary/40" />
                  </div>
                )}
                {act.category?.name && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="text-[10px] bg-background/90 backdrop-blur-sm shadow-sm">
                      {act.category.name}
                    </Badge>
                  </div>
                )}
                {act.rating && (
                  <div className="absolute top-3 right-3 rounded-full bg-background/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold flex items-center gap-1 shadow-sm">
                    <StarIcon className="size-3.5 fill-yellow-400 text-yellow-400" />
                    <span>{Number(act.rating).toFixed(1)}</span>
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-base group-hover:text-primary transition-colors line-clamp-1">
                  <Link href={`/discover/activities/${act.id}`}>{act.name}</Link>
                </CardTitle>
                <CardDescription className="text-xs flex items-center gap-1">
                  <MapPinIcon className="size-3" />
                  {act.city?.name}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 pb-4">
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {act.description || "Immerse in this memorable travel attraction."}
                </p>
              </CardContent>

              <CardFooter className="border-t pt-3 bg-muted/20 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-600 font-mono">
                  {act.currency} {Number(act.estimatedCost).toFixed(0)}
                </span>
                {act.durationMinutes && (
                  <span className="text-muted-foreground flex items-center gap-1">
                    <ClockIcon className="size-3" />
                    {act.durationMinutes} mins
                  </span>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
