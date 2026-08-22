"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import {
  PlusIcon,
  ClockIcon,
  MapPinIcon,
  Trash2Icon,
  GripVerticalIcon,
  SparklesIcon,
  DollarSignIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

type ItineraryActivity = {
  id: string
  time: string
  title: string
  location: string
  cost: number
  notes: string
}

type DayPlan = {
  id: string
  dayNumber: number
  date: string
  title: string
  activities: ItineraryActivity[]
}

const INITIAL_DAYS: DayPlan[] = [
  {
    id: "day-1",
    dayNumber: 1,
    date: "2026-04-10",
    title: "Arrival & Shibuya Vibes",
    activities: [
      {
        id: "act-1",
        time: "14:00",
        title: "Hotel Check-in & Unpack",
        location: "Shibuya Excel Hotel Tokyu",
        cost: 220,
        notes: "Overlooks Shibuya Scramble",
      },
      {
        id: "act-2",
        time: "17:30",
        title: "Shibuya Sky Sunset & Drinks",
        location: "Shibuya Scramble Square Roof",
        cost: 25,
        notes: "Pre-booked sunset slot",
      },
      {
        id: "act-3",
        time: "20:00",
        title: "Dinner at Omoide Yokocho",
        location: "Shinjuku",
        cost: 35,
        notes: "Yakitori and local craft draft beer",
      },
    ],
  },
  {
    id: "day-2",
    dayNumber: 2,
    date: "2026-04-11",
    title: "Old Tokyo Culture & Akihabara",
    activities: [
      {
        id: "act-4",
        time: "09:00",
        title: "Senso-ji & Nakamise Dori Street",
        location: "Asakusa",
        cost: 0,
        notes: "Try freshly made melonpan",
      },
      {
        id: "act-5",
        time: "13:30",
        title: "Ueno Park & Tokyo National Museum",
        location: "Ueno",
        cost: 15,
        notes: "Cherry blossom stroll along Shinobazu pond",
      },
    ],
  },
]

export default function TripItineraryPage() {
  const params = useParams()
  const [days, setDays] = React.useState<DayPlan[]>(INITIAL_DAYS)
  const [newActivityTitle, setNewActivityTitle] = React.useState("")
  const [activeDayId, setActiveDayId] = React.useState("day-1")

  const handleAddActivity = (dayId: string) => {
    if (!newActivityTitle.trim()) {
      toast.error("Please enter an activity title.")
      return
    }

    const newAct: ItineraryActivity = {
      id: `act-${Date.now()}`,
      time: "12:00",
      title: newActivityTitle.trim(),
      location: "Tokyo, Japan",
      cost: 20,
      notes: "Newly added activity",
    }

    setDays((prev) =>
      prev.map((d) =>
        d.id === dayId ? { ...d, activities: [...d.activities, newAct] } : d
      )
    )
    setNewActivityTitle("")
    toast.success("Activity added to Day!")
  }

  const handleDeleteActivity = (dayId: string, actId: string) => {
    setDays((prev) =>
      prev.map((d) =>
        d.id === dayId
          ? { ...d, activities: d.activities.filter((a) => a.id !== actId) }
          : d
      )
    )
    toast.info("Activity removed.")
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Interactive Itinerary Builder</h2>
          <p className="text-xs text-muted-foreground">
            Drag, organize, and schedule activities day by day with real-time budget sync.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => toast.success("Itinerary auto-saved.")}>
            Auto-saved
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {days.map((day) => (
          <Card key={day.id} className="border-border/80 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/40 py-3 px-4 border-b flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
                  {day.dayNumber}
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">
                    Day {day.dayNumber}: {day.title}
                  </CardTitle>
                  <span className="text-[11px] text-muted-foreground">{day.date}</span>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {day.activities.length} activities
              </Badge>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {day.activities.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-2">No activities scheduled yet for this day.</p>
              ) : (
                day.activities.map((act) => (
                  <div
                    key={act.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <GripVerticalIcon className="size-4 text-muted-foreground/50 mt-1 cursor-grab" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-primary border-primary/30 flex items-center gap-1 font-mono">
                            <ClockIcon className="size-3" />
                            {act.time}
                          </Badge>
                          <span className="text-sm font-semibold text-foreground">{act.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPinIcon className="size-3 text-muted-foreground" />
                          {act.location} {act.notes ? `• ${act.notes}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                        ${act.cost}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleDeleteActivity(day.id, act.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}

              {/* Quick Add Bar */}
              <div className="flex items-center gap-2 pt-2">
                <Input
                  placeholder={`Add an activity to Day ${day.dayNumber}...`}
                  value={activeDayId === day.id ? newActivityTitle : ""}
                  onChange={(e) => {
                    setActiveDayId(day.id)
                    setNewActivityTitle(e.target.value)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddActivity(day.id)
                    }
                  }}
                  className="h-8 text-xs"
                />
                <Button size="sm" onClick={() => handleAddActivity(day.id)} className="h-8 gap-1 text-xs shrink-0">
                  <PlusIcon className="size-3.5" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
