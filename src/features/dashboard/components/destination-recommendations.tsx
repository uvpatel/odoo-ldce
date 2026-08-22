import * as React from "react";
import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface DestinationCity {
  id: string;
  name: string;
  countryName: string;
  coverImage?: string | null;
  description?: string | null;
}

export function DestinationRecommendations({ cities = [] }: { cities?: DestinationCity[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Explore Destinations</CardTitle>
          <CardDescription>Popular spots for your next adventure</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/discover" className="gap-1">
            Discover <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cities.map((city) => (
            <Link
              key={city.id}
              href={`/discover/cities/${city.id}`}
              className="group relative overflow-hidden rounded-lg border p-3 hover:border-primary transition-all"
            >
              <div className="flex items-center gap-2">
                <Compass className="size-4 text-primary group-hover:rotate-45 transition-transform" />
                <div>
                  <h5 className="text-sm font-semibold">{city.name}</h5>
                  <p className="text-xs text-muted-foreground">{city.countryName}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
