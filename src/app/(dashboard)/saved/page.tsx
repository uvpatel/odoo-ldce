"use client";

import * as React from "react";
import Link from "next/link";
import { BookmarkIcon, MapPinIcon, StarIcon, ArrowRightIcon, PlusIcon, HeartIcon, Trash2Icon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSavedDestinations, useRemoveSavedDestination } from "@/features/discover/hooks/use-discover";

export default function SavedDestinationsPage() {
  const { data: savedItems, isLoading } = useSavedDestinations();
  const removeSaved = useRemoveSavedDestination();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-2">
            <BookmarkIcon className="size-7 text-primary fill-primary" />
            Saved Wishlist
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Destinations and cities you&apos;ve bookmarked for your future travel plans.
          </p>
        </div>
        <Button asChild variant="outline" className="gap-1.5 text-xs">
          <Link href="/discover/cities">
            <PlusIcon className="size-3.5" />
            Discover More Places
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      ) : (savedItems ?? []).length === 0 ? (
        <div className="text-center py-20 border rounded-2xl border-dashed">
          <BookmarkIcon className="size-12 mx-auto mb-3 text-muted-foreground opacity-30" />
          <h3 className="text-lg font-semibold">No saved destinations yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Browse through our global cities and click the bookmark button to save places you want to visit.
          </p>
          <Button asChild className="mt-6 gap-2" size="sm">
            <Link href="/discover/cities">
              <PlusIcon className="size-4" />
              Explore Cities
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(savedItems ?? []).map((item) => (
            <Card key={item.id} className="group overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 border-border/70">
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {item.city.imageUrl ? (
                  <img
                    src={item.city.imageUrl}
                    alt={item.city.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-linear-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
                    <MapPinIcon className="size-10 text-primary/40" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="text-[10px] bg-background/90 backdrop-blur-sm shadow-sm">
                    {item.country?.name}
                  </Badge>
                </div>
                <button
                  type="button"
                  onClick={() => removeSaved.mutate(item.cityId)}
                  disabled={removeSaved.isPending}
                  className="absolute top-3 right-3 rounded-full bg-background/90 backdrop-blur-sm p-2 shadow-sm text-destructive hover:bg-destructive hover:text-white transition-colors"
                  title="Remove from saved"
                >
                  <Trash2Icon className="size-3.5" />
                </button>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-base group-hover:text-primary transition-colors">
                  <Link href={`/discover/cities/${item.cityId}`}>{item.city.name}</Link>
                </CardTitle>
                <CardDescription className="text-xs">
                  {item.country?.name} {item.country?.region ? `• ${item.country.region}` : ""}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 pb-4">
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.city.description || "Saved destination ready for your next trip itinerary."}
                </p>
              </CardContent>

              <CardFooter className="border-t pt-3 bg-muted/20 flex items-center justify-between">
                {item.city.popularityScore && (
                  <span className="text-xs font-semibold text-amber-500 flex items-center gap-1">
                    <StarIcon className="size-3.5 fill-current" />
                    {Number(item.city.popularityScore).toFixed(1)}
                  </span>
                )}
                <Button asChild size="sm" className="text-xs gap-1 ml-auto">
                  <Link href={`/discover/cities/${item.cityId}`}>
                    <span>View Guide</span>
                    <ArrowRightIcon className="size-3" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
