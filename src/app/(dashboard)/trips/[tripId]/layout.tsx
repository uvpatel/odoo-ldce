"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import {
  RouteIcon,
  CalendarIcon,
  WalletCardsIcon,
  UsersIcon,
  Share2Icon,
  Settings2Icon,
  LayoutDashboardIcon,
  ArrowLeftIcon,
  MapPinIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function TripDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const params = useParams()
  const tripId = (params.tripId as string) || "trip-sample"

  const navTabs = [
    {
      label: "Overview",
      href: `/trips/${tripId}`,
      icon: <LayoutDashboardIcon className="size-4" />,
      exact: true,
    },
    {
      label: "Itinerary",
      href: `/trips/${tripId}/itinerary`,
      icon: <RouteIcon className="size-4" />,
    },
    {
      label: "Calendar",
      href: `/trips/${tripId}/calendar`,
      icon: <CalendarIcon className="size-4" />,
    },
    {
      label: "Budget",
      href: `/trips/${tripId}/budget`,
      icon: <WalletCardsIcon className="size-4" />,
    },
    {
      label: "Members",
      href: `/trips/${tripId}/members`,
      icon: <UsersIcon className="size-4" />,
    },
    {
      label: "Share",
      href: `/trips/${tripId}/share`,
      icon: <Share2Icon className="size-4" />,
    },
    {
      label: "Settings",
      href: `/trips/${tripId}/settings`,
      icon: <Settings2Icon className="size-4" />,
    },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b bg-card px-4 pt-4 pb-0 md:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm" render={<Link href="/trips" />} className="text-muted-foreground">
              <ArrowLeftIcon className="size-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight md:text-2xl">
                  {tripId.replace(/-/g, " ").toUpperCase()}
                </h1>
                <Badge variant="secondary" className="capitalize text-xs">
                  Active Trip
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <MapPinIcon className="size-3.5 text-primary" />
                Collaborative Planning Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" render={<Link href={`/trips/${tripId}/share`} />} className="gap-1.5 text-xs">
              <Share2Icon className="size-3.5" />
              Share
            </Button>
          </div>
        </div>

        {/* Tabbed Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t pt-1">
          {navTabs.map((tab) => {
            const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 lg:p-8">{children}</div>
    </div>
  )
}
