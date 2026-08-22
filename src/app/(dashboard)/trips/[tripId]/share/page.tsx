"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { Share2Icon, CopyIcon, GlobeIcon, LockIcon, CheckIcon, QrCodeIcon, ExternalLinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function TripSharePage() {
  const params = useParams()
  const tripId = params.tripId as string
  const [copied, setCopied] = React.useState(false)
  const shareToken = `token-${tripId}`
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/shared/${shareToken}` : `https://globetrotter.io/shared/${shareToken}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success("Share link copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Share2Icon className="size-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Share Trip Itinerary</CardTitle>
              <CardDescription>
                Share a live read-only link with friends, family, or publish to the Explore community.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Public Read-Only Link</label>
            <div className="flex items-center gap-2">
              <Input value={shareUrl} readOnly className="font-mono text-xs" />
              <Button onClick={handleCopy} className="gap-1.5 shrink-0 text-xs">
                {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Anyone with this secret link can view your itinerary, map pins, and schedule without needing an account.
            </p>
          </div>

          <div className="rounded-xl border p-4 bg-muted/20 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <GlobeIcon className="size-4 text-primary" />
                <span className="text-sm font-semibold">Publish to GlobeTrotter Explore</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Make your itinerary searchable by the community so others can discover and clone it.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.success("Trip published to Explore!")}>
              Publish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
