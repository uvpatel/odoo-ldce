"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserIcon, SlidersIcon, LockIcon, ShieldAlertIcon } from "lucide-react"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const tabs = [
    { label: "Profile", href: "/settings/profile", icon: <UserIcon className="size-4" /> },
    { label: "Preferences", href: "/settings/preferences", icon: <SlidersIcon className="size-4" /> },
    { label: "Privacy", href: "/settings/privacy", icon: <LockIcon className="size-4" /> },
    { label: "Account", href: "/settings/account", icon: <ShieldAlertIcon className="size-4" /> },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Account Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal profile, travel preferences, security, and connected accounts.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-56 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href || (tab.href === "/settings/profile" && pathname === "/settings")
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
