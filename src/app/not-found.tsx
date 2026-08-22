import Link from "next/link"
import { HomeIcon, MapPinOffIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <MapPinOffIcon className="size-10" />
      </div>
      <div className="max-w-md space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">404 - Off the Map</h1>
        <p className="text-sm text-muted-foreground">
          Looks like this destination hasn&apos;t been discovered yet or the itinerary has moved.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button render={<Link href="/dashboard" />} className="gap-2">
          <HomeIcon className="size-4" />
          Back to Dashboard
        </Button>
        <Button variant="outline" render={<Link href="/explore" />}>
          Explore Destinations
        </Button>
      </div>
    </div>
  )
}
