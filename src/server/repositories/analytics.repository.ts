import { db } from "@/db";
import { user } from "@/db/schema/auth/users";
import { trips } from "@/db/schema/travel/trips";
import { cities } from "@/db/schema/catalog/cities";
import { activities } from "@/db/schema/catalog/activities";
import { sql, desc } from "drizzle-orm";

export class AnalyticsRepository {
  async getOverviewStats() {
    const [usersCount] = await db.select({ count: sql<number>`count(*)::int` }).from(user);
    const [tripsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(trips);
    const [citiesCount] = await db.select({ count: sql<number>`count(*)::int` }).from(cities);
    const [activitiesCount] = await db.select({ count: sql<number>`count(*)::int` }).from(activities);

    return {
      totalUsers: usersCount?.count ?? 0,
      totalTrips: tripsCount?.count ?? 0,
      totalCities: citiesCount?.count ?? 0,
      totalActivities: activitiesCount?.count ?? 0,
    };
  }

  async getPopularCities(limit: number = 5) {
    return db
      .select({
        id: cities.id,
        name: cities.name,
        countryName: cities.countryName,
        coverImage: cities.coverImage,
      })
      .from(cities)
      .limit(limit);
  }

  async getPopularActivities(limit: number = 5) {
    return db
      .select({
        id: activities.id,
        name: activities.name,
        rating: activities.rating,
        cityId: activities.cityId,
      })
      .from(activities)
      .orderBy(desc(activities.rating))
      .limit(limit);
  }
}

export const analyticsRepository = new AnalyticsRepository();
