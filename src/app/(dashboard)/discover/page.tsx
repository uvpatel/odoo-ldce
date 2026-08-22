import * as React from "react"
import Link from "next/link"
import {
  CompassIcon,
  MapPinIcon,
  SparklesIcon,
  Building2Icon,
  ArrowRightIcon,
  SearchIcon,
  StarIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const POPULAR_CITIES = [
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=60",
    activitiesCount: 142,
    costIndex: "$$$",
    score: "4.9",
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=60",
    activitiesCount: 185,
    costIndex: "$$$$",
    score: "4.8",
  },
  {
    id: "rome",
    name: "Rome",
    country: "Italy",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=60",
    activitiesCount: 120,
    costIndex: "$$$",
    score: "4.9",
  },
  {
    id: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&auto=format&fit=crop&q=60",
    activitiesCount: 98,
    costIndex: "$$",
    score: "4.7",
  },
]

const TOP_ACTIVITIES = [
  {
    id: "shibuya-sky",
    title: "Shibuya Sky Observation Deck",
    city: "Tokyo, Japan",
    category: "Sightseeing",
    rating: "4.9",
    price: "$22",
  },
  {
    id: "louvre-museum",
    title: "Louvre Museum Masterpieces Tour",
    city: "Paris, France",
    category: "Culture & Art",
    rating: "4.9",
    price: "$35",
  },
  {
    id: "colosseum-arena",
    title: "Colosseum Gladiator Arena & Forum",
    city: "Rome, Italy",
    category: "History",
    rating: "4.95",
    price: "$40",
  },
]

export default function DiscoverOverviewPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col gap-3">
        <Badge variant="secondary" className="w-fit gap-1 text-xs">
          <CompassIcon className="size-3 text-primary" />
          Global Travel Catalog
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Discover Destinations & Experiences
        </h1>
        <p className="text-sm text-muted-foreground">
          Browse world-class destinations, verified activities, and curated travel sights to add directly to your itineraries.
        </p>
      </div>

      {/* Cities Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2Icon className="size-5 text-primary" />
            <h2 className="text-lg font-bold tracking-tight">Popular Destination Cities</h2>
          </div>
          <Button variant="ghost" size="sm" render={<Link href="/discover/cities" />} className="text-xs gap-1">
            <span>View All Cities</span>
            <ArrowRightIcon className="size-3.5" />
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_CITIES.map((city) => (
            <Card key={city.id} className="group overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <img
                  src={city.image}
                  alt={city.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 rounded-full bg-background/90 backdrop-blur-sm px-2 py-0.5 text-[11px] font-semibold flex items-center gap-1 shadow-sm">
                  <StarIcon className="size-3 fill-yellow-400 text-yellow-400" />
                  <span>{city.score}</span>
                </div>
              </div>
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                  {city.name}
                </CardTitle>
                <CardDescription className="text-xs">{city.country}</CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 flex-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>{city.activitiesCount} activities</span>
                <span className="font-mono font-medium">{city.costIndex}</span>
              </CardContent>
              <CardFooter className="p-3 pt-0">
                <Button size="sm" variant="outline" render={<Link href={`/discover/cities/${city.id}`} />} className="w-full text-xs">
                  Explore City
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Activities Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-5 text-primary" />
            <h2 className="text-lg font-bold tracking-tight">Top Rated Activities & Tours</h2>
          </div>
          <Button variant="ghost" size="sm" render={<Link href="/discover/activities" />} className="text-xs gap-1">
            <span>View All Activities</span>
            <ArrowRightIcon className="size-3.5" />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {TOP_ACTIVITIES.map((act) => (
            <Card key={act.id} className="p-4 hover:border-primary/60 transition-colors flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Badge variant="outline" className="text-[10px]">{act.category}</Badge>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {act.price}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-foreground">{act.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPinIcon className="size-3" />
                  {act.city}
                </p>
              </div>

              <Button size="sm" render={<Link href={`/discover/activities/${act.id}`} />} className="w-full text-xs">
                View Details
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
