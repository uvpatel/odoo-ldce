import * as React from "react"
import Link from "next/link"
import {
  PlaneIcon,
  PlusIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  DollarSignIcon,
  ArrowRightIcon,
  SparklesIcon,
  MoreVerticalIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const SAMPLE_USER_TRIPS = [
  {
    id: "trip-tokyo-2026",
    name: "Tokyo Spring Sakura Tour",
    description: "10-day adventure through Tokyo, Kyoto, and Osaka temples and food markets.",
    coverImageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=60",
    startDate: "2026-04-10",
    endDate: "2026-04-20",
    status: "planning",
    budget: "$3,200",
    membersCount: 3,
    stopsCount: 4,
  },
  {
    id: "trip-paris-2026",
    name: "Paris & French Riviera Roadtrip",
    description: "Museums, bistros, and coastal drives along Nice and Cannes.",
    coverImageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=60",
    startDate: "2026-06-15",
    endDate: "2026-06-25",
    status: "upcoming",
    budget: "$4,500",
    membersCount: 2,
    stopsCount: 3,
  },
  {
    id: "trip-iceland-2026",
    name: "Iceland Ring Road & Aurora Hunt",
    description: "Glaciers, hot springs, waterfalls, and northern lights.",
    coverImageUrl: "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?w=800&auto=format&fit=crop&q=60",
    startDate: "2026-09-05",
    endDate: "2026-09-14",
    status: "draft",
    budget: "$2,800",
    membersCount: 4,
    stopsCount: 5,
  },
]

export default function TripsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">My Trips</h1>
          <p className="text-sm text-muted-foreground">
            Manage your planned journeys, itineraries, and collaborative travel boards.
          </p>
        </div>
        <Button render={<Link href="/trips/new" />} className="gap-2 self-start sm:self-auto">
          <PlusIcon className="size-4" />
          Plan New Trip
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SAMPLE_USER_TRIPS.map((trip) => (
          <Card key={trip.id} className="group overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              <img
                src={trip.coverImageUrl}
                alt={trip.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                <Badge
                  variant={
                    trip.status === "upcoming"
                      ? "default"
                      : trip.status === "planning"
                      ? "secondary"
                      : "outline"
                  }
                  className="capitalize font-medium shadow-sm bg-background/90 text-foreground backdrop-blur-sm"
                >
                  {trip.status}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {trip.name}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-xs">
                {trip.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-4 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarIcon className="size-3.5 text-primary" />
                <span>
                  {trip.startDate} to {trip.endDate}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="flex items-center gap-1">
                  <MapPinIcon className="size-3.5" />
                  {trip.stopsCount} stops
                </span>
                <span className="flex items-center gap-1">
                  <UsersIcon className="size-3.5" />
                  {trip.membersCount} travelers
                </span>
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <DollarSignIcon className="size-3.5 text-emerald-600" />
                  {trip.budget}
                </span>
              </div>
            </CardContent>

            <CardFooter className="border-t pt-3 bg-muted/20 flex items-center justify-between">
              <Button variant="ghost" size="sm" render={<Link href={`/trips/${trip.id}/itinerary`} />} className="text-xs">
                Itinerary
              </Button>
              <Button size="sm" render={<Link href={`/trips/${trip.id}`} />} className="gap-1 text-xs">
                <span>Manage</span>
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
