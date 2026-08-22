"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tripKeys, catalogKeys } from "@/lib/query-keys";
import {
  tripsApi,
  type TripDetails,
  type TripStop,
} from "@/features/trips/api/trips.api";
import { apiClient } from "@/lib/api-client";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  WalletCardsIcon,
  RouteIcon,
  SparklesIcon,
  ArrowRightIcon,
  PlaneIcon,
  AlertCircleIcon,
  PlusIcon,
  Loader2Icon,
  GripVerticalIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
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
import type { City } from "@/features/discover/api/discover.api";

const stopListAccessibility = {
  screenReaderInstructions: {
    draggable:
      "To reorder a destination, press Space or Enter. Use the up and down arrow keys to move it, then press Space or Enter to drop it or Escape to cancel.",
  },
};

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getTripDuration(start: string | null, end: string | null) {
  if (!start || !end) return null;
  const diff = Math.ceil(
    (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff + 1; // inclusive
}

function AddStopDialog({ tripId }: { tripId: string }) {
  const [open, setOpen] = React.useState(false);
  const [selectedCityId, setSelectedCityId] = React.useState("");
  const [arrivalDate, setArrivalDate] = React.useState("");
  const [departureDate, setDepartureDate] = React.useState("");
  const queryClient = useQueryClient();

  const { data: citiesData } = useQuery<{ items: City[] }>({
    queryKey: catalogKeys.cityList(),
    queryFn: () => apiClient.get("/api/cities", { limit: 50 }),
  });

  const addStopMutation = useMutation({
    mutationFn: () =>
      apiClient.post(`/api/trips/${tripId}/stops`, {
        cityId: selectedCityId,
        arrivalDate: arrivalDate || null,
        departureDate: departureDate || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) });
      toast.success("Destination stop added!");
      setOpen(false);
      setSelectedCityId("");
      setArrivalDate("");
      setDepartureDate("");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to add stop"),
  });

  const handleAddStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCityId) {
      toast.error("Please select a city");
      return;
    }
    addStopMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs gap-1.5 h-8">
          <PlusIcon className="size-3.5" />
          <span>Add Destination</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Destination Stop</DialogTitle>
          <DialogDescription className="text-xs">
            Add a city to your trip itinerary and schedule your arrival.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddStop} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="citySelect">Select City *</Label>
            <Select value={selectedCityId} onValueChange={(v) => setSelectedCityId(v ?? "")}>
              <SelectTrigger id="citySelect">
                <SelectValue placeholder="Choose a destination city..." />
              </SelectTrigger>
              <SelectContent>
                {(citiesData?.items ?? []).map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}, {city.country?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="arrDate">Arrival Date</Label>
              <Input
                id="arrDate"
                type="date"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="depDate">Departure Date</Label>
              <Input
                id="depDate"
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
              Add Stop
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SortableStop({
  stop,
  index,
  total,
  canDrag,
  showDragHandle,
}: {
  stop: TripStop;
  index: number;
  total: number;
  canDrag: boolean;
  showDragHandle: boolean;
}) {
  const {
    attributes,
    isDragging,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: stop.id,
    disabled: !canDrag,
  });
  const cityName = stop.city?.name ?? "Unknown City";

  return (
    <div
      ref={setNodeRef}
      data-dragging={isDragging}
      className="relative flex items-center gap-3 rounded-lg border bg-muted/30 p-3 data-[dragging=true]:z-10 data-[dragging=true]:shadow-lg"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {showDragHandle ? (
        <Button
          {...attributes}
          {...listeners}
          ref={setActivatorNodeRef}
          type="button"
          variant="ghost"
          size="icon-sm"
          className="-ml-1 touch-none cursor-grab text-muted-foreground active:cursor-grabbing"
          disabled={!canDrag}
          aria-label={`Reorder ${cityName}, currently position ${index + 1} of ${total}`}
        >
          <GripVerticalIcon className="size-4" />
        </Button>
      ) : null}
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {index + 1}
      </div>
      {stop.city?.imageUrl ? (
        <div
          className="size-12 shrink-0 rounded-lg border bg-cover bg-center"
          style={{ backgroundImage: `url(${stop.city.imageUrl})` }}
        />
      ) : null}
      <div className="min-w-0">
        <p className="line-clamp-1 text-sm font-semibold">{cityName}</p>
        <p className="text-xs text-muted-foreground">
          {stop.country?.name}
          {stop.arrivalDate
            ? ` · ${formatDate(stop.arrivalDate)}${stop.departureDate ? ` – ${formatDate(stop.departureDate)}` : ""}`
            : ""}
        </p>
      </div>
    </div>
  );
}

export default function TripOverviewPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const queryClient = useQueryClient();
  const sortableContextId = React.useId();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data, isLoading, isError } = useQuery<TripDetails>({
    queryKey: tripKeys.detail(tripId),
    queryFn: () => tripsApi.detail(tripId),
    enabled: !!tripId,
  });

  const trip = data?.trip;
  const members = data?.members ?? [];
  const stops = data?.stops ?? [];
  const stopIds = stops.map((stop) => stop.id);
  const days = data?.days ?? [];
  const budget = data?.budget;
  const canEdit = data?.permissions.canEdit ?? false;
  const trackedBudget =
    budget && (budget.totalBudget > 0 || budget.totalSpent > 0) ? budget : null;

  const reorderStopsMutation = useMutation<
    TripStop[],
    Error,
    string[],
    { previousTrip: TripDetails | undefined }
  >({
    mutationFn: (nextStopIds) =>
      apiClient.post<TripStop[]>(`/api/trips/${tripId}/stops/reorder`, {
        stopIds: nextStopIds,
      }),
    onMutate: async (nextStopIds) => {
      const detailKey = tripKeys.detail(tripId);
      await queryClient.cancelQueries({ queryKey: detailKey, exact: true });
      const previousTrip = queryClient.getQueryData<TripDetails>(detailKey);

      if (previousTrip && previousTrip.stops.length === nextStopIds.length) {
        const stopsById = new Map(previousTrip.stops.map((stop) => [stop.id, stop]));
        const reorderedStops = nextStopIds.flatMap((stopId, position) => {
          const stop = stopsById.get(stopId);
          return stop ? [{ ...stop, position }] : [];
        });

        if (reorderedStops.length === previousTrip.stops.length) {
          queryClient.setQueryData<TripDetails>(detailKey, {
            ...previousTrip,
            stops: reorderedStops,
          });
        }
      }

      return { previousTrip };
    },
    onSuccess: (reorderedStops) => {
      queryClient.setQueryData<TripDetails>(tripKeys.detail(tripId), (currentTrip) =>
        currentTrip ? { ...currentTrip, stops: reorderedStops } : currentTrip
      );
      toast.success("Destination order updated");
    },
    onError: (error, _nextStopIds, context) => {
      if (context?.previousTrip) {
        queryClient.setQueryData(tripKeys.detail(tripId), context.previousTrip);
      }
      toast.error(error.message || "Failed to reorder destinations");
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: tripKeys.detail(tripId),
        exact: true,
      }),
  });

  const handleStopDragEnd = ({ active, over }: DragEndEvent) => {
    if (
      !canEdit ||
      reorderStopsMutation.isPending ||
      !over ||
      active.id === over.id
    ) {
      return;
    }

    const oldIndex = stopIds.indexOf(String(active.id));
    const newIndex = stopIds.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    reorderStopsMutation.mutate(arrayMove(stopIds, oldIndex, newIndex));
  };

  const duration = getTripDuration(trip?.startDate ?? null, trip?.endDate ?? null);
  const budgetPercent = trackedBudget
    ? Math.min(100, Math.round(trackedBudget.percentageUsed))
    : 0;

  // Next 4 upcoming itinerary items
  const upcomingItems = days
    .flatMap((d) =>
      (d.items ?? []).map((item) => ({
        ...item,
        dayNumber: d.dayNumber,
        date: d.date,
      }))
    )
    .sort((a, b) => {
      if (a.date !== b.date) return (a.date ?? "").localeCompare(b.date ?? "");
      return (a.startTime ?? "").localeCompare(b.startTime ?? "");
    })
    .slice(0, 4);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <AlertCircleIcon className="size-12 text-muted-foreground opacity-50" />
        <div>
          <p className="font-semibold">Failed to load trip</p>
          <p className="text-xs text-muted-foreground mt-1">
            The trip may not exist or you may not have access.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/trips">Back to My Trips</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Duration */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs flex items-center gap-1.5">
              <CalendarIcon className="size-3.5 text-primary" />
              Trip Duration
            </CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <CardTitle className="text-2xl">
                {duration ? `${duration} Days` : "Flexible"}
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              `${formatDate(trip?.startDate ?? null)} – ${formatDate(trip?.endDate ?? null)}`
            )}
          </CardContent>
        </Card>

        {/* Stops */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs flex items-center gap-1.5">
              <MapPinIcon className="size-3.5 text-primary" />
              Total Stops
            </CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <CardTitle className="text-2xl">{stops.length} Cities</CardTitle>
            )}
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground line-clamp-1">
            {isLoading ? (
              <Skeleton className="h-4 w-48" />
            ) : stops.length > 0 ? (
              stops.map((s) => s.city?.name).join(", ")
            ) : (
              "No stops added yet"
            )}
          </CardContent>
        </Card>

        {/* Budget */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs flex items-center gap-1.5">
              <WalletCardsIcon className="size-3.5 text-emerald-600" />
              Budget Tracked
            </CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <CardTitle className="text-2xl">
                {trackedBudget
                  ? `${trackedBudget.currency} ${trackedBudget.totalSpent.toLocaleString()} / ${trackedBudget.totalBudget.toLocaleString()}`
                  : trip?.budgetLimit
                  ? `${trip.currency} 0 / ${Number(trip.budgetLimit).toLocaleString()}`
                  : "No budget set"}
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-4 w-36" />
            ) : trackedBudget ? (
              <>
                <Progress value={budgetPercent} className="h-1 mb-1" />
                {budgetPercent}% of total budget
              </>
            ) : (
              "Set a budget to track spending"
            )}
          </CardContent>
        </Card>

        {/* Members */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs flex items-center gap-1.5">
              <UsersIcon className="size-3.5 text-primary" />
              Travel Party
            </CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <CardTitle className="text-2xl">{members.length} Traveler{members.length !== 1 ? "s" : ""}</CardTitle>
            )}
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-4 w-36" />
            ) : (
              members
                .map((m) =>
                  m.role === "owner" ? `${m.user?.name} (Owner)` : m.user?.name
                )
                .slice(0, 2)
                .join(", ") + (members.length > 2 ? ` +${members.length - 2} more` : "")
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Itinerary Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RouteIcon className="size-4 text-primary" />
              Upcoming Activities
            </CardTitle>
            <CardDescription className="text-xs">
              Next activities on your schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))
            ) : upcomingItems.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <PlaneIcon className="size-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No activities scheduled yet.</p>
                <p className="text-[11px]">Go to Itinerary to start planning your days.</p>
              </div>
            ) : (
              upcomingItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 shrink-0">
                        Day {item.dayNumber}
                        {item.startTime ? ` • ${item.startTime.slice(0, 5)}` : ""}
                      </Badge>
                      <span className="text-xs font-semibold line-clamp-1">{item.title}</span>
                    </div>
                    {item.location && (
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <MapPinIcon className="size-3" />
                        {item.location}
                      </p>
                    )}
                  </div>
                  {item.estimatedCost && Number(item.estimatedCost) > 0 && (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded shrink-0 ml-2">
                      {item.currency ?? trip?.currency ?? "USD"} {Number(item.estimatedCost).toFixed(0)}
                    </span>
                  )}
                </div>
              ))
            )}
          </CardContent>
          <div className="p-4 border-t bg-muted/10">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="w-full text-xs gap-1"
            >
              <Link href={`/trips/${tripId}/itinerary`}>
                <span>View Full Itinerary Builder</span>
                <ArrowRightIcon className="size-3.5" />
              </Link>
            </Button>
          </div>
        </Card>

        {/* Trip Stops / Destinations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPinIcon className="size-4 text-primary" />
                Destinations & Stops
              </CardTitle>
              <CardDescription className="text-xs">
                {canEdit && stops.length > 1
                  ? "Drag destinations to update your route"
                  : "Cities and stops on your route"}
              </CardDescription>
            </div>
            {canEdit ? <AddStopDialog tripId={tripId} /> : null}
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))
            ) : stops.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <MapPinIcon className="size-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No destinations added yet.</p>
                <p className="text-[11px]">
                  {canEdit
                    ? "Click “Add Destination” to begin building your route."
                    : "This trip does not have any destinations yet."}
                </p>
              </div>
            ) : (
              <DndContext
                id={sortableContextId}
                accessibility={stopListAccessibility}
                collisionDetection={closestCenter}
                sensors={sensors}
                onDragEnd={handleStopDragEnd}
              >
                <SortableContext
                  items={stopIds}
                  strategy={verticalListSortingStrategy}
                  disabled={!canEdit || reorderStopsMutation.isPending}
                >
                  <div className="space-y-3">
                    {stops.map((stop, index) => (
                      <SortableStop
                        key={stop.id}
                        stop={stop}
                        index={index}
                        total={stops.length}
                        canDrag={
                          canEdit &&
                          stops.length > 1 &&
                          !reorderStopsMutation.isPending
                        }
                        showDragHandle={canEdit && stops.length > 1}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
          <div className="p-4 border-t bg-muted/10">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="w-full text-xs gap-1"
            >
              <Link href="/discover/cities">
                <SparklesIcon className="size-3.5" />
                <span>Explore City Catalog</span>
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
