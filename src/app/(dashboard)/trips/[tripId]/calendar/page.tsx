"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, MapPinIcon, ClockIcon, DollarSignIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { tripKeys } from "@/lib/query-keys";
import { apiClient } from "@/lib/api-client";
import type { TripDetails, TripDay, ItineraryItem } from "@/features/trips/api/trips.api";

const TYPE_COLORS: Record<string, string> = {
  activity: "border-l-blue-400",
  transport: "border-l-amber-400",
  accommodation: "border-l-purple-400",
  meal: "border-l-emerald-400",
  custom: "border-l-gray-400",
};

const TYPE_DOT: Record<string, string> = {
  activity: "bg-blue-400",
  transport: "bg-amber-400",
  accommodation: "bg-purple-400",
  meal: "bg-emerald-400",
  custom: "bg-gray-400",
};

function DayColumn({ day, currency }: { day: TripDay; currency: string }) {
  const dayTotal = (day.items ?? []).reduce((acc, item) => acc + Number(item.estimatedCost ?? 0), 0);
  const dateObj = day.date ? new Date(day.date) : null;

  return (
    <div className="min-w-[200px] flex-1">
      {/* Day header */}
      <div className="sticky top-0 bg-card z-10 pb-2 mb-2">
        <div className="rounded-lg bg-muted/60 p-2 text-center border">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
            {dateObj
              ? dateObj.toLocaleDateString("en-US", { weekday: "short" })
              : `Day ${day.dayNumber}`}
          </div>
          <div className="font-bold text-lg leading-tight">
            {dateObj ? dateObj.getDate() : day.dayNumber}
          </div>
          {dateObj && (
            <div className="text-[10px] text-muted-foreground">
              {dateObj.toLocaleDateString("en-US", { month: "short" })}
            </div>
          )}
          {dayTotal > 0 && (
            <div className="text-[10px] font-semibold text-emerald-600 mt-1">
              {currency} {dayTotal.toFixed(0)}
            </div>
          )}
        </div>
      </div>

      {/* Activities */}
      <div className="space-y-2">
        {(day.items ?? []).length === 0 ? (
          <div className="rounded-lg border-2 border-dashed p-4 text-center text-[11px] text-muted-foreground">
            No activities
          </div>
        ) : (
          (day.items ?? [])
            .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""))
            .map((item) => (
              <div
                key={item.id}
                className={`rounded-lg border-l-4 border border-border bg-card p-2 space-y-1 hover:shadow-sm transition-shadow ${
                  TYPE_COLORS[item.type] ?? TYPE_COLORS.custom
                }`}
              >
                {item.startTime && (
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                    <ClockIcon className="size-2.5" />
                    {item.startTime.slice(0, 5)}
                  </div>
                )}
                <p className="text-xs font-semibold line-clamp-2">{item.title}</p>
                {item.location && (
                  <p className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    <MapPinIcon className="size-2.5 shrink-0" />
                    <span className="line-clamp-1">{item.location}</span>
                  </p>
                )}
                {Number(item.estimatedCost) > 0 && (
                  <p className="text-[10px] text-emerald-600 font-semibold">
                    {currency} {Number(item.estimatedCost).toFixed(0)}
                  </p>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default function TripCalendarPage() {
  const { tripId } = useParams<{ tripId: string }>();

  const { data, isLoading } = useQuery<TripDetails>({
    queryKey: tripKeys.detail(tripId),
    queryFn: () => apiClient.get(`/api/trips/${tripId}`),
    enabled: !!tripId,
  });

  const days = data?.days ?? [];
  const trip = data?.trip;
  const currency = trip?.currency ?? "USD";

  const totalItems = days.reduce((acc, d) => acc + (d.items?.length ?? 0), 0);
  const totalCost = days.reduce(
    (acc, d) =>
      acc + (d.items ?? []).reduce((inner, item) => inner + Number(item.estimatedCost ?? 0), 0),
    0
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-3 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="min-w-[180px] h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Calendar View</h2>
          <p className="text-xs text-muted-foreground">
            Day-by-day visual overview of your trip schedule.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {days.length} days · {totalItems} items
          </Badge>
          {totalCost > 0 && (
            <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200">
              {currency} {totalCost.toLocaleString()} estimated
            </Badge>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground flex-wrap">
        {["activity", "transport", "accommodation", "meal"].map((type) => (
          <div key={type} className="flex items-center gap-1">
            <div className={`size-2 rounded-full ${TYPE_DOT[type]}`} />
            <span className="capitalize">{type}</span>
          </div>
        ))}
      </div>

      {days.length === 0 ? (
        <Card className="border-dashed flex flex-col items-center justify-center py-16 text-center">
          <CalendarIcon className="size-12 text-muted-foreground opacity-30 mb-3" />
          <p className="font-semibold">No days in this trip yet</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Add destinations and set trip dates to see your calendar view.
          </p>
        </Card>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max">
            {days.map((day) => (
              <DayColumn key={day.id} day={day} currency={currency} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
