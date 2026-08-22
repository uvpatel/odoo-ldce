import * as React from "react";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateRange } from "@/lib/dates";

export interface TripSummaryItem {
  id: string;
  title: string;
  destination: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  coverImage?: string | null;
}

export function UpcomingTrips({ trips = [] }: { trips?: TripSummaryItem[] }) {
  if (trips.length === 0) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Upcoming Trips</CardTitle>
          <CardDescription>Your next scheduled adventures</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">No upcoming trips scheduled yet.</p>
          <Button asChild size="sm">
            <Link href="/trips/new">Plan a Trip</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Trips</CardTitle>
          <CardDescription>Your upcoming scheduled adventures</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/trips" className="gap-1">
            View All <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {trips.map((trip) => (
          <Link
            key={trip.id}
            href={`/trips/${trip.id}`}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">{trip.title}</h4>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {trip.destination && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" /> {trip.destination}
                  </span>
                )}
                {trip.startDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" /> {formatDateRange(trip.startDate, trip.endDate)}
                  </span>
                )}
              </div>
            </div>
            <Badge variant="secondary" className="capitalize">
              {trip.status}
            </Badge>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
