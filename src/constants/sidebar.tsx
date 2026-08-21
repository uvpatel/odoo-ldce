import * as React from "react"
import {
  LayoutDashboardIcon,
  ListIcon,
  ChartBarIcon,
  FolderIcon,
  UsersIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  ShieldIcon,
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
  }[]
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
    title: "User Management",
    url: "/dashboard/users",
    icon: <ShieldIcon className="size-4" />,
    permission: "user.role.manage",
  },
  {
    title: "Lifecycle",
    url: "/lifecycle",
    icon: <ListIcon className="size-4" />,
    permission: "employee.read.self",
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: <ChartBarIcon className="size-4" />,
    permission: "reports.read",
  },
  {
    title: "Projects",
    url: "/projects",
    icon: <FolderIcon className="size-4" />,
    permission: "employee.read.self",
  },
  {
    title: "Team",
    url: "#",
    icon: <UsersIcon className="size-4" />,
    permission: "employee.read.team",
  },
]

export const baseDocuments: SidebarDocumentItem[] = [
  {
    name: "Data Library",
    url: "#",
    icon: <DatabaseIcon className="size-4" />,
    permission: null,
  },
  {
    name: "Reports",
    url: "#",
    icon: <FileChartColumnIcon className="size-4" />,
    permission: "reports.read",
  },
  {
    name: "Word Assistant",
    url: "#",
    icon: <FileIcon className="size-4" />,
    permission: null,
  },
]

export const baseNavSecondary: NavItem[] = [
  {
    title: "Settings",
    url: "#",
    icon: <Settings2Icon className="size-4" />,
    permission: null,
  },
  {
    title: "Get Help",
    url: "#",
    icon: <CircleHelpIcon className="size-4" />,
    permission: null,
  },
  {
    title: "Search",
    url: "#",
    icon: <SearchIcon className="size-4" />,
    permission: null,
  },
]

export function getFilteredSidebarData(user?: {
  name: string
  email: string
  image?: string | null
  role?: UserRole | string
  status?: string | null
}) {
  const userRole = (user?.role as UserRole) || "employee"
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
      name: user?.name || "Guest User",
      email: user?.email || "guest@example.com",
      avatar: user?.image || "/avatars/shadcn.jpg",
      role: userRole,
    },
    navMain: filteredNavMain,
    documents: filteredDocuments,
    navSecondary: baseNavSecondary,
  }
}

export const data = getFilteredSidebarData()