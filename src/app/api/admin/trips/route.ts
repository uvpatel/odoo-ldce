import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/db";
import { trips } from "@/db/schema/travel";
import { user } from "@/db/schema/auth";
import { eq, and, isNull, desc, asc, sql } from "drizzle-orm";

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
    const status = searchParams.get("status") || "";
    const offset = (page - 1) * limit;

    const conditions = [isNull(trips.deletedAt)];
    if (status) conditions.push(eq(trips.status, status as "draft" | "planned" | "ongoing" | "completed" | "cancelled"));

    const whereClause = and(...conditions);

    const [tripList, totalResult] = await Promise.all([
      db
        .select({
          id: trips.id,
          name: trips.name,
          status: trips.status,
          visibility: trips.visibility,
          startDate: trips.startDate,
          endDate: trips.endDate,
          currency: trips.currency,
          budgetLimit: trips.budgetLimit,
          createdAt: trips.createdAt,
          owner: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
        })
        .from(trips)
        .innerJoin(user, eq(trips.ownerId, user.id))
        .where(whereClause)
        .orderBy(desc(trips.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`cast(count(*) as integer)` }).from(trips).where(whereClause),
    ]);

    return NextResponse.json({
      items: tripList,
      total: totalResult[0]?.count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((totalResult[0]?.count ?? 0) / limit),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch trips";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
