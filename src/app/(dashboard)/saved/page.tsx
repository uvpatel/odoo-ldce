import * as React from "react"
import Link from "next/link"
import { BookmarkIcon, MapPinIcon, StarIcon, ArrowRightIcon, PlusIcon, HeartIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const SAVED_ITEMS = [
  {
    id: "saved-tokyo",
    type: "City",
    title: "Tokyo, Japan",
    subtitle: "Saved for Spring 2026 trip",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=60",
    url: "/discover/cities/tokyo",
    rating: "4.9",
  },
  {
    id: "saved-amalfi",
    type: "Itinerary",
    title: "Amalfi Coast & Capri Summer Escape",
    subtitle: "7-day coastal drive itinerary",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=60",
    url: "/shared/sample-amalfi-2026",
    rating: "4.95",
  },
  {
    id: "saved-colosseum",
    type: "Activity",
    title: "Colosseum Arena & Ancient Forum",
    subtitle: "Rome, Italy",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=60",
    url: "/discover/activities/colosseum-arena",
    rating: "4.95",
  },
]

export default function SavedDestinationsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Saved Places & Wishlist</h1>
          <p className="text-sm text-muted-foreground">
            Destinations, activities, and community itineraries you've bookmarked for future travels.
          </p>
        </div>
        <Button render={<Link href="/discover" />} variant="outline" className="gap-1.5 text-xs">
          <PlusIcon className="size-3.5" />
          Discover More Places
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SAVED_ITEMS.map((item) => (
          <Card key={item.id} className="group overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="text-[10px] bg-background/90 backdrop-blur-sm shadow-sm">
                  {item.type}
                </Badge>
              </div>
              <div className="absolute top-3 right-3 rounded-full bg-background/90 backdrop-blur-sm p-1.5 shadow-sm text-destructive">
                <HeartIcon className="size-3.5 fill-current" />
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-base group-hover:text-primary transition-colors">
                {item.title}
              </CardTitle>
              <CardDescription className="text-xs">{item.subtitle}</CardDescription>
            </CardHeader>

            <CardFooter className="border-t pt-3 bg-muted/20 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">★ {item.rating}</span>
              <Button size="sm" render={<Link href={item.url} />} className="text-xs gap-1">
                <span>View Details</span>
                <ArrowRightIcon className="size-3" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
