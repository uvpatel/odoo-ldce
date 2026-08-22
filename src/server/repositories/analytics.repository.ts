import { db } from "@/db";
import { trips } from "@/db/schema/travel";
import { user } from "@/db/schema/auth";
import { cities, activities } from "@/db/schema/catalog";
import { tripBudgets } from "@/db/schema/budget";
import { eq, and, isNull, sql, desc } from "drizzle-orm";

export class AnalyticsRepository {
  static async getPlatformAnalytics() {
    const [
      totalUsersResult,
      tripsMetricsResult,
      popularCitiesResult,
      popularActivitiesResult,
      averageBudgetResult,
      tripCreationTrendsResult,
    ] = await Promise.all([
      // Total registered users
      db.select({ count: sql<number>`cast(count(*) as integer)` }).from(user),

      // Trips breakdown & duration
      db
        .select({
          totalTrips: sql<number>`cast(count(*) as integer)`,
          activeTrips: sql<number>`cast(count(*) filter (where ${trips.status} in ('planned', 'ongoing')) as integer)`,
          completedTrips: sql<number>`cast(count(*) filter (where ${trips.status} = 'completed') as integer)`,
          draftTrips: sql<number>`cast(count(*) filter (where ${trips.status} = 'draft') as integer)`,
          cancelledTrips: sql<number>`cast(count(*) filter (where ${trips.status} = 'cancelled') as integer)`,
          publicTrips: sql<number>`cast(count(*) filter (where ${trips.visibility} = 'public') as integer)`,
          averageDurationDays: sql<number>`coalesce(round(avg(case when ${trips.startDate} is not null and ${trips.endDate} is not null then (${trips.endDate} - ${trips.startDate}) + 1 else null end)::numeric, 1), 0)`,
        })
        .from(trips)
        .where(isNull(trips.deletedAt)),

      // Top popular cities
      db
        .select({
          id: cities.id,
          name: cities.name,
          slug: cities.slug,
          popularityScore: cities.popularityScore,
        })
        .from(cities)
        .orderBy(desc(cities.popularityScore))
        .limit(5),

      // Top popular activities
      db
        .select({
          id: activities.id,
          name: activities.name,
          popularityScore: activities.popularityScore,
          rating: activities.rating,
        })
        .from(activities)
        .orderBy(desc(activities.popularityScore))
        .limit(5),

      // Average trip budget
      db
        .select({
          averageBudget: sql<number>`coalesce(round(avg(${tripBudgets.totalBudget})::numeric, 2), 0)`,
        })
        .from(tripBudgets),

      // Trip creation trends by month
      db
        .select({
          period: sql<string>`to_char(${trips.createdAt}, 'YYYY-MM')`,
          count: sql<number>`cast(count(*) as integer)`,
        })
        .from(trips)
        .where(isNull(trips.deletedAt))
        .groupBy(sql`to_char(${trips.createdAt}, 'YYYY-MM')`)
        .orderBy(sql`to_char(${trips.createdAt}, 'YYYY-MM') ASC`)
        .limit(12),
    ]);

    const userCount = totalUsersResult[0]?.count ?? 0;
    const metrics = tripsMetricsResult[0] ?? {
      totalTrips: 0,
      activeTrips: 0,
      completedTrips: 0,
      draftTrips: 0,
      cancelledTrips: 0,
      publicTrips: 0,
      averageDurationDays: 0,
    };
    const avgBudget = averageBudgetResult[0]?.averageBudget ?? 0;

    return {
      totalUsers: userCount,
      totalTrips: Number(metrics.totalTrips),
      activeTrips: Number(metrics.activeTrips),
      completedTrips: Number(metrics.completedTrips),
      draftTrips: Number(metrics.draftTrips),
      cancelledTrips: Number(metrics.cancelledTrips),
      publicTrips: Number(metrics.publicTrips),
      averageDurationDays: Number(metrics.averageDurationDays),
      averageTripBudget: Number(avgBudget),
      popularCities: popularCitiesResult,
      popularActivities: popularActivitiesResult,
      creationTrends: tripCreationTrendsResult,
    };
  }
}

export const analyticsRepository = AnalyticsRepository;
