import * as React from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface LoadingStateProps {
  text?: string;
  variant?: "spinner" | "skeleton";
}

export function LoadingState({
  text = "Loading content...",
  variant = "spinner",
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center p-8">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="mt-3 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
