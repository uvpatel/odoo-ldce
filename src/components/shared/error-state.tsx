import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  retry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred while loading this section.",
  retry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
      <AlertCircle className="size-10 text-destructive" />
      <h3 className="mt-3 text-base font-semibold text-destructive">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      {retry && (
        <Button variant="outline" size="sm" onClick={retry} className="mt-4">
          Try Again
        </Button>
      )}
    </div>
  );
}
