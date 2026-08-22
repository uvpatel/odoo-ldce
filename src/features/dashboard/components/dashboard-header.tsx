import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Welcome back{userName ? `, ${userName}` : ""}! ✈️
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here is an overview of your upcoming travels and itinerary plans.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild className="gap-2">
          <Link href="/trips/new">
            <Plus className="size-4" />
            Plan New Trip
          </Link>
        </Button>
      </div>
    </div>
  );
}
