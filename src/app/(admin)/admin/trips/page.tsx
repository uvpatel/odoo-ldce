"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PlaneIcon, ShieldIcon, EyeIcon, SearchIcon, CalendarIcon, WalletCardsIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { adminKeys } from "@/lib/query-keys";

interface AdminTrip {
  id: string;
  name: string;
  status: string;
  visibility: string;
  startDate: string | null;
  endDate: string | null;
  currency: string;
  budgetLimit: string | null;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminTripsPage() {
  const { data, isLoading } = useQuery<{
    items: AdminTrip[];
    total: number;
  }>({
    queryKey: adminKeys.trips(),
    queryFn: () => apiClient.get("/api/admin/trips", { limit: 50 }),
  });

  const trips = data?.items ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-2">
            <PlaneIcon className="size-7 text-primary" />
            Trip Moderation & Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Audit all public and private traveler itineraries created across the GlobeTrotter database.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-base">All Platform Trips ({data?.total ?? 0})</CardTitle>
          <CardDescription className="text-xs">Database records of traveler itineraries</CardDescription>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : trips.length === 0 ? (
            <p className="text-sm text-muted-foreground p-8 text-center">No trips created yet.</p>
          ) : (
            trips.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{t.name}</span>
                    <Badge variant={t.visibility === "public" ? "default" : "secondary"} className="text-[10px] py-0">
                      {t.visibility}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] py-0 capitalize">
                      {t.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Owner: {t.owner?.name} ({t.owner?.email})
                    {t.budgetLimit ? ` · Budget: ${t.currency} ${Number(t.budgetLimit).toLocaleString()}` : ""}
                    {t.startDate ? ` · ${new Date(t.startDate).toLocaleDateString()}` : ""}
                  </p>
                </div>

                <Button asChild size="sm" variant="outline" className="text-xs gap-1">
                  <Link href={`/trips/${t.id}`}>
                    <EyeIcon className="size-3.5" />
                    Inspect
                  </Link>
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
