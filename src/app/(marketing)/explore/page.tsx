"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRightIcon,
  CalendarIcon,
  CompassIcon,
  MapPinIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface PublicTrip {
  id: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  shareToken: string;
  owner: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface PublicTripsResponse {
  items: PublicTrip[];
  total: number;
}

function tripDuration(startDate: string | null, endDate: string | null) {
  if (!startDate || !endDate) return "Flexible dates";
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1);
  return `${days} day${days === 1 ? "" : "s"}`;
}

export default function ExplorePage() {
  const [search, setSearch] = React.useState("");
  const deferredSearch = React.useDeferredValue(search.trim());

  const { data, isLoading, isError, refetch } = useQuery<PublicTripsResponse>({
    queryKey: ["public-trips", deferredSearch],
    queryFn: () =>
      apiClient.get("/api/public/trips", {
        limit: 12,
        search: deferredSearch || undefined,
        sortBy: "updatedAt",
        sortOrder: "desc",
      }),
  });

  const trips = data?.items ?? [];

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-4 text-center">
        <Badge variant="secondary" className="gap-1 px-3 py-1 text-sm">
          <CompassIcon className="size-3.5 text-primary" />
          Community itineraries
        </Badge>
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Borrow a route. Make it yours.
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Explore live itineraries shared by GlobeTrotter travelers, then copy an enabled plan into your own workspace.
        </p>
        <div className="relative mt-2 w-full max-w-xl">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search public trips..."
            className="h-11 bg-card pl-10 shadow-sm"
            aria-label="Search public trips"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[4/3] rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <Card className="mx-auto max-w-xl border-dashed text-center">
          <CardContent className="py-12">
            <CompassIcon className="mx-auto mb-3 size-10 text-muted-foreground/40" />
            <p className="font-semibold">Couldn&apos;t load community trips</p>
            <p className="mt-1 text-sm text-muted-foreground">Please try again in a moment.</p>
            <Button variant="outline" className="mt-5" onClick={() => refetch()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : trips.length === 0 ? (
        <Card className="mx-auto max-w-xl border-dashed text-center">
          <CardContent className="py-12">
            <MapPinIcon className="mx-auto mb-3 size-10 text-muted-foreground/40" />
            <p className="font-semibold">
              {deferredSearch ? "No shared trips match that search" : "The community board is ready for its first trip"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {deferredSearch ? "Try another destination or trip name." : "Create a public share link to feature your itinerary here."}
            </p>
            <Button render={<Link href="/signup" />} className="mt-5">
              Plan a trip
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {trips.map((trip) => (
            <Card
              key={trip.id}
              className="group overflow-hidden border-border/70 py-0 transition-all hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none"
            >
              <div className="relative aspect-video overflow-hidden bg-sidebar">
                {trip.coverImageUrl ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                    style={{ backgroundImage: `url(${trip.coverImageUrl})` }}
                    role="img"
                    aria-label=""
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-sidebar via-primary to-chart-2" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
                <Badge className="absolute right-3 top-3 capitalize" variant="secondary">
                  {trip.status}
                </Badge>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs text-white/75">Shared by {trip.owner.name}</p>
                  <h2 className="mt-1 font-serif text-2xl font-semibold leading-tight">{trip.name}</h2>
                </div>
              </div>

              <CardHeader className="pb-1">
                <CardTitle className="sr-only">{trip.name}</CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="size-3.5 text-primary" />
                    {tripDuration(trip.startDate, trip.endDate)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <UsersIcon className="size-3.5 text-primary" />
                    Community plan
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-16 pt-2">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {trip.description || "A shared itinerary ready to explore, adapt, and make your own."}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t bg-muted/20 py-4">
                <span className="text-xs text-muted-foreground">Read-only preview</span>
                <Button
                  size="sm"
                  render={<Link href={`/shared/${trip.shareToken}`} />}
                  className="gap-1.5"
                >
                  View itinerary
                  <ArrowRightIcon className="size-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
