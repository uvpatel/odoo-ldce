"use client"

import * as React from "react"
import { toast } from "sonner"
import { UserIcon, CameraIcon, SaveIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfileSettingsPage() {
  const [name, setName] = React.useState("Traveler Explorer")
  const [email, setEmail] = React.useState("traveler@globetrotter.io")
  const [bio, setBio] = React.useState("Passionate wanderer, photographer, and world traveler.")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Profile details saved successfully!")
    }, 500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Profile Details</CardTitle>
        <CardDescription>
          Update your public profile photo, name, and travel bio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src="/avatars/traveler.jpg" />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">TE</AvatarFallback>
            </Avatar>
            <div>
              <Button type="button" variant="outline" size="sm" className="gap-1.5 text-xs">
                <CameraIcon className="size-3.5" />
                Change Avatar
              </Button>
              <p className="text-[11px] text-muted-foreground mt-1">JPG, PNG or GIF up to 2MB</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
              <Input
                id="fullName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="bio">Traveler Bio</FieldLabel>
            <Input
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <FieldDescription>Brief description shown on your public itineraries.</FieldDescription>
          </Field>

          <Button type="submit" disabled={isLoading} className="gap-2">
            <SaveIcon className="size-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
