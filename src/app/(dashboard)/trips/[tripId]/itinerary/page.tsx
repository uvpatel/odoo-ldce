"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  PlusIcon,
  ClockIcon,
  MapPinIcon,
  Trash2Icon,
  GripVerticalIcon,
  Loader2Icon,
  CalendarIcon,
  DollarSignIcon,
  FileTextIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { tripKeys } from "@/lib/query-keys";
import { apiClient } from "@/lib/api-client";
import type { TripDetails, TripDay, ItineraryItem } from "@/features/trips/api/trips.api";

const addItemSchema = z.object({
  type: z.enum(["activity", "transport", "accommodation", "meal", "custom"]),
  title: z.string().min(1, "Title required"),
  location: z.string().optional(),
  startTime: z.string().optional(),
  estimatedCost: z.string().optional(),
  notes: z.string().optional(),
});
type AddItemValues = z.infer<typeof addItemSchema>;

const TYPE_COLORS: Record<string, string> = {
  activity: "bg-blue-100 text-blue-700 border-blue-200",
  transport: "bg-amber-100 text-amber-700 border-amber-200",
  accommodation: "bg-purple-100 text-purple-700 border-purple-200",
  meal: "bg-emerald-100 text-emerald-700 border-emerald-200",
  custom: "bg-gray-100 text-gray-700 border-gray-200",
};

const TYPE_LABELS: Record<string, string> = {
  activity: "Activity",
  transport: "Transport",
  accommodation: "Stay",
  meal: "Meal",
  custom: "Custom",
};

function AddItemDialog({
  tripId,
  dayId,
  dayNumber,
  onSuccess,
}: {
  tripId: string;
  dayId: string;
  dayNumber: number;
  onSuccess: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } =
    useForm<AddItemValues>({
      resolver: zodResolver(addItemSchema),
      defaultValues: { type: "activity", estimatedCost: "0" },
    });

  const selectedType = watch("type");

  const mutation = useMutation({
    mutationFn: (data: AddItemValues) =>
      apiClient.post(`/api/trips/${tripId}/itinerary`, {
        ...data,
        tripDayId: dayId,
        estimatedCost: data.estimatedCost ? parseFloat(data.estimatedCost) : 0,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: tripKeys.itinerary(tripId) });
      toast.success("Activity added!");
      reset();
      setOpen(false);
      onSuccess();
    },
    onError: (e: Error) => toast.error(e.message || "Failed to add activity"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1 text-xs shrink-0">
          <PlusIcon className="size-3.5" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Day {dayNumber}</DialogTitle>
          <DialogDescription className="text-xs">
            Add an activity, transport, meal, or accommodation to this day.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="type">Type</Label>
            <Select value={selectedType} onValueChange={(v) => setValue("type", v as AddItemValues["type"])}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activity">Activity</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="accommodation">Accommodation</SelectItem>
                <SelectItem value="meal">Meal</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" placeholder="e.g. Shibuya Sky Observation" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g. Shibuya Scramble Square" {...register("location")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startTime">Start Time</Label>
              <Input id="startTime" type="time" {...register("startTime")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="estimatedCost">Cost (USD)</Label>
              <Input id="estimatedCost" type="number" min={0} step={0.01} placeholder="0" {...register("estimatedCost")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" placeholder="Optional notes..." {...register("notes")} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={mutation.isPending} className="gap-1">
              {mutation.isPending && <Loader2Icon className="size-3.5 animate-spin" />}
              Add to Itinerary
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ItineraryItemRow({
  item,
  tripId,
  dayId,
  currency,
}: {
  item: ItineraryItem;
  tripId: string;
  dayId: string;
  currency: string;
}) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () =>
      apiClient.delete(`/api/trips/${tripId}/itinerary/${item.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: tripKeys.itinerary(tripId) });
      toast.info("Activity removed.");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to remove activity"),
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-muted/20 transition-colors group">
      <div className="flex items-start gap-3">
        <GripVerticalIcon className="size-4 text-muted-foreground/40 mt-1 cursor-grab hidden sm:block" />
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded border capitalize ${
                TYPE_COLORS[item.type] ?? TYPE_COLORS.custom
              }`}
            >
              {TYPE_LABELS[item.type] ?? item.type}
            </span>
            {item.startTime && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-primary border-primary/30 flex items-center gap-1 font-mono">
                <ClockIcon className="size-3" />
                {item.startTime.slice(0, 5)}
              </Badge>
            )}
            <span className="text-sm font-semibold text-foreground">{item.title}</span>
          </div>
          {item.location && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPinIcon className="size-3" />
              {item.location}
              {item.notes ? ` · ${item.notes}` : ""}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-center">
        {Number(item.estimatedCost) > 0 && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
            {currency} {Number(item.estimatedCost).toFixed(0)}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
          className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {deleteMutation.isPending ? (
            <Loader2Icon className="size-3.5 animate-spin" />
          ) : (
            <Trash2Icon className="size-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default function TripItineraryPage() {
  const { tripId } = useParams<{ tripId: string }>();

  const { data, isLoading } = useQuery<TripDetails>({
    queryKey: tripKeys.detail(tripId),
    queryFn: () => apiClient.get(`/api/trips/${tripId}`),
    enabled: !!tripId,
  });

  const days = data?.days ?? [];
  const currency = data?.trip?.currency ?? "USD";

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-64" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Itinerary Builder</h2>
          <p className="text-xs text-muted-foreground">
            Organize activities day by day with real-time budget sync.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {days.length} days · {days.reduce((acc, d) => acc + (d.items?.length ?? 0), 0)} items
          </Badge>
        </div>
      </div>

      {days.length === 0 ? (
        <Card className="border-dashed flex flex-col items-center justify-center py-16 text-center">
          <CalendarIcon className="size-12 text-muted-foreground opacity-30 mb-3" />
          <p className="font-semibold">No itinerary days yet</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Add destinations and set trip dates to automatically generate day-by-day planning slots.
          </p>
        </Card>
      ) : (
        <div className="space-y-5">
          {days.map((day) => {
            const dayTotal = (day.items ?? []).reduce(
              (acc, item) => acc + Number(item.estimatedCost ?? 0),
              0
            );

            return (
              <Card key={day.id} className="border-border/80 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/40 py-3 px-4 border-b">
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
                        {day.dayNumber}
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">
                          {day.title ? `Day ${day.dayNumber}: ${day.title}` : `Day ${day.dayNumber}`}
                        </CardTitle>
                        {day.date && (
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(day.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {dayTotal > 0 && (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {currency} {dayTotal.toFixed(0)} est.
                        </span>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {(day.items ?? []).length} items
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3">
                  {(day.items ?? []).length === 0 ? (
                    <p className="text-xs text-muted-foreground italic py-1">
                      Nothing scheduled yet — add your first activity!
                    </p>
                  ) : (
                    (day.items ?? []).map((item) => (
                      <ItineraryItemRow
                        key={item.id}
                        item={item}
                        tripId={tripId}
                        dayId={day.id}
                        currency={currency}
                      />
                    ))
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t">
                    <div className="flex-1 text-xs text-muted-foreground">
                      Add an activity to Day {day.dayNumber}
                    </div>
                    <AddItemDialog
                      tripId={tripId}
                      dayId={day.id}
                      dayNumber={day.dayNumber}
                      onSuccess={() => {}}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
