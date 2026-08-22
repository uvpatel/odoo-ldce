"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppBreadcrumb } from "./app-breadcrumb";
import { ModeToggle } from "@/components/modetoggle";

export function AppHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear lg:px-6">
      <div className="flex items-center gap-2 lg:gap-3">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-1 h-4 data-vertical:self-auto" />
        <AppBreadcrumb />
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
      </div>
    </header>
  );
}
