"use client"

import BackgroundRippleEffectDemo from "@/components/background-ripple-effect-demo"
import FeaturesSectionDemo from "@/components/features-section-demo-2"
import WorldMapDemo from "@/components/world-map-demo"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlaneIcon, CompassIcon, SparklesIcon, ArrowRightIcon } from "lucide-react"

export default function MarketingHomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <BackgroundRippleEffectDemo />
      <div id="features" className="w-full">
        <FeaturesSectionDemo />
      </div>
      <div className="w-full py-16 px-4">
        <div className="mx-auto max-w-5xl rounded-3xl bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12 border shadow-sm">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
              <PlaneIcon className="size-7" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Ready to Start Your Next Adventure?
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              Plan complex multi-city trips, manage budgets in real-time, and collaborate seamlessly with friends and family.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" render={<Link href="/sign-up" />} className="gap-2">
                <span>Start Planning Free</span>
                <ArrowRightIcon className="size-4" />
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/explore" />}>
                Explore Sample Itineraries
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
