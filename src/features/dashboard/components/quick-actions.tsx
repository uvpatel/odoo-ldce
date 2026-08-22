import * as React from "react";
import Link from "next/link";
import { PlusCircle, Compass, Bookmark, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  const actions = [
    { title: "New Trip", href: "/trips/new", icon: PlusCircle, variant: "default" as const },
    { title: "Explore Cities", href: "/discover/cities", icon: Compass, variant: "outline" as const },
    { title: "Saved Places", href: "/saved", icon: Bookmark, variant: "outline" as const },
    { title: "Preferences", href: "/settings/preferences", icon: Settings, variant: "outline" as const },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                asChild
                variant={action.variant}
                className="flex h-20 flex-col items-center justify-center gap-2"
              >
                <Link href={action.href}>
                  <Icon className="size-5" />
                  <span className="text-xs font-medium">{action.title}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
