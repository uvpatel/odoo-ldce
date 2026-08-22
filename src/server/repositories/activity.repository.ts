import { db } from "@/db";
import { activities, activityCategories, cities } from "@/db/schema/catalog";
import { eq, and, gte, lte, desc, asc, sql } from "drizzle-orm";
import type { ActivitySearchInput } from "@/lib/validation";

export class ActivityRepository {
  static async findActivities(filters: ActivitySearchInput) {
    const {
      page = 1,
      limit = 20,
      cityId,
      categoryId,
      search,
      minCost,
      maxCost,
      maxDuration,
      minRating,
      sortBy = "popularity",
      sortOrder = "desc",
    } = filters;

    const offset = (page - 1) * limit;
    const conditions = [];

    if (cityId) {
      conditions.push(eq(activities.cityId, cityId));
    }

    if (categoryId) {
      conditions.push(eq(activities.categoryId, categoryId));
    }

    if (search) {
      conditions.push(
        sql`(${activities.name} ILIKE ${`%${search}%`} OR ${activities.description} ILIKE ${`%${search}%`})`
      );
    }

    if (minCost !== undefined) {
      conditions.push(gte(activities.estimatedCost, String(minCost)));
    }

    if (maxCost !== undefined) {
      conditions.push(lte(activities.estimatedCost, String(maxCost)));
    }

    if (maxDuration !== undefined) {
      conditions.push(lte(activities.durationMinutes, maxDuration));
    }

    if (minRating !== undefined) {
      conditions.push(gte(activities.rating, String(minRating)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderByClause;
    if (sortBy === "rating") {
      orderByClause = sortOrder === "asc" ? asc(activities.rating) : desc(activities.rating);
    } else if (sortBy === "cost") {
      orderByClause = sortOrder === "asc" ? asc(activities.estimatedCost) : desc(activities.estimatedCost);
    } else if (sortBy === "duration") {
      orderByClause = sortOrder === "asc" ? asc(activities.durationMinutes) : desc(activities.durationMinutes);
    } else if (sortBy === "name") {
      orderByClause = sortOrder === "asc" ? asc(activities.name) : desc(activities.name);
    } else {
      orderByClause = sortOrder === "asc" ? asc(activities.popularityScore) : desc(activities.popularityScore);
    }

    const [items, totalResult] = await Promise.all([
      db
        .select({
          id: activities.id,
          name: activities.name,
          slug: activities.slug,
          description: activities.description,
          imageUrl: activities.imageUrl,
          address: activities.address,
          latitude: activities.latitude,
          longitude: activities.longitude,
          estimatedCost: activities.estimatedCost,
          currency: activities.currency,
          durationMinutes: activities.durationMinutes,
          popularityScore: activities.popularityScore,
          rating: activities.rating,
          createdAt: activities.createdAt,
          updatedAt: activities.updatedAt,
          city: {
            id: cities.id,
            name: cities.name,
            slug: cities.slug,
          },
          category: {
            id: activityCategories.id,
            name: activityCategories.name,
            slug: activityCategories.slug,
            icon: activityCategories.icon,
          },
        })
        .from(activities)
        .innerJoin(cities, eq(activities.cityId, cities.id))
        .innerJoin(activityCategories, eq(activities.categoryId, activityCategories.id))
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(activities)
        .where(whereClause),
    ]);

    const total = totalResult[0]?.count ?? 0;

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async findActivityById(id: string) {
    const results = await db
      .select({
        activity: activities,
        city: cities,
        category: activityCategories,
      })
      .from(activities)
      .innerJoin(cities, eq(activities.cityId, cities.id))
      .innerJoin(activityCategories, eq(activities.categoryId, activityCategories.id))
      .where(eq(activities.id, id))
      .limit(1);

    if (!results[0]) return null;
    return {
      ...results[0].activity,
      city: results[0].city,
      category: results[0].category,
    };
  }

  static async findCategories() {
    return db.select().from(activityCategories).orderBy(asc(activityCategories.name));
  }

  static async findCategoryBySlug(slug: string) {
    const results = await db
      .select()
      .from(activityCategories)
      .where(eq(activityCategories.slug, slug))
      .limit(1);

    return results[0] ?? null;
  }
}
