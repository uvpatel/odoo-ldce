"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { tripKeys } from "@/lib/query-keys";
import { tripsApi, type TripDetails } from "@/features/trips/api/trips.api";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  planned: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  ongoing: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  completed: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  cancelled: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300",
};

export default function TripDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const tripId = params.tripId as string;

  const { data, isLoading } = useQuery<TripDetails>({
    queryKey: tripKeys.detail(tripId),
    queryFn: () => tripsApi.detail(tripId),
    enabled: !!tripId,
  });

  const trip = data?.trip;

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
  ];

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="border-b bg-card px-4 pt-4 pb-0 md:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm" asChild className="text-muted-foreground">
              <Link href="/trips">
                <ArrowLeftIcon className="size-4" />
              </Link>
            </Button>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {isLoading ? (
                  <Skeleton className="h-7 w-48" />
                ) : (
                  <h1 className="text-xl font-bold tracking-tight md:text-2xl">
                    {trip?.name ?? "Trip"}
                  </h1>
                )}
                {isLoading ? (
                  <Skeleton className="h-5 w-20 rounded-full" />
                ) : trip?.status ? (
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${
                      STATUS_COLORS[trip.status] ?? STATUS_COLORS.draft
                    }`}
                  >
                    {trip.status}
                  </span>
                ) : null}
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <MapPinIcon className="size-3.5 text-primary" />
                {isLoading ? (
                  <Skeleton className="h-3 w-32 inline-block" />
                ) : (
                  trip?.startDate
                    ? `${new Date(trip.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}${
                        trip.endDate
                          ? ` – ${new Date(trip.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}`
                          : ""
                      }`
                    : "Collaborative Planning Hub"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline"  className="gap-1.5 text-xs">
              <Link href={`/trips/${tripId}/share`}>
                <Share2Icon className="size-3.5" />
                Share
              </Link>
            </Button>
          </div>
        </div>

        {/* Tabbed Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t pt-1">
          {navTabs.map((tab) => {
            const isActive = tab.exact
              ? pathname === tab.href
              : pathname.startsWith(tab.href);
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
            );
          })}
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 lg:p-8">{children}</div>
    </div>
  );
}
