import * as React from "react"
import Link from "next/link"
import { CompassIcon, MapPinIcon, StarIcon, ArrowRightIcon, CalendarIcon, UsersIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const FEATURED_TRIPS = [
  {
    id: "trip-tokyo",
    title: "Tokyo & Kyoto Cherry Blossom Odyssey",
    location: "Japan",
    duration: "10 Days",
    highlights: ["Shibuya Crossing", "Fushimi Inari", "Arashiyama Bamboo Grove"],
    author: "Elena Rostova",
    rating: "4.9",
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=60",
    token: "sample-tokyo-2026",
  },
  {
    id: "trip-amalfi",
    title: "Amalfi Coast & Capri Summer Escape",
    location: "Italy",
    duration: "7 Days",
    highlights: ["Positano Cliffside", "Capri Blue Grotto", "Ravello Gardens"],
    author: "Marco Bellini",
    rating: "4.95",
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=60",
    token: "sample-amalfi-2026",
  },
  {
    id: "trip-swiss",
    title: "Swiss Alps Scenic Train & Hiking Tour",
    location: "Switzerland",
    duration: "8 Days",
    highlights: ["Zermatt Matterhorn", "Glacier Express", "Interlaken Lakes"],
    author: "Sarah Jenkins",
    rating: "4.88",
    imageUrl: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&auto=format&fit=crop&q=60",
    token: "sample-swiss-2026",
  },
  {
    id: "trip-bali",
    title: "Bali Tropical Culture & Beach Retreat",
    location: "Indonesia",
    duration: "12 Days",
    highlights: ["Ubud Rice Terraces", "Seminyak Sunsets", "Nusa Penida"],
    author: "Devon Chen",
    rating: "4.92",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=60",
    token: "sample-bali-2026",
  },
]

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="flex flex-col gap-4 text-center items-center mb-12">
        <Badge variant="secondary" className="px-3 py-1 gap-1 text-sm">
          <CompassIcon className="size-3.5 text-primary" />
          Community Itineraries
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          Explore Handcrafted Trips & Guides
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Discover proven itineraries built by fellow travelers. Clone any trip into your GlobeTrotter workspace with a single click.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
        {FEATURED_TRIPS.map((trip) => (
          <Card key={trip.id} className="overflow-hidden group hover:shadow-lg transition-all border-border/70 flex flex-col">
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              <img
                src={trip.imageUrl}
                alt={trip.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 rounded-full bg-background/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold flex items-center gap-1 shadow-sm">
                <StarIcon className="size-3.5 fill-yellow-400 text-yellow-400" />
                <span>{trip.rating}</span>
              </div>
              <div className="absolute bottom-3 left-3 rounded-md bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white flex items-center gap-1">
                <MapPinIcon className="size-3.5 text-primary" />
                <span>{trip.location}</span>
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {trip.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="size-3.5" />
                  {trip.duration}
                </span>
                <span className="flex items-center gap-1">
                  <UsersIcon className="size-3.5" />
                  By {trip.author}
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-4">
              <div className="flex flex-wrap gap-1.5">
                {trip.highlights.map((h) => (
                  <Badge key={h} variant="outline" className="text-xs font-normal">
                    {h}
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className="border-t pt-4 bg-muted/20 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Free public itinerary</span>
              <Button size="sm" render={<Link href={`/shared/${trip.token}`} />} className="gap-1.5">
                <span>View Itinerary</span>
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
