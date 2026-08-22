import { Skeleton } from "@/components/ui/skeleton"
import { CompassIcon } from "lucide-react"

export default function RootLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background p-6">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary animate-pulse">
        <CompassIcon className="size-7 animate-spin" style={{ animationDuration: "3s" }} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="h-5 w-32 rounded bg-muted animate-pulse" />
        <div className="h-4 w-48 rounded bg-muted/60 animate-pulse" />
      </div>
    </div>
  )
}
