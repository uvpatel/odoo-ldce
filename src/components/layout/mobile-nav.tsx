"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 border-t bg-background/95 backdrop-blur md:hidden">
      <div className="flex w-full items-center justify-around">
        {dashboardNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
