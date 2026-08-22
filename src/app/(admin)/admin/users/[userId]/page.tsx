import * as React from "react"
import Link from "next/link"
import { ArrowLeftIcon, UserIcon, ShieldIcon, MailIcon, CalendarIcon, PlaneIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" render={<Link href="/admin/users" />} className="gap-1.5 text-muted-foreground text-xs">
          <ArrowLeftIcon className="size-4" />
          Back to User Directory
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-base">
                UP
              </div>
              <div>
                <CardTitle className="text-xl">User Profile: {userId}</CardTitle>
                <CardDescription>Account metrics and RBAC configuration</CardDescription>
              </div>
            </div>
            <Badge className="text-xs">Active Account</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-3.5 space-y-1">
              <span className="text-xs text-muted-foreground">Assigned Role</span>
              <p className="font-semibold text-sm">Super Admin</p>
            </div>
            <div className="rounded-lg border p-3.5 space-y-1">
              <span className="text-xs text-muted-foreground">Account Created</span>
              <p className="font-semibold text-sm">Jan 15, 2026</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Trips Managed by User</h4>
            <div className="rounded-lg border divide-y">
              <div className="p-3 text-xs flex items-center justify-between">
                <span className="font-medium">Tokyo Spring Sakura Tour</span>
                <Badge variant="outline" className="text-[10px]">10 Days • Planning</Badge>
              </div>
              <div className="p-3 text-xs flex items-center justify-between">
                <span className="font-medium">Paris & French Riviera</span>
                <Badge variant="outline" className="text-[10px]">7 Days • Upcoming</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
