import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { desc, asc, sql, ilike, and, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "admin" && currentUser.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const offset = (page - 1) * limit;

    const conditions = [];
    if (search) {
      conditions.push(
        sql`(${user.name} ILIKE ${`%${search}%`} OR ${user.email} ILIKE ${`%${search}%`})`
      );
    }
    if (role) conditions.push(eq(user.role, role as "employee" | "manager" | "hr" | "admin" | "super_admin"));
    if (status) conditions.push(eq(user.status, status as "active" | "inactive" | "suspended"));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [users, totalResult] = await Promise.all([
      db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          emailVerified: user.emailVerified,
          image: user.image,
          createdAt: user.createdAt,
        })
        .from(user)
        .where(whereClause)
        .orderBy(sortOrder === "asc" ? asc(user.createdAt) : desc(user.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`cast(count(*) as integer)` }).from(user).where(whereClause),
    ]);

    return NextResponse.json({
      items: users,
      total: totalResult[0]?.count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((totalResult[0]?.count ?? 0) / limit),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
