import * as React from "react"
import Link from "next/link"
import { Building2Icon, PlusIcon, EditIcon, StarIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const ADMIN_CITIES = [
  { id: "tokyo", name: "Tokyo", country: "Japan", timezone: "Asia/Tokyo", costIndex: 4, popularity: "98/100", acts: 142 },
  { id: "paris", name: "Paris", country: "France", timezone: "Europe/Paris", costIndex: 5, popularity: "96/100", acts: 185 },
  { id: "rome", name: "Rome", country: "Italy", timezone: "Europe/Rome", costIndex: 3, popularity: "94/100", acts: 120 },
  { id: "bangkok", name: "Bangkok", country: "Thailand", timezone: "Asia/Bangkok", costIndex: 2, popularity: "91/100", acts: 98 },
]

export default function AdminCitiesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">City Catalog Administration</h1>
          <p className="text-sm text-muted-foreground">
            Manage destination cities, timezone offsets, and popularity indexing.
          </p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs">
          <PlusIcon className="size-3.5" />
          Add New City
        </Button>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-base">Destination Cities</CardTitle>
          <CardDescription className="text-xs">Indexed locations available in the trip planner</CardDescription>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          {ADMIN_CITIES.map((city) => (
            <div key={city.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{city.name}</span>
                  <Badge variant="outline" className="text-[10px]">{city.country}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Timezone: {city.timezone} • Popularity: {city.popularity} • {city.acts} activities
                </p>
              </div>

              <Button size="sm" variant="ghost" render={<Link href={`/discover/cities/${city.id}`} />} className="text-xs">
                Inspect
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
