export type UserRole = "employee" | "manager" | "hr" | "admin" | "super_admin";

export type UserStatus = "active" | "inactive" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionUserContext {
  user: User;
  session: Session;
}
