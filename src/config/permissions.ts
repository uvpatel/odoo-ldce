export const APP_PERMISSIONS = {
  // Travel Permissions
  TRIP_CREATE: "trip.create",
  TRIP_READ: "trip.read",
  TRIP_UPDATE: "trip.update",
  TRIP_DELETE: "trip.delete",
  TRIP_SHARE: "trip.share",
  
  // Member Permissions
  MEMBER_INVITE: "member.invite",
  MEMBER_MANAGE: "member.manage",
  
  // Budget Permissions
  BUDGET_VIEW: "budget.view",
  BUDGET_MANAGE: "budget.manage",
  EXPENSE_CREATE: "expense.create",
  EXPENSE_MANAGE: "expense.manage",
  
  // Admin & System Permissions
  ADMIN_ACCESS: "admin.access",
  USER_MANAGE: "user.role.manage",
  CATALOG_MANAGE: "catalog.manage",
} as const;

export type AppPermissionKey = keyof typeof APP_PERMISSIONS;
