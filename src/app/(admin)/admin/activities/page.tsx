import * as React from "react"
import Link from "next/link"
import { SparklesIcon, PlusIcon, MapPinIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const ADMIN_ACTIVITIES = [
  { id: "shibuya-sky", title: "Shibuya Sky Observation Deck", city: "Tokyo", category: "Sightseeing", rating: "4.9", price: "$22" },
  { id: "louvre-museum", title: "Louvre Museum Masterpieces Tour", city: "Paris", category: "Culture & Art", rating: "4.85", price: "$38" },
  { id: "colosseum-arena", title: "Colosseum Gladiator Arena", city: "Rome", category: "History", rating: "4.95", price: "$45" },
  { id: "grand-palace", title: "Grand Palace & Emerald Buddha", city: "Bangkok", category: "Culture", rating: "4.75", price: "$18" },
]

export default function AdminActivitiesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Activity & Tour Catalog</h1>
          <p className="text-sm text-muted-foreground">
            Curate and manage verified attractions, museum passes, and outdoor sights.
          </p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs">
          <PlusIcon className="size-3.5" />
          Add Activity
        </Button>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-base">Verified Attractions</CardTitle>
          <CardDescription className="text-xs">Sights available for itinerary building</CardDescription>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          {ADMIN_ACTIVITIES.map((act) => (
            <div key={act.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{act.title}</span>
                  <Badge variant="secondary" className="text-[10px] py-0">{act.category}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Location: {act.city} • Rating: ★ {act.rating} • Price: {act.price}
                </p>
              </div>

              <Button size="sm" variant="ghost" render={<Link href={`/discover/activities/${act.id}`} />} className="text-xs">
                Inspect
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
