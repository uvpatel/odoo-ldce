import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { TripService } from "@/server/services/trip.service";
import { CityRepository } from "@/server/repositories/city.repository";
import { db } from "@/db";
import { trips } from "@/db/schema/travel";
import { expenses } from "@/db/schema/budget";
import { eq, and, isNull, sql, desc, gte } from "drizzle-orm";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      recentTrips,
      tripStats,
      upcomingTrips,
      recentExpenses,
      recommendedCities,
    ] = await Promise.all([
      // Recent trips
      TripService.getUserTrips(user.id, { page: 1, limit: 6, sortBy: "createdAt", sortOrder: "desc" }),

      // Trip status breakdown
      db
        .select({
          status: trips.status,
          count: sql<number>`cast(count(*) as integer)`,
        })
        .from(trips)
        .where(and(eq(trips.ownerId, user.id), isNull(trips.deletedAt)))
        .groupBy(trips.status),

      // Upcoming trips (planned or ongoing with future start/end dates)
      db
        .select({
          id: trips.id,
          name: trips.name,
          startDate: trips.startDate,
          endDate: trips.endDate,
          status: trips.status,
          currency: trips.currency,
          budgetLimit: trips.budgetLimit,
        })
        .from(trips)
        .where(
          and(
            eq(trips.ownerId, user.id),
            isNull(trips.deletedAt),
            sql`${trips.status} in ('planned', 'ongoing')`
          )
        )
        .orderBy(trips.startDate)
        .limit(3),

      // Recent expenses across all owned trips
      db
        .select({
          id: expenses.id,
          title: expenses.title,
          amount: expenses.amount,
          category: expenses.category,
          date: expenses.expenseDate,
          currency: expenses.currency,
          tripName: trips.name,
          tripId: trips.id,
        })
        .from(expenses)
        .innerJoin(trips, eq(expenses.tripId, trips.id))
        .where(
          and(
            eq(trips.ownerId, user.id),
            isNull(trips.deletedAt),
            gte(expenses.expenseDate, thirtyDaysAgo.toISOString().split("T")[0])
          )
        )
        .orderBy(desc(expenses.createdAt))
        .limit(5),

      CityRepository.findPopularCities(4),
    ]);

    // Summary stats
    const totalTrips = tripStats.reduce((acc, s) => acc + Number(s.count), 0);
    const activeTrips = tripStats
      .filter((s) => s.status === "ongoing" || s.status === "planned")
      .reduce((acc, s) => acc + Number(s.count), 0);
    const completedTrips = tripStats
      .filter((s) => s.status === "completed")
      .reduce((acc, s) => acc + Number(s.count), 0);

    return NextResponse.json({
      user: {
        name: user.name,
      },
      stats: {
        totalTrips,
        activeTrips,
        completedTrips,
        draftTrips: tripStats.find((s) => s.status === "draft")?.count ?? 0,
      },
      recentTrips: recentTrips.items,
      upcomingTrips,
      recentExpenses,
      recommendedCities,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch dashboard";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
