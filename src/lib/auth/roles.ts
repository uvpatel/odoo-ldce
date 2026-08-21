export type UserRole = "employee" | "manager" | "hr" | "admin" | "super_admin";

export const USER_ROLES: readonly UserRole[] = [
  "employee",
  "manager",
  "hr",
  "admin",
  "super_admin",
] as const;

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  employee: 1,
  manager: 2,
  hr: 3,
  admin: 4,
  super_admin: 5,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  employee: "Employee",
  manager: "Manager",
  hr: "HR",
  admin: "Admin",
  super_admin: "Super Admin",
};

export function isValidRole(role: unknown): role is UserRole {
  return typeof role === "string" && USER_ROLES.includes(role as UserRole);
}

export function isRoleHigherOrEqual(currentRole: UserRole, targetRole: UserRole): boolean {
  return (ROLE_HIERARCHY[currentRole] ?? 0) >= (ROLE_HIERARCHY[targetRole] ?? 0);
}

export function hasRole(
  user: { role?: string | null } | null | undefined,
  role: UserRole
): boolean {
  if (!user || !user.role) return false;
  return user.role === role;
}

export function hasAnyRole(
  user: { role?: string | null } | null | undefined,
  roles: UserRole[]
): boolean {
  if (!user || !user.role) return false;
  return roles.includes(user.role as UserRole);
}

export function hasMinimumRole(
  user: { role?: string | null } | null | undefined,
  minimumRole: UserRole
): boolean {
  if (!user || !user.role || !isValidRole(user.role)) return false;
  return isRoleHigherOrEqual(user.role, minimumRole);
}
