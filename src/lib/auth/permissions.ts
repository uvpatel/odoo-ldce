import type { UserRole } from "./roles";

export type Permission =
  | "*"
  | "employee.read.self"
  | "employee.read.team"
  | "employee.read.all"
  | "employee.create"
  | "employee.update"
  | "employee.delete"
  | "attendance.read.self"
  | "attendance.read.team"
  | "attendance.read.all"
  | "attendance.manage"
  | "leave.create"
  | "leave.read.self"
  | "leave.read.team"
  | "leave.read.all"
  | "leave.approve"
  | "leave.reject"
  | "department.read"
  | "department.manage"
  | "payroll.read.self"
  | "payroll.read.all"
  | "payroll.manage"
  | "reports.read"
  | "reports.manage"
  | "user.role.manage"
  | "user.status.manage"
  | "system.settings.manage"
  | "audit.read"
  | "session.manage";

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  employee: [
    "employee.read.self",
    "attendance.read.self",
    "leave.create",
    "leave.read.self",
    "payroll.read.self",
  ],
  manager: [
    "employee.read.self",
    "employee.read.team",
    "attendance.read.self",
    "attendance.read.team",
    "leave.create",
    "leave.read.self",
    "leave.read.team",
    "leave.approve",
    "leave.reject",
    "payroll.read.self",
    "reports.read",
  ],
  hr: [
    "employee.read.self",
    "employee.read.team",
    "employee.read.all",
    "employee.create",
    "employee.update",
    "attendance.read.self",
    "attendance.read.team",
    "attendance.read.all",
    "attendance.manage",
    "leave.create",
    "leave.read.self",
    "leave.read.team",
    "leave.read.all",
    "leave.approve",
    "leave.reject",
    "department.read",
    "department.manage",
    "payroll.read.self",
    "payroll.read.all",
    "payroll.manage",
    "reports.read",
    "reports.manage",
  ],
  admin: [
    "employee.read.self",
    "employee.read.team",
    "employee.read.all",
    "employee.create",
    "employee.update",
    "employee.delete",
    "attendance.read.self",
    "attendance.read.team",
    "attendance.read.all",
    "attendance.manage",
    "leave.create",
    "leave.read.self",
    "leave.read.team",
    "leave.read.all",
    "leave.approve",
    "leave.reject",
    "department.read",
    "department.manage",
    "payroll.read.self",
    "payroll.read.all",
    "payroll.manage",
    "reports.read",
    "reports.manage",
    "user.role.manage",
    "user.status.manage",
    "system.settings.manage",
    "audit.read",
    "session.manage",
  ],
  super_admin: ["*"],
};

/**
 * Checks if a user has a specific permission.
 */
export function can(
  user: { role?: string | null; status?: string | null } | null | undefined,
  permission: Permission
): boolean {
  if (!user || !user.role) return false;
  if (user.status && user.status !== "active") return false;

  const role = user.role as UserRole;
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;

  if (permissions.includes("*")) return true;
  return permissions.includes(permission);
}

/**
 * Alias for can().
 */
export function hasPermission(
  user: { role?: string | null; status?: string | null } | null | undefined,
  permission: Permission
): boolean {
  return can(user, permission);
}
