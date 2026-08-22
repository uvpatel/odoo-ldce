import * as React from "react"
import Link from "next/link"
import { UsersIcon, ShieldIcon, SearchIcon, ArrowRightIcon, MoreVerticalIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const USERS_LIST = [
  { id: "usr-1", name: "Urvil Patel", email: "urvil@example.com", role: "super_admin", tripsCount: 12, status: "active" },
  { id: "usr-2", name: "Elena Rostova", email: "elena@example.com", role: "admin", tripsCount: 8, status: "active" },
  { id: "usr-3", name: "Marco Bellini", email: "marco@example.com", role: "manager", tripsCount: 5, status: "active" },
  { id: "usr-4", name: "Sarah Jenkins", email: "sarah@example.com", role: "employee", tripsCount: 3, status: "active" },
  { id: "usr-5", name: "Devon Chen", email: "devon@example.com", role: "employee", tripsCount: 2, status: "inactive" },
]

export default function AdminUsersPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">User & Role Directory</h1>
          <p className="text-sm text-muted-foreground">
            Manage global system users, assign role privileges, and inspect individual account profiles.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-base">Registered Accounts</CardTitle>
          <CardDescription className="text-xs">All accounts in the GlobeTrotter database</CardDescription>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          {USERS_LIST.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                  {u.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{u.name}</span>
                    <Badge variant={u.role.includes("admin") ? "default" : "secondary"} className="text-[10px] uppercase font-mono py-0">
                      {u.role.replace("_", " ")}
                    </Badge>
                    <Badge variant={u.status === "active" ? "outline" : "destructive"} className="text-[10px] py-0">
                      {u.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{u.email} • {u.tripsCount} trips created</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" render={<Link href={`/admin/users/${u.id}`} />} className="text-xs gap-1">
                  <span>Details</span>
                  <ArrowRightIcon className="size-3" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
