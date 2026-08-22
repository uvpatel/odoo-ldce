"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  SparklesIcon,
  MapPinIcon,
  StarIcon,
  ArrowLeftIcon,
  ClockIcon,
  PlusIcon,
  CheckCircle2Icon,
  UsersIcon,
  Loader2Icon,
  CompassIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useTrips } from "@/features/trips/hooks/use-trips";
import { apiClient } from "@/lib/api-client";
import { tripKeys, catalogKeys } from "@/lib/query-keys";
import type { Activity } from "@/features/discover/api/discover.api";
import type { TripDetails } from "@/features/trips/api/trips.api";

function AddActivityToTripModal({ activity }: { activity: Activity }) {
  const [open, setOpen] = React.useState(false);
  const [selectedTripId, setSelectedTripId] = React.useState("");
  const [selectedTripDayId, setSelectedTripDayId] = React.useState("");
  const [startTime, setStartTime] = React.useState("10:00");
  const [notes, setNotes] = React.useState("");
  const queryClient = useQueryClient();

  const { data: tripsData, isLoading: areTripsLoading } = useTrips({
    limit: 50,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const trips = tripsData?.items ?? [];

  const {
    data: selectedTripData,
    isLoading: isSelectedTripLoading,
    isError: isSelectedTripError,
  } = useQuery<TripDetails>({
    queryKey: tripKeys.detail(selectedTripId),
    queryFn: () => apiClient.get(`/api/trips/${selectedTripId}`),
    enabled: open && !!selectedTripId,
  });

  const selectedTripDays = selectedTripData?.days ?? [];
  const selectedDay = selectedTripDays.find((day) => day.id === selectedTripDayId);
  const canEditSelectedTrip = selectedTripData?.permissions.canEdit === true;

  const addItineraryMutation = useMutation({
    mutationFn: () =>
      apiClient.post(`/api/trips/${selectedTripId}/itinerary`, {
        tripDayId: selectedTripDayId,
        title: activity.name,
        description: activity.description ?? null,
        activityId: activity.id,
        type: "activity",
        startTime: startTime || null,
        estimatedCost: activity.estimatedCost ? parseFloat(activity.estimatedCost) : 0,
        currency: activity.currency || "USD",
        location: activity.city?.name ?? null,
        notes: notes || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(selectedTripId) });
      queryClient.invalidateQueries({ queryKey: tripKeys.itinerary(selectedTripId) });
      toast.success(
        `"${activity.name}" added to ${selectedDay ? `Day ${selectedDay.dayNumber}` : "your itinerary"}!`
      );
      setOpen(false);
      setSelectedTripId("");
      setSelectedTripDayId("");
      setStartTime("10:00");
      setNotes("");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to add activity to trip"),
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelectedTripId("");
      setSelectedTripDayId("");
      setStartTime("10:00");
      setNotes("");
    }
  };

  const handleTripChange = (tripId: string | null) => {
    setSelectedTripId(tripId ?? "");
    setSelectedTripDayId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripId) {
      toast.error("Please select a trip");
      return;
    }
    if (!canEditSelectedTrip) {
      toast.error("You do not have permission to edit this trip");
      return;
    }
    if (!selectedTripDayId) {
      toast.error("Please select an itinerary day");
      return;
    }
    addItineraryMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full gap-1.5 text-xs">
          <PlusIcon className="size-3.5" />
          Add to My Trip
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Itinerary</DialogTitle>
          <DialogDescription className="text-xs">
            Schedule {activity.name} into one of your planned trips.
          </DialogDescription>
        </DialogHeader>
        {areTripsLoading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2Icon className="size-4 animate-spin" />
            Loading your trips...
          </div>
        ) : trips.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground space-y-3">
            <p>You have no active trips yet.</p>
            <Button asChild size="sm">
              <Link href="/trips/new">Plan Your First Trip</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="actTrip">Choose Trip *</Label>
              <Select value={selectedTripId} onValueChange={handleTripChange}>
                <SelectTrigger id="actTrip">
                  <SelectValue placeholder="Select a trip..." />
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

            {selectedTripId && isSelectedTripLoading ? (
              <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
                <Loader2Icon className="size-3.5 animate-spin" />
                Loading itinerary days...
              </div>
            ) : selectedTripId && isSelectedTripError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                This trip could not be loaded. Choose another trip or try again.
              </div>
            ) : selectedTripData && !canEditSelectedTrip ? (
              <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
                You have view-only access to this trip and cannot schedule activities in it.
              </div>
            ) : selectedTripData && selectedTripDays.length === 0 ? (
              <div className="space-y-3 rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
                <p>
                  This trip has no itinerary days yet. Add travel dates and planning days before
                  scheduling this activity.
                </p>
                <Button asChild type="button" variant="outline" size="sm">
                  <Link href={`/trips/${selectedTripId}/itinerary`}>Open Trip Itinerary</Link>
                </Button>
              </div>
            ) : selectedTripData ? (
              <div className="space-y-1.5">
                <Label htmlFor="actTripDay">Itinerary Day *</Label>
                <Select value={selectedTripDayId} onValueChange={(value) => setSelectedTripDayId(value ?? "")}>
                  <SelectTrigger id="actTripDay">
                    <SelectValue placeholder="Choose a day..." />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTripDays.map((day) => (
                      <SelectItem key={day.id} value={day.id}>
                        Day {day.dayNumber}
                        {day.title ? ` · ${day.title}` : ""}
                        {day.date ? ` (${day.date.slice(0, 10)})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            <div className="space-y-1.5">
              <Label htmlFor="actTime">Start Time</Label>
              <Input
                id="actTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="actNotes">Personal Notes (Optional)</Label>
              <Input
                id="actNotes"
                placeholder="e.g. Booking reference, meeting spot..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={
                  addItineraryMutation.isPending ||
                  isSelectedTripLoading ||
                  !canEditSelectedTrip ||
                  !selectedTripDayId
                }
                className="gap-1"
              >
                {addItineraryMutation.isPending ? (
                  <Loader2Icon className="size-3.5 animate-spin" />
                ) : (
                  <PlusIcon className="size-3.5" />
                )}
                Schedule Activity
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function ActivityDetailPage() {
  const params = useParams<{ activityId: string }>();
  const activityId = params.activityId;

  const { data: activity, isLoading, isError } = useQuery<Activity>({
    queryKey: catalogKeys.activityDetail(activityId),
    queryFn: () => apiClient.get(`/api/activities/${activityId}`),
    enabled: !!activityId,
  });

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-80 w-full rounded-2xl" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="md:col-span-2 h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !activity) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center space-y-4">
        <CompassIcon className="size-12 mx-auto text-muted-foreground opacity-40" />
        <h2 className="text-xl font-bold">Activity Not Found</h2>
        <p className="text-sm text-muted-foreground">The attraction or experience could not be located.</p>
        <Button asChild variant="outline">
          <Link href="/discover/activities">Back to Activities</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground text-xs">
          <Link href="/discover/activities">
            <ArrowLeftIcon className="size-4" />
            Back to Activities
          </Link>
        </Button>
      </div>

      <div className="relative aspect-21/9 w-full overflow-hidden rounded-2xl border shadow-sm bg-muted">
        {activity.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activity.imageUrl}
            alt={activity.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-primary/30 via-primary/10 to-transparent flex items-center justify-center">
            <SparklesIcon className="size-16 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {activity.category && (
              <Badge className="bg-primary text-primary-foreground text-xs">
                {activity.category.name}
              </Badge>
            )}
            {activity.city && (
              <Badge variant="secondary" className="text-xs bg-white/20 text-white backdrop-blur-sm">
                <MapPinIcon className="size-3 mr-1" />
                {activity.city.name}
              </Badge>
            )}
            {activity.rating && (
              <div className="flex items-center gap-1 text-xs bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">
                <StarIcon className="size-3.5 fill-yellow-400 text-yellow-400" />
                <span>{Number(activity.rating).toFixed(1)} rating</span>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-extrabold md:text-4xl">{activity.name}</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Experience Overview</CardTitle>
              <CardDescription>
                Everything you need to know before visiting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                {activity.description ||
                  "Experience one of the world's most sought-after sights with breathtaking views, cultural storytelling, and unforgettable photo opportunities."}
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">Highlights</h4>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex items-center gap-2">
                    <CheckCircle2Icon className="size-3.5 text-primary shrink-0" />
                    <span>Curated top-rated travel experience</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2Icon className="size-3.5 text-primary shrink-0" />
                    <span>Instant itinerary cost allocation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2Icon className="size-3.5 text-primary shrink-0" />
                    <span>Flexible schedule integration with automatic day sync</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Estimated Cost</CardDescription>
              <CardTitle className="text-2xl font-bold text-emerald-600 font-mono">
                {activity.currency} {Number(activity.estimatedCost).toFixed(0)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="text-xs text-muted-foreground space-y-2 border-y py-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ClockIcon className="size-3.5" /> Duration
                  </span>
                  <span className="font-medium text-foreground">
                    {activity.durationMinutes ? `${activity.durationMinutes} mins` : "1.5 - 2 Hours"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <UsersIcon className="size-3.5" /> Group Size
                  </span>
                  <span className="font-medium text-foreground">Solo or Group</span>
                </div>
              </div>

              <AddActivityToTripModal activity={activity} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
