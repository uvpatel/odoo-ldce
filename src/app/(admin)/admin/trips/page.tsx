import * as React from "react"
import Link from "next/link"
import { PlaneIcon, ShieldIcon, EyeIcon, SearchIcon, ArrowRightIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const ADMIN_TRIPS = [
  { id: "trip-1", name: "Tokyo Spring Sakura Tour", owner: "Elena Rostova", stops: 4, budget: "$3,200", visibility: "shared", status: "planning" },
  { id: "trip-2", name: "Paris & French Riviera Roadtrip", owner: "Marco Bellini", stops: 3, budget: "$4,500", visibility: "public", status: "upcoming" },
  { id: "trip-3", name: "Iceland Ring Road & Aurora Hunt", owner: "Sarah Jenkins", stops: 5, budget: "$2,800", visibility: "private", status: "draft" },
  { id: "trip-4", name: "Swiss Alps Scenic Train Tour", owner: "Devon Chen", stops: 3, budget: "$3,600", visibility: "public", status: "active" },
]

export default function AdminTripsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Trip Moderation & Management</h1>
          <p className="text-sm text-muted-foreground">
            Audit all public and private trips created on the GlobeTrotter platform.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-base">All Platform Trips</CardTitle>
          <CardDescription className="text-xs">Database records of traveler itineraries</CardDescription>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          {ADMIN_TRIPS.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{t.name}</span>
                  <Badge variant={t.visibility === "public" ? "default" : "secondary"} className="text-[10px] py-0">
                    {t.visibility}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] py-0 capitalize">
                    {t.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Owner: {t.owner} • {t.stops} stops • Budget: {t.budget}
                </p>
              </div>

              <Button size="sm" variant="outline" render={<Link href={`/trips/${t.id}`} />} className="text-xs gap-1">
                <EyeIcon className="size-3.5" />
                Inspect
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
