import * as React from "react"
import {
  LayoutDashboardIcon,
  PlaneIcon,
  CompassIcon,
  BookmarkIcon,
  UsersIcon,
  ShieldIcon,
  RouteIcon,
  WalletCardsIcon,
  Building2Icon,
  SparklesIcon,
  Settings2Icon,
  GlobeIcon,
  CircleHelpIcon,
  SearchIcon,
  PlusCircleIcon,
  MapPinIcon,
} from "lucide-react"
import { can, type Permission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/auth/roles"

export type NavSubItem = {
  title: string
  url: string
  icon?: React.ReactNode
}

export type NavItem = {
  title: string
  url: string
  icon: React.ReactNode
  permission?: Permission | null
  roles?: UserRole[]
  isActive?: boolean
  items?: NavSubItem[]
}

export type SidebarDocumentItem = {
  name: string
  url: string
  icon: React.ReactNode
  permission?: Permission | null
}

export const baseNavMain: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboardIcon className="size-4" />,
    permission: null,
  },
  {
    title: "My Trips",
    url: "/trips",
    icon: <PlaneIcon className="size-4" />,
    permission: null,
    items: [
      {
        title: "All Trips",
        url: "/trips",
      },
      {
        title: "Plan New Trip",
        url: "/trips/new",
      },
    ],
  },
  {
    title: "Discover",
    url: "/discover",
    icon: <CompassIcon className="size-4" />,
    permission: null,
    items: [
      {
        title: "Explore",
        url: "/discover",
      },
      {
        title: "Cities",
        url: "/discover/cities",
      },
      {
        title: "Activities",
        url: "/discover/activities",
      },
    ],
  },
  {
    title: "Saved",
    url: "/saved",
    icon: <BookmarkIcon className="size-4" />,
    permission: null,
  },
  {
    title: "Admin",
    url: "/admin",
    icon: <ShieldIcon className="size-4" />,
    permission: "reports.read",
    items: [
      {
        title: "Overview",
        url: "/admin",
      },
      {
        title: "Analytics",
        url: "/admin/analytics",
      },
      {
        title: "Users",
        url: "/admin/users",
      },
      {
        title: "Trips",
        url: "/admin/trips",
      },
      {
        title: "Cities",
        url: "/admin/cities",
      },
      {
        title: "Activities",
        url: "/admin/activities",
      },
    ],
  },
]

export const baseDocuments: SidebarDocumentItem[] = [
  {
    name: "Plan New Trip",
    url: "/trips/new",
    icon: <PlusCircleIcon className="size-4" />,
    permission: null,
  },
  {
    name: "Explore Cities",
    url: "/discover/cities",
    icon: <Building2Icon className="size-4" />,
    permission: null,
  },
  {
    name: "Find Activities",
    url: "/discover/activities",
    icon: <SparklesIcon className="size-4" />,
    permission: null,
  },
]

export const baseNavSecondary: NavItem[] = [
  {
    title: "Settings",
    url: "/settings/profile",
    icon: <Settings2Icon className="size-4" />,
    permission: null,
    items: [
      {
        title: "Profile",
        url: "/settings/profile",
      },
      {
        title: "Preferences",
        url: "/settings/preferences",
      },
      {
        title: "Privacy",
        url: "/settings/privacy",
      },
      {
        title: "Account",
        url: "/settings/account",
      },
    ],
  },
  {
    title: "Search Catalog",
    url: "/discover",
    icon: <SearchIcon className="size-4" />,
    permission: null,
  },
  {
    title: "Get Help",
    url: "/dashboard",
    icon: <CircleHelpIcon className="size-4" />,
    permission: null,
  },
]

export function getFilteredSidebarData(user?: {
  name?: string | null
  email?: string | null
  image?: string | null
  avatar?: string | null
  role?: UserRole | string
  status?: string | null
}) {
  const userRole = (user?.role as UserRole) || "user"
  const userStatus = user?.status || "active"
  const authUser = { role: userRole, status: userStatus }

  const filteredNavMain = baseNavMain.filter((item) => {
    if (!item.permission) return true
    return can(authUser, item.permission)
  })

  const filteredDocuments = baseDocuments.filter((item) => {
    if (!item.permission) return true
    return can(authUser, item.permission)
  })

  return {
    user: {
      name: user?.name || "Traveler",
      email: user?.email || "traveler@globetrotter.io",
      avatar: user?.image || user?.avatar || "/avatars/traveler.jpg",
      role: userRole,
    },
    navMain: filteredNavMain,
    documents: filteredDocuments,
    navSecondary: baseNavSecondary,
  }
}

export const data = getFilteredSidebarData()