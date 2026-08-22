import * as React from "react"

import {
  LayoutDashboardIcon,
  MapIcon,
  PlusCircleIcon,
  CompassIcon,
  MapPinIcon,
  SparklesIcon,
  HeartIcon,
  UsersIcon,
  ChartNoAxesCombinedIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  ShieldIcon,
  PlaneTakeoffIcon,
  Globe2Icon,
} from "lucide-react"

import { can, type Permission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/auth/roles"

export type NavItem = {
  title: string
  url: string
  icon: React.ReactNode
  permission?: Permission | null
  roles?: UserRole[]
  isActive?: boolean

  items?: {
    title: string
    url: string
    permission?: Permission | null
  }[]
}

export type SidebarDocumentItem = {
  name: string
  url: string
  icon: React.ReactNode
  permission?: Permission | null
}

/**
 * -------------------------------------------------------
 * MAIN NAVIGATION
 * -------------------------------------------------------
 */

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
    icon: <PlaneTakeoffIcon className="size-4" />,
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
    icon: <HeartIcon className="size-4" />,
    permission: null,
  },
]

/**
 * -------------------------------------------------------
 * QUICK ACCESS
 * -------------------------------------------------------
 *
 * These can be rendered using the same sidebar section
 * that was previously called "Documents".
 */

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
    icon: <MapPinIcon className="size-4" />,
    permission: null,
  },

  {
    name: "Find Activities",
    url: "/discover/activities",
    icon: <SparklesIcon className="size-4" />,
    permission: null,
  },
]

/**
 * -------------------------------------------------------
 * ADMIN NAVIGATION
 * -------------------------------------------------------
 *
 * Only users with the corresponding permissions should
 * receive these items.
 */

export const baseAdminNav: NavItem[] = [
  {
    title: "Admin",
    url: "/admin",
    icon: <ShieldIcon className="size-4" />,
    // permission: "admin.access",
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

/**
 * -------------------------------------------------------
 * SECONDARY NAVIGATION
 * -------------------------------------------------------
 */

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
    title: "Search",
    url: "/search",
    icon: <SearchIcon className="size-4" />,
    permission: null,
  },

  {
    title: "Get Help",
    url: "/get-help",
    icon: <CircleHelpIcon className="size-4" />,
    permission: null,
  },
]

/**
 * -------------------------------------------------------
 * SIDEBAR FILTERING
 * -------------------------------------------------------
 */

export function getFilteredSidebarData(user?: {
  name: string
  email: string
  image?: string | null
  role?: UserRole | string
  status?: string | null
}) {
  const userRole = (user?.role as UserRole) || "user"
  const userStatus = user?.status || "active"

  const authUser = {
    role: userRole,
    status: userStatus,
  }

  /**
   * Filter normal navigation.
   */
  const filteredNavMain = baseNavMain.filter((item) => {
    if (item.roles && !item.roles.includes(userRole)) {
      return false
    }

    if (!item.permission) {
      return true
    }

    return can(authUser, item.permission)
  })

  /**
   * Filter quick actions.
   */
  const filteredDocuments = baseDocuments.filter((item) => {
    if (!item.permission) {
      return true
    }

    return can(authUser, item.permission)
  })

  /**
   * Filter admin navigation.
   */
  const filteredAdminNav = baseAdminNav.filter((item) => {
    if (item.roles && !item.roles.includes(userRole)) {
      return false
    }

    if (!item.permission) {
      return true
    }

    return can(authUser, item.permission)
  })

  /**
   * Filter secondary navigation.
   */
  const filteredNavSecondary = baseNavSecondary.filter((item) => {
    if (item.roles && !item.roles.includes(userRole)) {
      return false
    }

    if (!item.permission) {
      return true
    }

    return can(authUser, item.permission)
  })

  return {
    user: {
      name: user?.name || "Guest User",
      email: user?.email || "guest@example.com",
      avatar: user?.image || "/avatars/default-user.png",
      role: userRole,
    },

    navMain: filteredNavMain,

    documents: filteredDocuments,

    adminNav: filteredAdminNav,

    navSecondary: filteredNavSecondary,
  }
}

export const data = getFilteredSidebarData()