"use client"

import * as React from "react"
import { toast } from "sonner"
import { ShieldAlertIcon, LockIcon, Trash2Icon, KeyRoundIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"

export default function AccountSettingsPage() {
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success("Account password changed successfully.")
    }, 600)
  }

  const handleDeleteAccount = () => {
    if (confirm("WARNING: This will permanently delete your account and all associated itineraries, expenses, and saved places. Proceed?")) {
      toast.error("Account deletion requested.")
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <KeyRoundIcon className="size-5 text-primary" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your login credentials to keep your travel account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="curPass">Current Password</FieldLabel>
              <Input
                id="curPass"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="newPass">New Password</FieldLabel>
              <Input
                id="newPass"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="confPass">Confirm New Password</FieldLabel>
              <Input
                id="confPass"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Field>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base text-destructive flex items-center gap-2">
            <ShieldAlertIcon className="size-4" />
            Delete Account
          </CardTitle>
          <CardDescription className="text-xs">
            Permanently remove your personal account and all travel records.
          </CardDescription>
        </CardHeader>
        <CardFooter className="pt-0">
          <Button variant="destructive" size="sm" onClick={handleDeleteAccount} className="gap-2 text-xs">
            <Trash2Icon className="size-3.5" />
            Delete My Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
