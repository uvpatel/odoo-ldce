"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  PlaneIcon,
  ArrowLeftIcon,
  SparklesIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewTripPage() {
  const router = useRouter()
  const [name, setName] = React.useState("")
  const [destination, setDestination] = React.useState("")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [budgetLimit, setBudgetLimit] = React.useState("")
  const [visibility, setVisibility] = React.useState("private")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Please enter a trip name.")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      const fakeId = `trip-${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString().slice(-4)}`
      toast.success("Trip created successfully! Redirecting to itinerary builder...")
      router.push(`/trips/${fakeId}/itinerary`)
    }, 600)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" render={<Link href="/trips" />} className="gap-1.5 text-muted-foreground">
          <ArrowLeftIcon className="size-4" />
          Back to Trips
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <PlaneIcon className="size-5" />
            </div>
            <div>
              <CardTitle className="text-2xl">Plan a New Adventure</CardTitle>
              <CardDescription>
                Set up your destination, dates, and budget to start building your daily itinerary.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field>
              <FieldLabel htmlFor="tripName">Trip Title</FieldLabel>
              <Input
                id="tripName"
                placeholder="e.g. Kyoto Cherry Blossom Adventure"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="destination">Primary Destination / Region</FieldLabel>
              <Input
                id="destination"
                placeholder="e.g. Kyoto & Osaka, Japan"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={isLoading}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={isLoading}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="endDate">End Date</FieldLabel>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={isLoading}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="budget">Estimated Budget ($ USD)</FieldLabel>
                <Input
                  id="budget"
                  type="number"
                  placeholder="2500"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  disabled={isLoading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="visibility">Visibility</FieldLabel>
                <Select value={visibility} onValueChange={setVisibility}>
                  <SelectTrigger id="visibility">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private (Only you & invited members)</SelectItem>
                    <SelectItem value="shared">Shared Link (Anyone with token)</SelectItem>
                    <SelectItem value="public">Public (Featured in Explore)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={isLoading} className="w-full gap-2">
                <SparklesIcon className="size-4" />
                {isLoading ? "Creating Itinerary..." : "Create Trip & Build Itinerary"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
