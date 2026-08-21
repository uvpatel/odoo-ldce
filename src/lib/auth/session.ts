import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { UserRole } from "./roles";
import { isValidRole } from "./roles";
import { can, type Permission } from "./permissions";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: UserRole;
  status: "active" | "inactive" | "suspended";
  createdAt: Date;
  updatedAt: Date;
};

export type AuthSession = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CurrentSessionResult = {
  user: AuthUser;
  session: AuthSession;
} | null;

/**
 * Retrieves the current session on the server.
 * Returns null if not authenticated or if the user is suspended.
 */
export async function getCurrentSession(): Promise<CurrentSessionResult> {
  try {
    const headerList = await headers();
    const result = await auth.api.getSession({
      headers: headerList,
    });

    if (!result || !result.user || !result.session) {
      return null;
    }

    const rawUser = result.user as Record<string, unknown>;
    const userRole = isValidRole(rawUser.role) ? (rawUser.role as UserRole) : "employee";
    const userStatus = (rawUser.status as "active" | "inactive" | "suspended") || "active";

    const user: AuthUser = {
      id: String(rawUser.id),
      name: String(rawUser.name || ""),
      email: String(rawUser.email || ""),
      emailVerified: Boolean(rawUser.emailVerified),
      image: (rawUser.image as string | null | undefined) ?? null,
      role: userRole,
      status: userStatus,
      createdAt: rawUser.createdAt instanceof Date ? rawUser.createdAt : new Date(String(rawUser.createdAt)),
      updatedAt: rawUser.updatedAt instanceof Date ? rawUser.updatedAt : new Date(String(rawUser.updatedAt)),
    };

    const session: AuthSession = {
      id: String(result.session.id),
      userId: String(result.session.userId),
      token: String(result.session.token),
      expiresAt: result.session.expiresAt instanceof Date ? result.session.expiresAt : new Date(String(result.session.expiresAt)),
      ipAddress: (result.session.ipAddress as string | null | undefined) ?? null,
      userAgent: (result.session.userAgent as string | null | undefined) ?? null,
      createdAt: result.session.createdAt instanceof Date ? result.session.createdAt : new Date(String(result.session.createdAt)),
      updatedAt: result.session.updatedAt instanceof Date ? result.session.updatedAt : new Date(String(result.session.updatedAt)),
    };

    return { user, session };
  } catch (error: unknown) {
    // Rethrow Next.js internal signals (dynamic server usage during build prerendering, redirect signals)
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof (error as { digest: unknown }).digest === "string"
    ) {
      const digest = (error as { digest: string }).digest;
      if (digest === "DYNAMIC_SERVER_USAGE" || digest.startsWith("NEXT_REDIRECT")) {
        throw error;
      }
    }
    console.error("Error retrieving session:", error);
    return null;
  }
}

/**
 * Retrieves the currently authenticated user or null.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const sessionResult = await getCurrentSession();
  return sessionResult ? sessionResult.user : null;
}

/**
 * Requires an authenticated, active user.
 * Redirects to /signin if unauthenticated, or to /unauthorized if suspended.
 */
export async function requireUser(): Promise<{ user: AuthUser; session: AuthSession }> {
  const sessionResult = await getCurrentSession();

  if (!sessionResult) {
    redirect("/signin");
  }

  if (sessionResult.user.status === "suspended") {
    redirect("/unauthorized?reason=suspended");
  }

  return sessionResult;
}

/**
 * Requires the user to have a specific role or higher.
 */
export async function requireRole(role: UserRole): Promise<{ user: AuthUser; session: AuthSession }> {
  const { user, session } = await requireUser();

  if (user.role !== role && user.role !== "super_admin") {
    redirect("/unauthorized?reason=insufficient_role");
  }

  return { user, session };
}

/**
 * Requires the user to have any of the specified roles.
 */
export async function requireAnyRole(roles: UserRole[]): Promise<{ user: AuthUser; session: AuthSession }> {
  const { user, session } = await requireUser();

  if (!roles.includes(user.role) && user.role !== "super_admin") {
    redirect("/unauthorized?reason=insufficient_role");
  }

  return { user, session };
}

/**
 * Requires the user to have a specific permission.
 */
export async function requirePermission(permission: Permission): Promise<{ user: AuthUser; session: AuthSession }> {
  const { user, session } = await requireUser();

  if (!can(user, permission)) {
    redirect("/unauthorized?reason=insufficient_permissions");
  }

  return { user, session };
}
