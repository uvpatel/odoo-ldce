import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { userPreferences } from "@/db/schema/user";
import { savedDestinations } from "@/db/schema/social";
import { cities, countries } from "@/db/schema/catalog";
import { eq, and, desc } from "drizzle-orm";
import type { UpdateUserPreferencesInput } from "@/lib/validation";

export class UserRepository {
  static async findUserById(userId: string) {
    const results = await db.select().from(user).where(eq(user.id, userId)).limit(1);
    return results[0] ?? null;
  }

  static async findUserPreferences(userId: string) {
    const results = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    if (results[0]) return results[0];

    // Create default preferences if not existing
    const created = await db
      .insert(userPreferences)
      .values({
        userId,
        language: "en",
        currency: "USD",
        timezone: "UTC",
        isProfilePublic: false,
      })
      .returning();

    return created[0];
  }

  static async updateUserPreferences(userId: string, input: UpdateUserPreferencesInput) {
    // Ensure preferences record exists first
    await this.findUserPreferences(userId);

    const updateValues: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (input.language !== undefined) updateValues.language = input.language;
    if (input.currency !== undefined) updateValues.currency = input.currency;
    if (input.timezone !== undefined) updateValues.timezone = input.timezone;
    if (input.isProfilePublic !== undefined) updateValues.isProfilePublic = input.isProfilePublic;

    const updated = await db
      .update(userPreferences)
      .set(updateValues)
      .where(eq(userPreferences.userId, userId))
      .returning();

    return updated[0] ?? null;
  }

  static async findSavedDestinations(userId: string) {
    return db
      .select({
        id: savedDestinations.id,
        userId: savedDestinations.userId,
        cityId: savedDestinations.cityId,
        createdAt: savedDestinations.createdAt,
        city: {
          id: cities.id,
          name: cities.name,
          slug: cities.slug,
          description: cities.description,
          imageUrl: cities.imageUrl,
          costIndex: cities.costIndex,
          popularityScore: cities.popularityScore,
        },
        country: {
          id: countries.id,
          name: countries.name,
          iso2: countries.iso2,
          region: countries.region,
        },
      })
      .from(savedDestinations)
      .innerJoin(cities, eq(savedDestinations.cityId, cities.id))
      .innerJoin(countries, eq(cities.countryId, countries.id))
      .where(eq(savedDestinations.userId, userId))
      .orderBy(desc(savedDestinations.createdAt));
  }

  static async isSavedDestination(userId: string, cityId: string): Promise<boolean> {
    const results = await db
      .select({ id: savedDestinations.id })
      .from(savedDestinations)
      .where(and(eq(savedDestinations.userId, userId), eq(savedDestinations.cityId, cityId)))
      .limit(1);

    return results.length > 0;
  }

  static async toggleSavedDestination(userId: string, cityId: string): Promise<{ saved: boolean }> {
    const isSaved = await this.isSavedDestination(userId, cityId);

    if (isSaved) {
      await db
        .delete(savedDestinations)
        .where(and(eq(savedDestinations.userId, userId), eq(savedDestinations.cityId, cityId)));
      return { saved: false };
    } else {
      await db.insert(savedDestinations).values({
        userId,
        cityId,
      });
      return { saved: true };
    }
  }
}

export const userRepository = UserRepository;
