import { TripService } from "@/server/services/trip.service";
import { getCurrentUser } from "@/lib/auth/session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaneIcon, PlusIcon, CalendarIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";

export default async function TripsPage() {
  const user = await getCurrentUser();
  const tripsData = user ? await TripService.getUserTrips(user.id, { page: 1, limit: 50 }) : { items: [], total: 0 };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <PlaneIcon className="size-6 text-primary" />
            My Trips
          </h1>
          <p className="text-sm text-muted-foreground">
            Plan, organize, and collaborate on your multi-city travel itineraries.
          </p>
        </div>
        <Button >
          <Link href="/trips/new">
            <PlusIcon className="size-4 mr-2" />
            Create Trip
          </Link>
        </Button>
      </div>

      {tripsData.items.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <PlaneIcon className="size-12 text-muted-foreground mb-4 opacity-50" />
          <CardTitle className="text-lg">No trips created yet</CardTitle>
          <CardDescription className="max-w-sm mt-2">
            Start planning your next adventure by creating your first trip and adding destinations.
          </CardDescription>
          <Button  className="mt-6">
            <Link href="/trips/new">
              <PlusIcon className="size-4 mr-2" />
              Create Your First Trip
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tripsData.items.map((trip) => (
            <Card key={trip.id} className="overflow-hidden hover:shadow-md transition-shadow">
              {trip.coverImageUrl && (
                <div
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url(${trip.coverImageUrl})` }}
                />
              )}
              <CardHeader className="p-4">
                <CardTitle className="text-lg line-clamp-1">{trip.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {trip.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex flex-col gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="size-3.5" />
                  <span>
                    {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : "Flexible dates"}
                    {trip.endDate ? ` - ${new Date(trip.endDate).toLocaleDateString()}` : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t">
                  <span className="capitalize px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium">
                    {trip.status}
                  </span>
                  <span className="font-semibold text-foreground">
                    {trip.budgetLimit ? `${trip.currency} ${Number(trip.budgetLimit).toLocaleString()}` : "No budget set"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
