import * as React from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TripSummaryItem } from "./upcoming-trips";

export function RecentTrips({ trips = [] }: { trips?: TripSummaryItem[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Trips</CardTitle>
          <CardDescription>Past journeys and memories</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {trips.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No completed trips yet.</p>
        ) : (
          <div className="space-y-3">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-green-500" />
                  <span className="text-sm font-medium">{trip.title}</span>
                </div>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
