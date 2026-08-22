import * as React from "react"
import Link from "next/link"
import {
  ShieldIcon,
  UsersIcon,
  PlaneIcon,
  Building2Icon,
  SparklesIcon,
  BarChart3Icon,
  ArrowRightIcon,
  TrendingUpIcon,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 text-xs">
              <ShieldIcon className="size-3 text-primary" />
              Super Admin Console
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl mt-1">Platform Administration</h1>
          <p className="text-sm text-muted-foreground">
            Monitor system metrics, manage user roles, audit travel catalog, and analyze growth.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Registered Users</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <span>1,420</span>
              <UsersIcon className="size-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUpIcon className="size-3.5 text-emerald-600" />
            <span className="text-emerald-600 font-medium">+14%</span> this month
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Published Trips</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <span>3,890</span>
              <PlaneIcon className="size-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUpIcon className="size-3.5 text-emerald-600" />
            <span className="text-emerald-600 font-medium">+22%</span> growth
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Cities in Catalog</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <span>240</span>
              <Building2Icon className="size-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Across 45 countries
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Verified Activities</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <span>1,850</span>
              <SparklesIcon className="size-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            98.5% uptime
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Admin Management</CardTitle>
            <CardDescription className="text-xs">Direct access to core administrative modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[
              { title: "User & Role Management", desc: "Manage permissions and role levels", href: "/admin/users", icon: <UsersIcon className="size-4 text-primary" /> },
              { title: "Trip Moderation", desc: "Audit public itineraries and shared links", href: "/admin/trips", icon: <PlaneIcon className="size-4 text-primary" /> },
              { title: "City Catalog & Geo Index", desc: "Create, edit, and organize destination cities", href: "/admin/cities", icon: <Building2Icon className="size-4 text-primary" /> },
              { title: "Activity & Tour Sights", desc: "Maintain attractions and cost models", href: "/admin/activities", icon: <SparklesIcon className="size-4 text-primary" /> },
              { title: "Analytics & Platform Trends", desc: "In-depth traffic and user conversion insights", href: "/admin/analytics", icon: <BarChart3Icon className="size-4 text-primary" /> },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">{item.title}</h4>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <ArrowRightIcon className="size-3.5 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Platform Events</CardTitle>
            <CardDescription className="text-xs">Live activity log from system services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { event: "New trip published to Explore", user: "Marco Bellini", time: "5 mins ago" },
              { event: "User role upgraded to Manager", user: "Sarah Jenkins", time: "18 mins ago" },
              { event: "New destination city added: Kyoto", user: "Admin", time: "1 hour ago" },
              { event: "Database backup snapshot completed", user: "System", time: "3 hours ago" },
            ].map((log, i) => (
              <div key={i} className="flex items-start justify-between border-b pb-2.5 last:border-0 last:pb-0">
                <div>
                  <p className="text-xs font-medium text-foreground">{log.event}</p>
                  <span className="text-[11px] text-muted-foreground">Actor: {log.user}</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">{log.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
