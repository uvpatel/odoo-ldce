import * as React from "react"
import { CalendarIcon, ClockIcon, MapPinIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const CALENDAR_EVENTS = [
  { date: "Apr 10", day: "Fri", title: "Arrival in Tokyo", time: "14:00", place: "Shibuya", type: "Stay" },
  { date: "Apr 11", day: "Sat", title: "Asakusa & Ueno Tour", time: "09:00", place: "Asakusa", type: "Activity" },
  { date: "Apr 12", day: "Sun", title: "Bullet Train to Hakone", time: "10:30", place: "Hakone Onsen", type: "Transit" },
  { date: "Apr 13", day: "Mon", title: "Mt. Fuji Sightseeing & Ropeway", time: "11:00", place: "Lake Ashi", type: "Activity" },
  { date: "Apr 14", day: "Tue", title: "Shinkansen to Kyoto", time: "13:00", place: "Kyoto Station", type: "Transit" },
  { date: "Apr 15", day: "Wed", title: "Fushimi Inari Shrine Hike", time: "07:30", place: "Kyoto", type: "Activity" },
  { date: "Apr 16", day: "Thu", title: "Arashiyama Bamboo & Monkeys", time: "09:00", place: "Arashiyama", type: "Activity" },
]

export default async function TripCalendarPage({
  params,
}: {
  params: Promise<{ tripId: string }>
}) {
  const { tripId } = await params

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Trip Calendar & Timeline</h2>
          <p className="text-xs text-muted-foreground">
            Visual day-by-day calendar schedule and transit coordination.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <CalendarIcon className="size-3.5" />
            April 2026
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {CALENDAR_EVENTS.map((event, idx) => (
          <Card key={idx} className="flex flex-col border-border/80 hover:border-primary transition-colors">
            <CardHeader className="p-3 pb-2 bg-muted/30 border-b">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground">{event.date}</span>
                <Badge variant="outline" className="text-[10px] px-1 py-0">{event.day}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <Badge
                  variant={event.type === "Transit" ? "secondary" : "default"}
                  className="text-[10px] mb-1.5"
                >
                  {event.type}
                </Badge>
                <h4 className="text-xs font-semibold text-foreground line-clamp-2">{event.title}</h4>
              </div>
              <div className="pt-2 text-[11px] text-muted-foreground space-y-1">
                <div className="flex items-center gap-1">
                  <ClockIcon className="size-3 text-primary" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPinIcon className="size-3 text-muted-foreground" />
                  <span className="truncate">{event.place}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
