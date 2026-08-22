import * as React from "react"
import Link from "next/link"
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  DollarSignIcon,
  RouteIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function TripOverviewPage({
  params,
}: {
  params: Promise<{ tripId: string }>
}) {
  const { tripId } = await params

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Trip Duration</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <CalendarIcon className="size-5 text-primary" />
              10 Days
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Apr 10 – Apr 20, 2026
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Stops</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <MapPinIcon className="size-5 text-primary" />
              4 Cities
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Tokyo, Hakone, Kyoto, Osaka
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Budget Tracked</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <DollarSignIcon className="size-5 text-emerald-600" />
              $2,140 / $3,200
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            67% of total budget spent
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Travel Party</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <UsersIcon className="size-5 text-primary" />
              3 Travelers
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            1 Admin, 2 Editors
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RouteIcon className="size-4 text-primary" />
              Upcoming Itinerary Items
            </CardTitle>
            <CardDescription className="text-xs">Next activities on your schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { day: "Day 1", time: "14:00", title: "Shibuya Crossing & Hachiko Statue", location: "Shibuya" },
              { day: "Day 1", time: "18:00", title: "Shibuya Sky Sunset View", location: "Shibuya Scramble Square" },
              { day: "Day 2", time: "09:00", title: "Senso-ji Temple Walking Tour", location: "Asakusa" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5">{item.day} • {item.time}</Badge>
                    <span className="text-xs font-semibold">{item.title}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{item.location}</p>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-4 border-t bg-muted/10">
            <Button variant="ghost" size="sm" render={<Link href={`/trips/${tripId}/itinerary`} />} className="w-full text-xs gap-1">
              <span>View Full Interactive Itinerary</span>
              <ArrowRightIcon className="size-3.5" />
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <SparklesIcon className="size-4 text-primary" />
              Recommended Activities Nearby
            </CardTitle>
            <CardDescription className="text-xs">Based on your destination and stops</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: "TeamLab Planets Digital Art", category: "Exhibition", rating: "4.9" },
              { title: "Tsukiji Outer Market Food Tour", category: "Food & Dining", rating: "4.8" },
              { title: "Meiji Jingu Shrine & Harajuku", category: "Culture", rating: "4.9" },
            ].map((act, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold">{act.title}</span>
                  <p className="text-[11px] text-muted-foreground">{act.category} • ★ {act.rating}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs h-7">
                  Add to Day
                </Button>
              </div>
            ))}
          </CardContent>
          <div className="p-4 border-t bg-muted/10">
            <Button variant="ghost" size="sm" render={<Link href="/discover/activities" />} className="w-full text-xs gap-1">
              <span>Explore All Activities</span>
              <ArrowRightIcon className="size-3.5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
