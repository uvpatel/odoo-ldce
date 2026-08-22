"use client"

import * as React from "react"
import { toast } from "sonner"
import { SlidersIcon, SaveIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PreferencesSettingsPage() {
  const [currency, setCurrency] = React.useState("USD")
  const [distanceUnit, setDistanceUnit] = React.useState("km")
  const [dateFormat, setDateFormat] = React.useState("YYYY-MM-DD")
  const [language, setLanguage] = React.useState("en")

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Preferences updated successfully!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Travel Preferences</CardTitle>
        <CardDescription>
          Configure your default units, currency, date formatting, and regional parameters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4 max-w-xl">
          <Field>
            <FieldLabel htmlFor="currency">Default Currency</FieldLabel>
            <Select value={currency} onValueChange={(val) => setCurrency(val ?? "")}>
              <SelectTrigger id="currency">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                <SelectItem value="JPY">JPY (¥) - Japanese Yen</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="distance">Distance Measurement</FieldLabel>
            <Select value={distanceUnit} onValueChange={(val) => setDistanceUnit(val ?? "")}>
              <SelectTrigger id="distance">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="km">Kilometers (km)</SelectItem>
                <SelectItem value="mi">Miles (mi)</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="dateFormat">Date Format</FieldLabel>
            <Select value={dateFormat} onValueChange={(val) => setDateFormat(val ?? "")}>
              <SelectTrigger id="dateFormat">
                <SelectValue placeholder="Date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2026-04-10)</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (04/10/2026)</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (10/04/2026)</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Button type="submit" className="gap-2">
            <SaveIcon className="size-4" />
            Save Preferences
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
