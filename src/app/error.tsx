"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangleIcon, RotateCcwIcon, HomeIcon } from "lucide-react"
import Link from "next/link"

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-background p-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangleIcon className="size-8" />
      </div>
      <div className="max-w-md space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred while processing your request."}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => reset()} variant="outline" className="gap-2">
          <RotateCcwIcon className="size-4" />
          Try Again
        </Button>
        <Button render={<Link href="/dashboard" />} className="gap-2">
          <HomeIcon className="size-4" />
          Return to Dashboard
        </Button>
      </div>
    </div>
  )
}
