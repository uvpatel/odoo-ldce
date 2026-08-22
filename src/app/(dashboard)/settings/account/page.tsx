"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ShieldAlertIcon, Trash2Icon, KeyRoundIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { authClient } from "@/lib/auth-client"

export default function AccountSettingsPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [deletePassword, setDeletePassword] = React.useState("")
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handlePasswordUpdate = async (e: React.FormEvent) => {
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
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })

      if (error) {
        toast.error(error.message || "Unable to change your password.")
        return
      }

      setIsLoading(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success("Account password changed successfully.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to change your password.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Permanently delete your account, trips, expenses, and saved places? This cannot be undone.")) return

    setIsDeleting(true)
    try {
      const { error } = await authClient.deleteUser(
        deletePassword ? { password: deletePassword } : undefined
      )

      if (error) {
        toast.error(error.message || "Unable to delete your account.")
        return
      }

      toast.success("Your account has been deleted.")
      router.push("/")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete your account.")
    } finally {
      setIsDeleting(false)
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
        <CardContent className="space-y-2 pb-4">
          <Field>
            <FieldLabel htmlFor="deletePassword">Password confirmation</FieldLabel>
            <Input
              id="deletePassword"
              type="password"
              value={deletePassword}
              onChange={(event) => setDeletePassword(event.target.value)}
              placeholder="Required for password accounts"
            />
          </Field>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="destructive" size="sm" onClick={handleDeleteAccount} disabled={isDeleting} className="gap-2 text-xs">
            <Trash2Icon className="size-3.5" />
            {isDeleting ? "Deleting..." : "Delete My Account"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
