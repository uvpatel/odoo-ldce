import * as React from "react"
import Link from "next/link"
import { Building2Icon, MapPinIcon, StarIcon, SearchIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const CITIES_DATA = [
  { id: "tokyo", name: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=60", activities: 142, rating: "4.9", cost: "$$$", desc: "Ultramodern neon skyscrapers juxtaposed with historic temples and Michelin-starred dining." },
  { id: "paris", name: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=60", activities: 185, rating: "4.8", cost: "$$$$", desc: "City of Light featuring world-renowned art museums, haute cuisine, and iconic river walks." },
  { id: "rome", name: "Rome", country: "Italy", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=60", activities: 120, rating: "4.9", cost: "$$$", desc: "Ancient Colosseum ruins, Vatican treasures, and charming cobblestone alleys." },
  { id: "bangkok", name: "Bangkok", country: "Thailand", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&auto=format&fit=crop&q=60", activities: 98, rating: "4.7", cost: "$$", desc: "Vibrant street food, ornate river shrines, and bustling night markets." },
  { id: "barcelona", name: "Barcelona", country: "Spain", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&auto=format&fit=crop&q=60", activities: 110, rating: "4.85", cost: "$$$", desc: "Gaudí architecture, sunny Mediterranean beaches, and lively tapas bars." },
  { id: "new-york", name: "New York", country: "United States", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&auto=format&fit=crop&q=60", activities: 210, rating: "4.8", cost: "$$$$", desc: "Broadway shows, iconic skyline viewpoints, Central Park, and global cuisine." },
]

export default function DiscoverCitiesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Explore Cities</h1>
          <p className="text-sm text-muted-foreground">
            Explore curated city guides with local attractions, neighborhoods, and estimated costs.
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CITIES_DATA.map((city) => (
          <Card key={city.id} className="group overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              <img
                src={city.image}
                alt={city.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 rounded-full bg-background/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold flex items-center gap-1 shadow-sm">
                <StarIcon className="size-3.5 fill-yellow-400 text-yellow-400" />
                <span>{city.rating}</span>
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {city.name}
              </CardTitle>
              <CardDescription className="text-xs">
                {city.country} • {city.activities} activities
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-4">
              <p className="text-xs text-muted-foreground line-clamp-2">
                {city.desc}
              </p>
            </CardContent>

            <CardFooter className="border-t pt-3 bg-muted/20 flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-muted-foreground">{city.cost}</span>
              <Button size="sm" render={<Link href={`/discover/cities/${city.id}`} />} className="text-xs">
                View City Guide
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
