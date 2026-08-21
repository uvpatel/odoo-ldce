"use client";

import * as React from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EllipsisVerticalIcon, UserXIcon, UserCheckIcon } from "lucide-react";
import { USER_ROLES, ROLE_LABELS, type UserRole } from "@/lib/auth/roles";
import { updateUserRoleAction, updateUserStatusAction } from "@/lib/auth/admin-actions";

type UserItem = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  status: "active" | "inactive" | "suspended";
  createdAt: Date;
};

export function UserManagementTable({
  users,
  currentUserId,
  currentUserRole,
}: {
  users: UserItem[];
  currentUserId: string;
  currentUserRole: UserRole;
}) {
  const [userList, setUserList] = React.useState<UserItem[]>(users);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      await updateUserRoleAction(userId, newRole);
      setUserList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole as UserRole } : u))
      );
      toast.success(`Role updated to ${ROLE_LABELS[newRole as UserRole] || newRole}.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update role.";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: "active" | "inactive" | "suspended") => {
    setUpdatingId(userId);
    try {
      await updateUserStatusAction(userId, newStatus);
      setUserList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
      toast.success(`Status updated to ${newStatus}.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update status.";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "super_admin":
        return "default";
      case "admin":
        return "default";
      case "hr":
        return "secondary";
      case "manager":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "suspended":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Current Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assign Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            userList.map((u) => {
              const isSelf = u.id === currentUserId;
              const isTargetSuperAdmin = u.role === "super_admin";
              const canEditRole =
                !isSelf &&
                (currentUserRole === "super_admin" || (!isTargetSuperAdmin && currentUserRole === "admin"));
              const displayName = u.name || "User";
              const initials = displayName.slice(0, 2).toUpperCase();

              return (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        {u.image && <AvatarImage src={u.image} alt={displayName} />}
                        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm flex items-center gap-1.5">
                          {displayName}
                          {isSelf && (
                            <Badge variant="outline" className="text-[10px] py-0 px-1">
                              You
                            </Badge>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground">{u.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(u.role)} className="capitalize">
                      {ROLE_LABELS[u.role] || u.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(u.status)} className="capitalize">
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {canEditRole ? (
                      <Select
                        value={u.role}
                        onValueChange={(val) => {
                          if (val) handleRoleChange(u.id, val);
                        }}
                        disabled={updatingId === u.id}
                      >
                        <SelectTrigger className="w-36 h-8 text-xs">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {USER_ROLES.map((r) => {
                            if (r === "super_admin" && currentUserRole !== "super_admin") {
                              return null;
                            }
                            return (
                              <SelectItem key={r} value={r} className="text-xs">
                                {ROLE_LABELS[r]}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {isSelf ? "Self (Locked)" : "Protected"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!isSelf && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              disabled={updatingId === u.id}
                            />
                          }
                        >
                          <EllipsisVerticalIcon className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Manage Account</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {u.status === "active" ? (
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
                              onClick={() => handleStatusChange(u.id, "suspended")}
                            >
                              <UserXIcon className="size-4" />
                              <span>Suspend User</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="cursor-pointer flex items-center gap-2"
                              onClick={() => handleStatusChange(u.id, "active")}
                            >
                              <UserCheckIcon className="size-4" />
                              <span>Activate User</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
