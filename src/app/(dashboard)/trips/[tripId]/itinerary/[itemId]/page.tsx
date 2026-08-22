"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeftIcon, ClockIcon, DollarSignIcon, FileTextIcon, MapPinIcon } from "lucide-react";
import { useItineraryItem } from "@/features/itinerary/hooks/use-itinerary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ItineraryItemPage() {
  const { tripId, itemId } = useParams<{ tripId: string; itemId: string }>();
  const { data: item, isLoading, isError } = useItineraryItem(tripId, itemId);

  if (isLoading) {
    return <Skeleton className="mx-auto h-72 w-full max-w-3xl rounded-2xl" />;
  }

  if (isError || !item) {
    return (
      <Card className="mx-auto max-w-xl border-dashed text-center">
        <CardContent className="py-14">
          <p className="font-semibold">Itinerary item not found</p>
          <p className="mt-1 text-sm text-muted-foreground">It may have been removed or you may not have access.</p>
          <Button asChild variant="outline" className="mt-5"><Link href={`/trips/${tripId}/itinerary`}>Back to itinerary</Link></Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Button asChild variant="ghost" size="sm"><Link href={`/trips/${tripId}/itinerary`}><ArrowLeftIcon />Back to itinerary</Link></Button>
      <Card className="overflow-hidden border-primary/15 shadow-lg shadow-primary/5">
        <CardHeader className="border-b bg-linear-to-br from-primary/10 via-background to-background">
          <Badge variant="outline" className="w-fit capitalize">{item.type}</Badge>
          <CardTitle className="text-2xl">{item.title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
          {item.location ? <Detail icon={<MapPinIcon />} label="Location" value={item.location} /> : null}
          {item.startTime ? <Detail icon={<ClockIcon />} label="Time" value={`${item.startTime.slice(0, 5)}${item.endTime ? ` – ${item.endTime.slice(0, 5)}` : ""}`} /> : null}
          {Number(item.estimatedCost) > 0 ? <Detail icon={<DollarSignIcon />} label="Estimated cost" value={`${item.currency} ${Number(item.estimatedCost).toFixed(2)}`} /> : null}
          {item.notes ? <Detail icon={<FileTextIcon />} label="Notes" value={item.notes} wide /> : null}
          {!item.location && !item.startTime && !item.notes && Number(item.estimatedCost) === 0 ? <p className="text-sm text-muted-foreground sm:col-span-2">No additional details have been added yet.</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({ icon, label, value, wide = false }: { icon: React.ReactNode; label: string; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-xl border bg-muted/25 p-4 ${wide ? "sm:col-span-2" : ""}`}>
      <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">{icon}<span>{label}</span></div>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
