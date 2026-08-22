"use client"

import * as React from "react"
import { toast } from "sonner"
import { LockIcon, EyeIcon, ShieldCheckIcon, SaveIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

export default function PrivacySettingsPage() {
  const [shareTripsPublicly, setShareTripsPublicly] = React.useState(false)
  const [showProfileInExplore, setShowProfileInExplore] = React.useState(true)
  const [emailNotifications, setEmailNotifications] = React.useState(true)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Privacy settings saved.")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Privacy & Visibility</CardTitle>
        <CardDescription>
          Control who can see your itineraries, public profile, and activity feed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6 max-w-xl">
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Checkbox
                id="profileExplore"
                checked={showProfileInExplore}
                onCheckedChange={(checked) => setShowProfileInExplore(Boolean(checked))}
              />
              <div className="space-y-1 leading-none">
                <label htmlFor="profileExplore" className="text-sm font-semibold cursor-pointer">
                  Show profile on Community Explore
                </label>
                <p className="text-xs text-muted-foreground">
                  Allow other travelers to see your published itineraries and follower stats.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Checkbox
                id="publicDefault"
                checked={shareTripsPublicly}
                onCheckedChange={(checked) => setShareTripsPublicly(Boolean(checked))}
              />
              <div className="space-y-1 leading-none">
                <label htmlFor="publicDefault" className="text-sm font-semibold cursor-pointer">
                  Default new trips to public visibility
                </label>
                <p className="text-xs text-muted-foreground">
                  When creating new trips, automatically make them readable by anyone with the link.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Checkbox
                id="notifications"
                checked={emailNotifications}
                onCheckedChange={(checked) => setEmailNotifications(Boolean(checked))}
              />
              <div className="space-y-1 leading-none">
                <label htmlFor="notifications" className="text-sm font-semibold cursor-pointer">
                  Email notifications for trip invitations
                </label>
                <p className="text-xs text-muted-foreground">
                  Receive an email when someone invites you to collaborate on a trip.
                </p>
              </div>
            </div>
          </div>

          <Button type="submit" className="gap-2">
            <SaveIcon className="size-4" />
            Save Privacy Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
