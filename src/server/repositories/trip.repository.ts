import { db } from "@/db";
import { trips, tripMembers } from "@/db/schema/travel";
import { user } from "@/db/schema/auth";
import { eq, and, isNull, desc, asc, sql, inArray } from "drizzle-orm";
import type { CreateTripInput, UpdateTripInput, TripFilterInput } from "@/lib/validation";
import type { TripMemberRole } from "@/db/schema/enums";

export class TripRepository {
  static async findUserTrips(userId: string, filters: TripFilterInput) {
    const {
      page = 1,
      limit = 20,
      status,
      visibility,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;

    const offset = (page - 1) * limit;

    // Find trip IDs where user is owner or member
    const memberTripIds = await db
      .select({ tripId: tripMembers.tripId })
      .from(tripMembers)
      .where(eq(tripMembers.userId, userId));

    const allTripIds = memberTripIds.map((m) => m.tripId);

    const conditions = [
      isNull(trips.deletedAt),
      sql`(${trips.ownerId} = ${userId} OR ${allTripIds.length > 0 ? inArray(trips.id, allTripIds) : sql`FALSE`})`,
    ];

    if (status) {
      conditions.push(eq(trips.status, status));
    }

    if (visibility) {
      conditions.push(eq(trips.visibility, visibility));
    }

    if (search) {
      conditions.push(
        sql`(${trips.name} ILIKE ${`%${search}%`} OR ${trips.description} ILIKE ${`%${search}%`})`
      );
    }

    const whereClause = and(...conditions);

    let orderByClause;
    if (sortBy === "name") {
      orderByClause = sortOrder === "asc" ? asc(trips.name) : desc(trips.name);
    } else if (sortBy === "startDate") {
      orderByClause = sortOrder === "asc" ? asc(trips.startDate) : desc(trips.startDate);
    } else if (sortBy === "updatedAt") {
      orderByClause = sortOrder === "asc" ? asc(trips.updatedAt) : desc(trips.updatedAt);
    } else {
      orderByClause = sortOrder === "asc" ? asc(trips.createdAt) : desc(trips.createdAt);
    }

    const [items, totalResult] = await Promise.all([
      db
        .select({
          id: trips.id,
          ownerId: trips.ownerId,
          name: trips.name,
          slug: trips.slug,
          description: trips.description,
          coverImageUrl: trips.coverImageUrl,
          startDate: trips.startDate,
          endDate: trips.endDate,
          status: trips.status,
          visibility: trips.visibility,
          currency: trips.currency,
          budgetLimit: trips.budgetLimit,
          sourceTripId: trips.sourceTripId,
          createdAt: trips.createdAt,
          updatedAt: trips.updatedAt,
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
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(trips)
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

  static async findTripById(tripId: string) {
    const results = await db
      .select({
        trip: trips,
        owner: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })
      .from(trips)
      .innerJoin(user, eq(trips.ownerId, user.id))
      .where(and(eq(trips.id, tripId), isNull(trips.deletedAt)))
      .limit(1);

    if (!results[0]) return null;
    return {
      ...results[0].trip,
      owner: results[0].owner,
    };
  }

  static async findTripBySlug(ownerId: string, slug: string) {
    const results = await db
      .select()
      .from(trips)
      .where(and(eq(trips.ownerId, ownerId), eq(trips.slug, slug), isNull(trips.deletedAt)))
      .limit(1);

    return results[0] ?? null;
  }

  static async findPublicTrips(filters: TripFilterInput) {
    const {
      page = 1,
      limit = 20,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;

    const offset = (page - 1) * limit;
    const conditions = [
      isNull(trips.deletedAt),
      eq(trips.visibility, "public"),
    ];

    if (search) {
      conditions.push(
        sql`(${trips.name} ILIKE ${`%${search}%`} OR ${trips.description} ILIKE ${`%${search}%`})`
      );
    }

    const whereClause = and(...conditions);
    const orderByClause = sortOrder === "asc" ? asc(trips.createdAt) : desc(trips.createdAt);

    const [items, totalResult] = await Promise.all([
      db
        .select({
          id: trips.id,
          ownerId: trips.ownerId,
          name: trips.name,
          slug: trips.slug,
          description: trips.description,
          coverImageUrl: trips.coverImageUrl,
          startDate: trips.startDate,
          endDate: trips.endDate,
          status: trips.status,
          visibility: trips.visibility,
          currency: trips.currency,
          budgetLimit: trips.budgetLimit,
          createdAt: trips.createdAt,
          updatedAt: trips.updatedAt,
          owner: {
            id: user.id,
            name: user.name,
            image: user.image,
          },
        })
        .from(trips)
        .innerJoin(user, eq(trips.ownerId, user.id))
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(trips)
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

  static async createTrip(ownerId: string, input: CreateTripInput & { slug: string }) {
    const newTrip = await db
      .insert(trips)
      .values({
        ownerId,
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        coverImageUrl: input.coverImageUrl ?? null,
        startDate: input.startDate ?? null,
        endDate: input.endDate ?? null,
        visibility: input.visibility ?? "private",
        currency: input.currency ?? "USD",
        budgetLimit: input.budgetLimit ? String(input.budgetLimit) : null,
      })
      .returning();

    // Automatically add owner as owner member
    if (newTrip[0]) {
      await db.insert(tripMembers).values({
        tripId: newTrip[0].id,
        userId: ownerId,
        role: "owner",
      });
    }

    return newTrip[0];
  }

  static async updateTrip(tripId: string, input: UpdateTripInput) {
    const updateValues: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (input.name !== undefined) updateValues.name = input.name;
    if (input.slug !== undefined) updateValues.slug = input.slug;
    if (input.description !== undefined) updateValues.description = input.description;
    if (input.coverImageUrl !== undefined) updateValues.coverImageUrl = input.coverImageUrl;
    if (input.startDate !== undefined) updateValues.startDate = input.startDate;
    if (input.endDate !== undefined) updateValues.endDate = input.endDate;
    if (input.status !== undefined) updateValues.status = input.status;
    if (input.visibility !== undefined) updateValues.visibility = input.visibility;
    if (input.currency !== undefined) updateValues.currency = input.currency;
    if (input.budgetLimit !== undefined)
      updateValues.budgetLimit = input.budgetLimit ? String(input.budgetLimit) : null;

    const updated = await db
      .update(trips)
      .set(updateValues)
      .where(eq(trips.id, tripId))
      .returning();

    return updated[0] ?? null;
  }

  static async softDeleteTrip(tripId: string) {
    const updated = await db
      .update(trips)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(trips.id, tripId))
      .returning();

    return updated[0] ?? null;
  }

  static async restoreTrip(tripId: string) {
    const updated = await db
      .update(trips)
      .set({ deletedAt: null, updatedAt: new Date() })
      .where(eq(trips.id, tripId))
      .returning();

    return updated[0] ?? null;
  }

  static async hardDeleteTrip(tripId: string) {
    const deleted = await db.delete(trips).where(eq(trips.id, tripId)).returning();
    return deleted[0] ?? null;
  }

  static async getMemberRole(tripId: string, userId: string): Promise<TripMemberRole | null> {
    const results = await db
      .select({ role: tripMembers.role })
      .from(tripMembers)
      .where(and(eq(tripMembers.tripId, tripId), eq(tripMembers.userId, userId)))
      .limit(1);

    return results[0]?.role ?? null;
  }

  static async getTripMembers(tripId: string) {
    return db
      .select({
        id: tripMembers.id,
        tripId: tripMembers.tripId,
        userId: tripMembers.userId,
        role: tripMembers.role,
        joinedAt: tripMembers.joinedAt,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })
      .from(tripMembers)
      .innerJoin(user, eq(tripMembers.userId, user.id))
      .where(eq(tripMembers.tripId, tripId))
      .orderBy(asc(tripMembers.createdAt));
  }

  static async addMember(tripId: string, userId: string, role: TripMemberRole, invitedBy?: string) {
    const newMember = await db
      .insert(tripMembers)
      .values({
        tripId,
        userId,
        role,
        invitedBy: invitedBy ?? null,
      })
      .returning();

    return newMember[0];
  }

  static async updateMemberRole(tripId: string, userId: string, role: TripMemberRole) {
    const updated = await db
      .update(tripMembers)
      .set({ role, updatedAt: new Date() })
      .where(and(eq(tripMembers.tripId, tripId), eq(tripMembers.userId, userId)))
      .returning();

    return updated[0] ?? null;
  }

  static async removeMember(tripId: string, userId: string) {
    const deleted = await db
      .delete(tripMembers)
      .where(and(eq(tripMembers.tripId, tripId), eq(tripMembers.userId, userId)))
      .returning();

    return deleted[0] ?? null;
  }
}

export const tripRepository = TripRepository;
