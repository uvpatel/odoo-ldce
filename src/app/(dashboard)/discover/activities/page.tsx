import * as React from "react"
import Link from "next/link"
import { SparklesIcon, MapPinIcon, StarIcon, SearchIcon, PlusIcon, FilterIcon, ClockIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const ACTIVITIES_LIST = [
  {
    id: "shibuya-sky",
    title: "Shibuya Sky 360 Observation Deck",
    city: "Tokyo, Japan",
    category: "Sightseeing",
    rating: "4.9",
    price: "$22",
    duration: "1.5 hours",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=60",
    description: "Panoramic 360-degree open-air rooftop observation deck looking over Tokyo Scramble and Mount Fuji.",
  },
  {
    id: "louvre-tour",
    title: "Louvre Museum Highlights & Mona Lisa Tour",
    city: "Paris, France",
    category: "Culture & Art",
    rating: "4.85",
    price: "$38",
    duration: "2.5 hours",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=60",
    description: "Skip the line guided walking tour covering the world's most celebrated art collections.",
  },
  {
    id: "colosseum-arena",
    title: "Colosseum Arena & Ancient Forum Experience",
    city: "Rome, Italy",
    category: "History",
    rating: "4.95",
    price: "$45",
    duration: "3 hours",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=60",
    description: "Step directly onto the gladiator floor and discover Roman forum ruins with expert historians.",
  },
  {
    id: "grand-palace-bangkok",
    title: "Grand Palace & Emerald Buddha Temple",
    city: "Bangkok, Thailand",
    category: "Culture",
    rating: "4.75",
    price: "$18",
    duration: "2 hours",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&auto=format&fit=crop&q=60",
    description: "Marvel at the intricate gilded spires, sacred murals, and iconic Thai architecture.",
  },
  {
    id: "sagrada-familia-tower",
    title: "Sagrada Família Basilica & Towers Access",
    city: "Barcelona, Spain",
    category: "Architecture",
    rating: "4.9",
    price: "$34",
    duration: "2 hours",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&auto=format&fit=crop&q=60",
    description: "Antoni Gaudí's unfinished masterpiece with soaring stained-glass light and elevator tower access.",
  },
  {
    id: "central-park-bike",
    title: "Central Park Scenic Guided Bike Tour",
    city: "New York, USA",
    category: "Outdoor",
    rating: "4.8",
    price: "$28",
    duration: "2 hours",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&auto=format&fit=crop&q=60",
    description: "Cruise through scenic bridges, Strawberry Fields, Bethesda Fountain, and lush park trails.",
  },
]

export default function DiscoverActivitiesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Activities & Sights</h1>
          <p className="text-sm text-muted-foreground">
            Search top attractions, experiences, museum tickets, and outdoor excursions worldwide.
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIVITIES_LIST.map((act) => (
          <Card key={act.id} className="group overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              <img
                src={act.image}
                alt={act.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 rounded-full bg-background/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold flex items-center gap-1 shadow-sm">
                <StarIcon className="size-3.5 fill-yellow-400 text-yellow-400" />
                <span>{act.rating}</span>
              </div>
              <div className="absolute bottom-3 left-3 rounded-md bg-black/60 backdrop-blur-sm px-2 py-0.5 text-xs text-white flex items-center gap-1">
                <MapPinIcon className="size-3 text-primary" />
                <span>{act.city}</span>
              </div>
            </div>

            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2 mb-1">
                <Badge variant="secondary" className="text-[10px]">{act.category}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <ClockIcon className="size-3" />
                  {act.duration}
                </span>
              </div>
              <CardTitle className="text-base line-clamp-1 group-hover:text-primary transition-colors">
                {act.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 pb-4">
              <p className="text-xs text-muted-foreground line-clamp-2">
                {act.description}
              </p>
            </CardContent>

            <CardFooter className="border-t pt-3 bg-muted/20 flex items-center justify-between">
              <span className="text-sm font-bold text-emerald-600">{act.price}</span>
              <Button size="sm" render={<Link href={`/discover/activities/${act.id}`} />} className="text-xs">
                View Activity
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
