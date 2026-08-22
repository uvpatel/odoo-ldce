import * as React from "react"
import Link from "next/link"
import {
  SparklesIcon,
  MapPinIcon,
  StarIcon,
  ArrowLeftIcon,
  ClockIcon,
  DollarSignIcon,
  PlusIcon,
  CheckCircle2Icon,
  UsersIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ activityId: string }>
}) {
  const { activityId } = await params
  const title = activityId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" render={<Link href="/discover/activities" />} className="gap-1.5 text-muted-foreground text-xs">
          <ArrowLeftIcon className="size-4" />
          Back to Activities
        </Button>
      </div>

      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border shadow-sm bg-muted">
        <img
          src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80"
          alt={title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary text-primary-foreground text-xs">Verified Attraction</Badge>
            <div className="flex items-center gap-1 text-xs bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">
              <StarIcon className="size-3.5 fill-yellow-400 text-yellow-400" />
              <span>4.9 (840 reviews)</span>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold md:text-4xl">{title}</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Experience Overview</CardTitle>
              <CardDescription>
                Everything you need to know before visiting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                Experience one of the world's most sought-after attractions with breathtaking vantage points, immersive cultural storytelling, and unforgettable photo opportunities.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">Highlights</h4>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex items-center gap-2">
                    <CheckCircle2Icon className="size-3.5 text-primary shrink-0" />
                    <span>Skip-the-line express mobile voucher entry</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2Icon className="size-3.5 text-primary shrink-0" />
                    <span>English audio guide and interactive digital map included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2Icon className="size-3.5 text-primary shrink-0" />
                    <span>Best sunset & twilight viewpoints in the city</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Ticket Price</CardDescription>
              <CardTitle className="text-2xl font-bold text-emerald-600">$22.00</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="text-xs text-muted-foreground space-y-1.5 border-y py-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ClockIcon className="size-3.5" /> Duration
                  </span>
                  <span className="font-medium text-foreground">1.5 - 2 Hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <UsersIcon className="size-3.5" /> Group Size
                  </span>
                  <span className="font-medium text-foreground">Individual or Party</span>
                </div>
              </div>

              <Button render={<Link href="/trips" />} className="w-full gap-1.5 text-xs">
                <PlusIcon className="size-3.5" />
                Add to My Trip
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
