import { db } from "@/db";
import { user, UserTable, NewUserTable } from "@/db/schema/auth/users";
import { userPreferences, UserPreferencesTable } from "@/db/schema/user/user-preferences";
import { savedDestinations } from "@/db/schema/social/saved-destinations";
import { cities } from "@/db/schema/catalog/cities";
import { eq, desc, sql, ilike, or } from "drizzle-orm";

export class UserRepository {
  async findById(id: string) {
    const [u] = await db.select().from(user).where(eq(user.id, id)).limit(1);
    return u || null;
  }

  async findByEmail(email: string) {
    const [u] = await db.select().from(user).where(eq(user.email, email)).limit(1);
    return u || null;
  }

  async getAllUsers(limit: number = 50, offset: number = 0, search?: string) {
    if (search && search.trim()) {
      const pattern = `%${search}%`;
      return db
        .select()
        .from(user)
        .where(or(ilike(user.name, pattern), ilike(user.email, pattern)))
        .orderBy(desc(user.createdAt))
        .limit(limit)
        .offset(offset);
    }
    return db.select().from(user).orderBy(desc(user.createdAt)).limit(limit).offset(offset);
  }

  async countUsers(search?: string) {
    if (search && search.trim()) {
      const pattern = `%${search}%`;
      const res = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(user)
        .where(or(ilike(user.name, pattern), ilike(user.email, pattern)));
      return res[0]?.count ?? 0;
    }
    const res = await db.select({ count: sql<number>`count(*)::int` }).from(user);
    return res[0]?.count ?? 0;
  }

  async updateRole(id: string, role: "employee" | "manager" | "hr" | "admin" | "super_admin") {
    const [updated] = await db.update(user).set({ role, updatedAt: new Date() }).where(eq(user.id, id)).returning();
    return updated || null;
  }

  async updateStatus(id: string, status: "active" | "inactive" | "suspended") {
    const [updated] = await db.update(user).set({ status, updatedAt: new Date() }).where(eq(user.id, id)).returning();
    return updated || null;
  }

  async getPreferences(userId: string) {
    const [prefs] = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);
    return prefs || null;
  }

  async upsertPreferences(userId: string, data: Partial<UserPreferencesTable>) {
    const existing = await this.getPreferences(userId);
    if (existing) {
      const [updated] = await db
        .update(userPreferences)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(userPreferences.userId, userId))
        .returning();
      return updated;
    }
    const [created] = await db
      .insert(userPreferences)
      .values({
        id: `pref_${userId}`,
        userId,
        theme: data.theme || "system",
        currency: data.currency || "USD",
        language: data.language || "en",
        emailNotifications: data.emailNotifications ?? true,
        marketingEmails: data.marketingEmails ?? false,
      })
      .returning();
    return created;
  }

  async getSavedDestinations(userId: string) {
    return db
      .select({
        id: savedDestinations.id,
        savedAt: savedDestinations.createdAt,
        city: cities,
      })
      .from(savedDestinations)
      .innerJoin(cities, eq(savedDestinations.cityId, cities.id))
      .where(eq(savedDestinations.userId, userId))
      .orderBy(desc(savedDestinations.createdAt));
  }
}

export const userRepository = new UserRepository();
