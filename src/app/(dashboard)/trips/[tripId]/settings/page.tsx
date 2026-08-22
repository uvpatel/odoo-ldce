"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Settings2Icon, Trash2Icon, SaveIcon, AlertTriangleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TripSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const tripId = params.tripId as string

  const [tripName, setTripName] = React.useState("Tokyo Spring Sakura Tour")
  const [currency, setCurrency] = React.useState("USD")
  const [visibility, setVisibility] = React.useState("private")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Trip settings updated successfully.")
    }, 500)
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to permanently delete this trip and all its itinerary items?")) {
      toast.success("Trip deleted.")
      router.push("/trips")
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Settings2Icon className="size-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Trip Settings</CardTitle>
              <CardDescription>
                Manage general details, default currency, and privacy configuration.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="tripName">Trip Title</FieldLabel>
              <Input
                id="tripName"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                required
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="currency">Budget Currency</FieldLabel>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($ - US Dollar)</SelectItem>
                    <SelectItem value="EUR">EUR (€ - Euro)</SelectItem>
                    <SelectItem value="GBP">GBP (£ - British Pound)</SelectItem>
                    <SelectItem value="JPY">JPY (¥ - Japanese Yen)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="visibility">Default Visibility</FieldLabel>
                <Select value={visibility} onValueChange={setVisibility}>
                  <SelectTrigger id="visibility">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="shared">Shared via Link</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Button type="submit" disabled={isLoading} className="gap-2">
              <SaveIcon className="size-4" />
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base text-destructive flex items-center gap-2">
            <AlertTriangleIcon className="size-4" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-xs">
            Irreversible actions for this trip.
          </CardDescription>
        </CardHeader>
        <CardFooter className="pt-0">
          <Button variant="destructive" size="sm" onClick={handleDelete} className="gap-2 text-xs">
            <Trash2Icon className="size-3.5" />
            Delete Trip Permanently
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
