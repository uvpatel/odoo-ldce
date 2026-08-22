import * as React from "react"
import Link from "next/link"
import { CompassIcon, ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/modetoggle"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <CompassIcon className="size-5" />
            </div>
            <span className="text-lg">GlobeTrotter</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-medium text-muted-foreground md:flex">
            <Link href="/#features" className="transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="/explore" className="transition-colors hover:text-foreground">
              Explore Destinations
            </Link>
            <Link href="/dashboard" className="transition-colors hover:text-foreground">
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <Button variant="ghost" render={<Link href="/sign-in" />} className="text-sm">
            Sign In
          </Button>
          <Button render={<Link href="/sign-up" />} className="gap-1 text-sm">
            <span>Get Started</span>
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-muted/40 py-8 px-4 lg:px-8 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <CompassIcon className="size-4 text-primary" />
            <span className="font-semibold text-foreground">GlobeTrotter</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/explore" className="hover:text-foreground">
              Explore
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
