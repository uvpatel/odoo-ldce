"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  EllipsisVerticalIcon,
  CircleUserRoundIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
  ShieldIcon,
} from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { ROLE_LABELS, type UserRole } from "@/lib/auth/roles"
import Link from "next/link"

function getInitials(name: string): string {
  if (!name) return "U"
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export type NavUserProps = {
  user: {
    name: string
    email: string
    image?: string | null
    avatar?: string | null
    role?: UserRole | string
  }
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const imageSrc = user.image || user.avatar || undefined
  const initials = getInitials(user.name)
  const roleName = user.role ? (ROLE_LABELS[user.role as UserRole] || user.role) : "Employee"

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await authClient.signOut()
      toast.success("Signed out successfully.")
      router.push("/signin")
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
      router.push("/signin")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar className="size-8 rounded-lg">
              {imageSrc && <AvatarImage src={imageSrc} alt={user.name} />}
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium flex items-center gap-1.5">
                {user.name}
              </span>
              <span className="truncate text-xs text-foreground/70">
                {user.email}
              </span>
            </div>
            <EllipsisVerticalIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-64"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                  <Avatar className="size-9">
                    {imageSrc && <AvatarImage src={imageSrc} alt={user.name} />}
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate font-semibold">{user.name}</span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 uppercase font-medium">
                        {roleName}
                      </Badge>
                    </div>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2"
                onClick={() => router.push("/dashboard")}
              >
                <CircleUserRoundIcon className="size-4" />
                <span><Link href="/dashboard/profile">Profile</Link></span>
              </DropdownMenuItem>
              {(user.role === "admin" || user.role === "super_admin") && (
                <DropdownMenuItem
                  className="cursor-pointer flex items-center gap-2"
                  onClick={() => router.push("/dashboard/users")}
                >
                  <ShieldIcon className="size-4" />
                  <span><Link href="/dashboard/users">User Management</Link> </span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2"
                onClick={() => router.push("/dashboard")}
              >
                <CreditCardIcon className="size-4" />
                <span><Link href="/dashboard/billing">Billing</Link></span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2"
                onClick={() => router.push("/dashboard")}
              >
                <BellIcon className="size-4" />
                <span><Link href="/dashboard/notifications">Notifications</Link></span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
            >
              <LogOutIcon className="size-4" />
              <span>{isLoggingOut ? "Signing out..." : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
