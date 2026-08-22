import * as React from "react"
import Link from "next/link"
import {
  Building2Icon,
  MapPinIcon,
  StarIcon,
  ArrowLeftIcon,
  SparklesIcon,
  DollarSignIcon,
  PlusIcon,
  CompassIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function CityDetailPage({
  params,
}: {
  params: Promise<{ cityId: string }>
}) {
  const { cityId } = await params
  const cityName = cityId.charAt(0).toUpperCase() + cityId.slice(1)

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" render={<Link href="/discover/cities" />} className="gap-1.5 text-muted-foreground text-xs">
          <ArrowLeftIcon className="size-4" />
          Back to Cities
        </Button>
      </div>

      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border shadow-sm bg-muted">
        <img
          src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80"
          alt={cityName}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary text-primary-foreground text-xs">Featured City</Badge>
            <div className="flex items-center gap-1 text-xs bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">
              <StarIcon className="size-3.5 fill-yellow-400 text-yellow-400" />
              <span>4.9 (1,240 ratings)</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold md:text-5xl">{cityName}</h1>
          <p className="text-sm text-white/80 max-w-2xl mt-1">
            Immerse yourself in world-renowned landmarks, local culinary delights, vibrant neighborhoods, and rich cultural heritage.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Average Daily Budget</CardDescription>
            <CardTitle className="text-xl font-bold flex items-center gap-1">
              <DollarSignIcon className="size-4 text-emerald-600" />
              $160 / day
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Includes meals, local transport, and entry tickets
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Best Time to Visit</CardDescription>
            <CardTitle className="text-xl font-bold flex items-center gap-1">
              <CompassIcon className="size-4 text-primary" />
              Mar – May & Sep – Nov
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Mild weather and scenic seasonal foliage
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Curated Sights</CardDescription>
            <CardTitle className="text-xl font-bold flex items-center gap-1">
              <SparklesIcon className="size-4 text-primary" />
              140+ Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            From historic temples to modern nightlife
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Top Activities in {cityName}</h2>
          <Button variant="outline" size="sm" render={<Link href="/discover/activities" />} className="text-xs">
            Browse All
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: "Famous Observation Deck Experience", price: "$22", category: "Sightseeing", time: "2 Hours" },
            { title: "Old Town Cultural Temple Walking Tour", price: "Free", category: "History", time: "3 Hours" },
            { title: "Traditional Food Tasting & Night Walk", price: "$45", category: "Food & Dining", time: "2.5 Hours" },
            { title: "Modern Art & Technology Digital Exhibition", price: "$30", category: "Art & Museum", time: "2 Hours" },
          ].map((act, i) => (
            <Card key={i} className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px]">{act.category}</Badge>
                  <span className="text-[11px] text-muted-foreground">{act.time}</span>
                </div>
                <h4 className="font-semibold text-sm">{act.title}</h4>
                <span className="text-xs font-semibold text-emerald-600 mt-1 inline-block">{act.price}</span>
              </div>
              <Button size="sm" className="text-xs gap-1">
                <PlusIcon className="size-3.5" />
                Add to Trip
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
