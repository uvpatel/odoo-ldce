"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { sharedTripKeys } from "@/lib/query-keys";
import { useCopyTrip } from "@/features/trips/hooks/use-trips";
import {
  PlaneIcon,
  MapPinIcon,
  CalendarIcon,
  WalletCardsIcon,
  ClockIcon,
  CopyIcon,
  ShareIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  Loader2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface SharedTripData {
  share: {
    id: string;
    shareToken: string;
    allowCopy: boolean;
    isActive: boolean;
    expiresAt: string | null;
  };
  trip: {
    id: string;
    name: string;
    description: string | null;
    coverImageUrl: string | null;
    startDate: string | null;
    endDate: string | null;
    status: string;
    currency: string;
    budgetLimit: string | null;
    owner: {
      id: string;
      name: string;
      image: string | null;
    };
  };
  itinerary: {
    stops: Array<{
      id: string;
      city: { name: string; imageUrl: string | null };
      country: { name: string; iso2: string };
      arrivalDate: string | null;
      departureDate: string | null;
    }>;
    days: Array<{
      id: string;
      dayNumber: number;
      date: string | null;
      title: string | null;
      items: Array<{
        id: string;
        type: string;
        title: string;
        startTime: string | null;
        location: string | null;
        estimatedCost: string;
        currency: string;
      }>;
    }>;
  };
}

const TYPE_COLORS: Record<string, string> = {
  activity: "bg-blue-100 text-blue-700",
  transport: "bg-amber-100 text-amber-700",
  accommodation: "bg-purple-100 text-purple-700",
  meal: "bg-emerald-100 text-emerald-700",
  custom: "bg-gray-100 text-gray-700",
};

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function SharedTripPage() {
  const { token } = useParams<{ token: string }>();
  const [copied, setCopied] = React.useState(false);

  const { data, isLoading, isError } = useQuery<SharedTripData>({
    queryKey: sharedTripKeys.detail(token),
    queryFn: () => apiClient.get(`/api/shared/${token}`),
    enabled: !!token,
    retry: false,
  });

  const copyTrip = useCopyTrip();

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Share link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyTrip = () => {
    if (!data?.trip?.id) return;
    copyTrip.mutate({ tripId: data.trip.id, shareToken: token });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <nav className="border-b px-4 py-3 flex items-center gap-3">
          <Skeleton className="h-8 w-32" />
        </nav>
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 text-center px-4">
        <AlertCircleIcon className="size-16 text-muted-foreground opacity-30" />
        <div>
          <h1 className="text-2xl font-bold">Link Expired or Invalid</h1>
          <p className="text-muted-foreground mt-2 max-w-sm">
            This share link may have expired, been disabled, or never existed.
          </p>
        </div>
        <Button asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    );
  }

  const { trip, itinerary, share } = data;
  const totalItems = itinerary.days.reduce((acc, d) => acc + (d.items?.length ?? 0), 0);
  const totalCost = itinerary.days.reduce(
    (acc, d) => acc + (d.items ?? []).reduce((inner, item) => inner + Number(item.estimatedCost ?? 0), 0),
    0
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation bar */}
      <nav className="sticky top-0 z-20 border-b bg-card/80 backdrop-blur-sm px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-primary">
              <PlaneIcon className="size-5" />
              <span className="hidden sm:inline">GlobeTrotter</span>
            </Link>
            <span className="text-muted-foreground text-xs hidden sm:inline">· Shared Itinerary</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={handleCopyLink}>
              {copied ? <CheckCircleIcon className="size-3.5 text-emerald-500" /> : <ShareIcon className="size-3.5" />}
              {copied ? "Copied!" : "Share"}
            </Button>
            {share.allowCopy && (
              <Button size="sm" className="gap-1.5 text-xs" onClick={handleCopyTrip} disabled={copyTrip.isPending}>
                {copyTrip.isPending ? <Loader2Icon className="size-3.5 animate-spin" /> : <CopyIcon className="size-3.5" />}
                Copy Trip
              </Button>
            )}
            <Button size="sm" variant="ghost" asChild className="text-xs">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden">
        {trip.coverImageUrl ? (
          <div
            className="h-56 md:h-72 bg-cover bg-center"
            style={{ backgroundImage: `url(${trip.coverImageUrl})` }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />
          </div>
        ) : (
          <div className="h-32 bg-linear-to-br from-primary/20 via-primary/10 to-secondary/20" />
        )}
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-8 -mt-8 relative z-10">
        {/* Trip header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{trip.name}</h1>
              {trip.description && (
                <p className="text-muted-foreground mt-1 text-sm max-w-2xl">{trip.description}</p>
              )}
            </div>
            <Badge variant="secondary" className="capitalize shrink-0">{trip.status}</Badge>
          </div>

          {/* Meta strip */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {trip.startDate && (
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="size-4 text-primary" />
                {formatDate(trip.startDate)}
                {trip.endDate && ` – ${formatDate(trip.endDate)}`}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="size-4 text-primary" />
              {itinerary.stops.length} destination{itinerary.stops.length !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="size-4 text-primary" />
              {itinerary.days.length} days · {totalItems} activities
            </span>
            {totalCost > 0 && (
              <span className="flex items-center gap-1.5">
                <WalletCardsIcon className="size-4 text-emerald-600" />
                {trip.currency} {totalCost.toLocaleString()} estimated
              </span>
            )}
          </div>

          {/* Shared by */}
          <div className="flex items-center gap-2 pt-1">
            {trip.owner.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={trip.owner.image} alt={trip.owner.name} className="size-6 rounded-full border object-cover" />
            ) : (
              <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                {trip.owner.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="text-xs text-muted-foreground">
              Shared by <strong className="text-foreground">{trip.owner.name}</strong>
            </span>
          </div>
        </div>

        {/* Destinations */}
        {itinerary.stops.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Destinations</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {itinerary.stops.map((stop) => (
                <div
                  key={stop.id}
                  className="shrink-0 rounded-xl border overflow-hidden w-36"
                >
                  {stop.city.imageUrl ? (
                    <div
                      className="h-24 bg-cover bg-center"
                      style={{ backgroundImage: `url(${stop.city.imageUrl})` }}
                    />
                  ) : (
                    <div className="h-24 bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <MapPinIcon className="size-8 text-primary/30" />
                    </div>
                  )}
                  <div className="p-2">
                    <p className="text-xs font-bold truncate">{stop.city.name}</p>
                    <p className="text-[10px] text-muted-foreground">{stop.country.iso2}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Day-by-day itinerary */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Day-by-Day Itinerary</h2>
          {itinerary.days.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center text-muted-foreground">
                <p className="text-sm">No itinerary has been planned yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {itinerary.days.map((day) => {
                const dayTotal = (day.items ?? []).reduce((acc, item) => acc + Number(item.estimatedCost ?? 0), 0);
                return (
                  <Card key={day.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/40 py-3 px-4 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
                            {day.dayNumber}
                          </div>
                          <div>
                            <CardTitle className="text-sm font-semibold">
                              {day.title ? `Day ${day.dayNumber}: ${day.title}` : `Day ${day.dayNumber}`}
                            </CardTitle>
                            {day.date && (
                              <CardDescription className="text-[11px]">
                                {new Date(day.date).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                        {dayTotal > 0 && (
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {trip.currency} {dayTotal.toFixed(0)} est.
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 divide-y">
                      {(day.items ?? []).length === 0 ? (
                        <p className="text-xs text-muted-foreground px-4 py-3 italic">Nothing planned for this day.</p>
                      ) : (
                        (day.items ?? []).map((item) => (
                          <div key={item.id} className="flex items-center justify-between px-4 py-3">
                            <div className="flex items-start gap-3 min-w-0">
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded capitalize shrink-0 ${TYPE_COLORS[item.type] ?? TYPE_COLORS.custom}`}>
                                {item.type}
                              </span>
                              <div className="min-w-0">
                                <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                                  {item.startTime && (
                                    <span className="flex items-center gap-1">
                                      <ClockIcon className="size-3" />
                                      {item.startTime.slice(0, 5)}
                                    </span>
                                  )}
                                  {item.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPinIcon className="size-3" />
                                      {item.location}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {Number(item.estimatedCost) > 0 && (
                              <span className="text-xs font-semibold text-foreground font-mono shrink-0 ml-2">
                                {item.currency} {Number(item.estimatedCost).toFixed(0)}
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA */}
        <Card className="bg-linear-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="py-8 text-center space-y-4">
            <div className="flex size-12 mx-auto items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
              <PlaneIcon className="size-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Plan Your Own Adventure</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Sign up free and create personalized multi-city itineraries like this one.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {share.allowCopy && (
                <Button className="gap-2" onClick={handleCopyTrip} disabled={copyTrip.isPending}>
                  {copyTrip.isPending ? <Loader2Icon className="size-4 animate-spin" /> : <CopyIcon className="size-4" />}
                  Copy This Trip
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link href="/sign-up">Create Free Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
