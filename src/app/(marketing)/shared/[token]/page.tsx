import * as React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  CompassIcon,
  MapPinIcon,
  CalendarIcon,
  CopyIcon,
  ClockIcon,
  DollarSignIcon,
  SparklesIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const SAMPLE_TRIPS_DATA: Record<
  string,
  {
    title: string
    destination: string
    duration: string
    daysCount: number
    author: string
    estimatedBudget: string
    days: {
      dayNumber: number
      title: string
      activities: {
        time: string
        title: string
        location: string
        cost: string
        notes: string
      }[]
    }[]
  }
> = {
  "sample-tokyo-2026": {
    title: "Tokyo & Kyoto Cherry Blossom Odyssey",
    destination: "Tokyo & Kyoto, Japan",
    duration: "10 Days",
    daysCount: 10,
    author: "Elena Rostova",
    estimatedBudget: "$2,400",
    days: [
      {
        dayNumber: 1,
        title: "Arrival in Tokyo & Shibuya Crossing",
        activities: [
          {
            time: "14:00",
            title: "Check-in at Shibuya Stream Hotel",
            location: "Shibuya, Tokyo",
            cost: "$180",
            notes: "Direct access from Shibuya Station",
          },
          {
            time: "17:30",
            title: "Shibuya Sky Observation Deck",
            location: "Shibuya Scramble Square",
            cost: "$20",
            notes: "Sunset views over Shibuya Crossing",
          },
          {
            time: "20:00",
            title: "Dinner at Ichiran Ramen Shibuya",
            location: "Shibuya",
            cost: "$15",
            notes: "Iconic solo booth tonkotsu experience",
          },
        ],
      },
      {
        dayNumber: 2,
        title: "Historic Asakusa & Akihabara Tech Hub",
        activities: [
          {
            time: "09:00",
            title: "Senso-ji Temple & Nakamise Street",
            location: "Asakusa",
            cost: "Free",
            notes: "Tokyo's oldest and most famous temple",
          },
          {
            time: "13:00",
            title: "Tokyo Skytree Panorama",
            location: "Sumida",
            cost: "$25",
            notes: "View across Kanto plain to Mt. Fuji",
          },
          {
            time: "16:00",
            title: "Akihabara Electronic & Anime Tour",
            location: "Akihabara",
            cost: "Variable",
            notes: "Retro gaming shops and arcades",
          },
        ],
      },
    ],
  },
}

export default async function SharedTripPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const trip = SAMPLE_TRIPS_DATA[token] || {
    title: `Shared Itinerary #${token}`,
    destination: "Worldwide Destination",
    duration: "7 Days",
    daysCount: 7,
    author: "GlobeTrotter Explorer",
    estimatedBudget: "$1,850",
    days: [
      {
        dayNumber: 1,
        title: "Arrival & City Orientation",
        activities: [
          {
            time: "10:00",
            title: "Hotel Check-in & Coffee",
            location: "City Center",
            cost: "$30",
            notes: "Relax and unpack",
          },
          {
            time: "14:00",
            title: "Historic Walking Tour",
            location: "Old Town District",
            cost: "$25",
            notes: "Guided exploration of cultural landmarks",
          },
        ],
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" render={<Link href="/explore" />} className="gap-2 text-muted-foreground">
          <ArrowLeftIcon className="size-4" />
          Back to Explore
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <CopyIcon className="size-3.5" />
            Copy Share Link
          </Button>
          <Button size="sm" render={<Link href="/trips/new" />} className="gap-1.5">
            <SparklesIcon className="size-3.5" />
            Clone Trip
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary" className="gap-1">
              <MapPinIcon className="size-3 text-primary" />
              {trip.destination}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <CalendarIcon className="size-3" />
              {trip.duration}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <DollarSignIcon className="size-3" />
              Est. {trip.estimatedBudget}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-2 md:text-4xl text-foreground">
            {trip.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Curated by <span className="font-medium text-foreground">{trip.author}</span> • Shared via GlobeTrotter
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <CheckCircle2Icon className="size-5 text-primary" />
            Itinerary Schedule
          </h2>

          {trip.days.map((day) => (
            <Card key={day.dayNumber} className="border-border/80">
              <CardHeader className="pb-3 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {day.dayNumber}
                    </div>
                    <CardTitle className="text-lg">Day {day.dayNumber}: {day.title}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {day.activities.length} activities
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 divide-y">
                {day.activities.map((activity, idx) => (
                  <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary px-2 py-0.5 rounded bg-primary/10 flex items-center gap-1">
                          <ClockIcon className="size-3" />
                          {activity.time}
                        </span>
                        <span className="font-medium text-foreground text-sm">{activity.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPinIcon className="size-3" />
                        {activity.location} • {activity.notes}
                      </p>
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground self-start sm:self-auto bg-muted px-2 py-1 rounded">
                      {activity.cost}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
