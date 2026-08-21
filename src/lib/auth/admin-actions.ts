"use server";

import { db } from "@/db";
import { user as userTable, session as sessionTable } from "@/db/schema/auth-schema";
import { eq } from "drizzle-orm";
import { requireUser } from "./session";
import { can } from "./permissions";
import { isValidRole, type UserRole } from "./roles";
import { revalidatePath } from "next/cache";

export async function updateUserRoleAction(targetUserId: string, newRole: string) {
  const { user: currentUser } = await requireUser();

  // Validate permission
  if (!can(currentUser, "user.role.manage")) {
    throw new Error("Unauthorized: You do not have permission to manage roles.");
  }

  // Validate target role
  if (!isValidRole(newRole)) {
    throw new Error("Invalid role provided.");
  }

  // Prevent self-role change to prevent lockout or privilege changes through this endpoint
  if (currentUser.id === targetUserId) {
    throw new Error("You cannot change your own role.");
  }

  // Only super_admin can assign super_admin
  if (newRole === "super_admin" && currentUser.role !== "super_admin") {
    throw new Error("Only super_admins can assign the super_admin role.");
  }

  // If target user is super_admin, only super_admin can change their role
  const targetUsers = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, targetUserId))
    .limit(1);

  const targetUser = targetUsers[0];

  if (!targetUser) {
    throw new Error("User not found.");
  }

  if (targetUser.role === "super_admin" && currentUser.role !== "super_admin") {
    throw new Error("Only super_admins can modify another super_admin's role.");
  }

  await db
    .update(userTable)
    .set({
      role: newRole as UserRole,
      updatedAt: new Date(),
    })
    .where(eq(userTable.id, targetUserId));

  revalidatePath("/dashboard");
  return { success: true, message: `Role updated to ${newRole}` };
}

export async function updateUserStatusAction(
  targetUserId: string,
  newStatus: "active" | "inactive" | "suspended"
) {
  const { user: currentUser } = await requireUser();

  if (!can(currentUser, "user.status.manage")) {
    throw new Error("Unauthorized: You do not have permission to manage user status.");
  }

  if (currentUser.id === targetUserId) {
    throw new Error("You cannot change your own status.");
  }

  if (!["active", "inactive", "suspended"].includes(newStatus)) {
    throw new Error("Invalid status.");
  }

  await db
    .update(userTable)
    .set({
      status: newStatus,
      updatedAt: new Date(),
    })
    .where(eq(userTable.id, targetUserId));

  // If suspended, revoke all active sessions for that user
  if (newStatus === "suspended") {
    await db.delete(sessionTable).where(eq(sessionTable.userId, targetUserId));
  }

  revalidatePath("/dashboard");
  return { success: true, message: `User status changed to ${newStatus}` };
}

export async function listUsersAction() {
  const { user: currentUser } = await requireUser();

  if (!can(currentUser, "employee.read.all")) {
    throw new Error("Unauthorized: Insufficient permissions to view users.");
  }

  const users = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      image: userTable.image,
      role: userTable.role,
      status: userTable.status,
      createdAt: userTable.createdAt,
    })
    .from(userTable);

  return users;
}

export async function revokeUserSessionsAction(targetUserId: string) {
  const { user: currentUser } = await requireUser();

  if (!can(currentUser, "session.manage") && currentUser.id !== targetUserId) {
    throw new Error("Unauthorized: You cannot revoke another user's sessions.");
  }

  await db.delete(sessionTable).where(eq(sessionTable.userId, targetUserId));
  revalidatePath("/dashboard");
  return { success: true, message: "User sessions revoked." };
}
