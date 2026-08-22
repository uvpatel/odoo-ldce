import * as React from "react"
import { BarChart3Icon, TrendingUpIcon, UsersIcon, PlaneIcon, CompassIcon, ArrowUpRightIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"

export default function AdminAnalyticsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Platform Analytics & Metrics</h1>
          <p className="text-sm text-muted-foreground">
            Traveler growth, destination popularity index, and itinerary creation trends.
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          Realtime Live Metrics
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Monthly Active Travelers</CardDescription>
            <CardTitle className="text-2xl font-bold">12,450</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-emerald-600 flex items-center gap-1">
            <TrendingUpIcon className="size-3.5" />
            +18.2% vs last month
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Itineraries Generated</CardDescription>
            <CardTitle className="text-2xl font-bold">48,920</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-emerald-600 flex items-center gap-1">
            <TrendingUpIcon className="size-3.5" />
            +24.5% vs last month
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Avg. Budget Per Trip</CardDescription>
            <CardTitle className="text-2xl font-bold">$2,840</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Top spending category: Lodging
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Share Link Conversion</CardDescription>
            <CardTitle className="text-2xl font-bold">34.8%</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-emerald-600 flex items-center gap-1">
            <TrendingUpIcon className="size-3.5" />
            +5.1% viral coefficient
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trip Creation & Traveler Activity Over Time</CardTitle>
          <CardDescription className="text-xs">Daily active sessions and itinerary saves</CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-0 sm:px-6">
          <ChartAreaInteractive />
        </CardContent>
      </Card>
    </div>
  )
}
