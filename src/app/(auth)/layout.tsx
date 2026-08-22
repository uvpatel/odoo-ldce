import * as React from "react"
import Link from "next/link"
import { CompassIcon } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <div className="flex items-center justify-between p-6 md:px-10">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <CompassIcon className="size-5" />
          </div>
          <span className="text-xl">GlobeTrotter</span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center p-4 md:p-8">
        {children}
      </div>
    </div>
  )
}
