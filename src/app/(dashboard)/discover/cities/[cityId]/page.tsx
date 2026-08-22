"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2Icon,
  MapPinIcon,
  StarIcon,
  ArrowLeftIcon,
  SparklesIcon,
  DollarSignIcon,
  CompassIcon,
  BookmarkIcon,
  ClockIcon,
  PlusIcon,
  Loader2Icon,
  CheckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useCity, useSavedDestinations, useToggleSaveDestination } from "@/features/discover/hooks/use-discover";
import { useTrips } from "@/features/trips/hooks/use-trips";
import { apiClient } from "@/lib/api-client";
import { tripKeys } from "@/lib/query-keys";

function AddCityToTripDialog({ cityId, cityName }: { cityId: string; cityName: string }) {
  const [open, setOpen] = React.useState(false);
  const [selectedTripId, setSelectedTripId] = React.useState("");
  const [arrivalDate, setArrivalDate] = React.useState("");
  const [departureDate, setDepartureDate] = React.useState("");
  const queryClient = useQueryClient();

  const { data: tripsData } = useTrips({ limit: 50, sortBy: "createdAt", sortOrder: "desc" });
  const trips = tripsData?.items ?? [];

  const addStopMutation = useMutation({
    mutationFn: () =>
      apiClient.post(`/api/trips/${selectedTripId}/stops`, {
        cityId,
        arrivalDate: arrivalDate || null,
        departureDate: departureDate || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(selectedTripId) });
      toast.success(`${cityName} added to your trip!`);
      setOpen(false);
      setSelectedTripId("");
      setArrivalDate("");
      setDepartureDate("");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to add destination"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripId) {
      toast.error("Please select a trip");
      return;
    }
    addStopMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 text-xs">
          <PlusIcon className="size-3.5" />
          <span>Add to Trip</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add {cityName} to Trip</DialogTitle>
          <DialogDescription className="text-xs">
            Select which trip to add this destination stop to.
          </DialogDescription>
        </DialogHeader>
        {trips.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground space-y-3">
            <p>You haven&apos;t created any trips yet.</p>
            <Button asChild size="sm">
              <Link href="/trips/new">Plan Your First Trip</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="tripSelect">Select Trip *</Label>
              <Select value={selectedTripId} onValueChange={(v) => setSelectedTripId(v ?? "")}>
                <SelectTrigger id="tripSelect">
                  <SelectValue placeholder="Choose a trip..." />
                </SelectTrigger>
                <SelectContent>
                  {trips.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} ({t.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="arr">Arrival Date</Label>
                <Input
                  id="arr"
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dep">Departure Date</Label>
                <Input
                  id="dep"
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={addStopMutation.isPending} className="gap-1">
                {addStopMutation.isPending ? (
                  <Loader2Icon className="size-3.5 animate-spin" />
                ) : (
                  <PlusIcon className="size-3.5" />
                )}
                Add Destination
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function CityDetailPage() {
  const { cityId } = useParams<{ cityId: string }>();

  const { data: city, isLoading, isError } = useCity(cityId);
  const { data: savedData } = useSavedDestinations();
  const savedCityIds = new Set((savedData ?? []).map((s) => s.cityId));
  const toggleSave = useToggleSaveDestination();

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-80 w-full rounded-2xl" />
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !city) {
    return (
      <div className="max-w-5xl mx-auto p-8 text-center space-y-4">
        <Building2Icon className="size-12 mx-auto text-muted-foreground opacity-40" />
        <h2 className="text-xl font-bold">City Not Found</h2>
        <p className="text-sm text-muted-foreground">The destination you requested does not exist or has been moved.</p>
        <Button asChild variant="outline">
          <Link href="/discover/cities">Back to Cities</Link>
        </Button>
      </div>
    );
  }

  const isSaved = savedCityIds.has(city.id);

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground text-xs">
          <Link href="/discover/cities">
            <ArrowLeftIcon className="size-4" />
            Back to Cities
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant={isSaved ? "default" : "outline"}
            size="sm"
            onClick={() => toggleSave.mutate(city.id)}
            disabled={toggleSave.isPending}
            className="gap-2 text-xs"
          >
            <BookmarkIcon className={`size-4 ${isSaved ? "fill-current" : ""}`} />
            {isSaved ? "Saved" : "Save"}
          </Button>

          <AddCityToTripDialog cityId={city.id} cityName={city.name} />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border shadow-sm bg-muted">
        {city.imageUrl ? (
          <img
            src={city.imageUrl}
            alt={city.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/30 flex items-center justify-center">
            <Building2Icon className="size-20 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary text-primary-foreground text-xs">
              {city.country?.name} {city.country?.region ? `• ${city.country.region}` : ""}
            </Badge>
            {city.popularityScore && (
              <div className="flex items-center gap-1 text-xs bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">
                <StarIcon className="size-3.5 fill-yellow-400 text-yellow-400" />
                <span>{Number(city.popularityScore).toFixed(1)} popularity</span>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-extrabold md:text-5xl">{city.name}</h1>
          <p className="text-sm text-white/80 max-w-2xl mt-2">
            {city.description || "Immerse yourself in iconic landmarks, world-class culinary experiences, and rich local culture."}
          </p>
        </div>
      </div>

      {/* Info Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Cost Index</CardDescription>
            <CardTitle className="text-xl font-bold flex items-center gap-1 text-emerald-600">
              <DollarSignIcon className="size-4" />
              {city.costIndex ? "$".repeat(Math.min(city.costIndex, 5)) : "$$$"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Tier {city.costIndex || 3} relative destination cost
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Timezone</CardDescription>
            <CardTitle className="text-xl font-bold flex items-center gap-1 text-primary">
              <CompassIcon className="size-4" />
              {city.timezone || "UTC"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Local time zone reference
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Curated Sights</CardDescription>
            <CardTitle className="text-xl font-bold flex items-center gap-1 text-primary">
              <SparklesIcon className="size-4" />
              {city.activities?.length ?? 0} Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Attractions & sights available in database
          </CardContent>
        </Card>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Top Activities in {city.name}</h2>
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link href={`/discover/activities?cityId=${city.id}`}>
              Explore All Activities
            </Link>
          </Button>
        </div>

        {(!city.activities || city.activities.length === 0) ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No specific activities listed yet for this city.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {city.activities.map((act) => (
              <Card key={act.id} className="overflow-hidden hover:shadow-md transition-shadow">
                {act.imageUrl && (
                  <div
                    className="h-36 bg-cover bg-center"
                    style={{ backgroundImage: `url(${act.imageUrl})` }}
                  />
                )}
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm line-clamp-1">{act.name}</CardTitle>
                    {act.rating && (
                      <span className="flex items-center gap-0.5 text-xs text-amber-500 font-semibold shrink-0">
                        <StarIcon className="size-3 fill-current" />
                        {Number(act.rating).toFixed(1)}
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-xs line-clamp-2 mt-1">
                    {act.description || "Exciting curated experience."}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-2 flex items-center justify-between text-xs border-t bg-muted/10">
                  <span className="font-semibold text-emerald-600">
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
    </div>
  );
}
