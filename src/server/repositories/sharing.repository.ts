import { db } from "@/db";
import { tripShares } from "@/db/schema/social";
import { trips } from "@/db/schema/travel";
import { user } from "@/db/schema/auth";
import { eq, and, isNull, sql } from "drizzle-orm";
import type { CreateTripShareInput, UpdateTripShareInput } from "@/lib/validation";
import crypto from "crypto";

export class SharingRepository {
  static generateSecureToken(): string {
    return crypto.randomBytes(16).toString("hex");
  }

  static async createShare(
    tripId: string,
    createdBy: string,
    input: Partial<CreateTripShareInput>
  ) {
    const token = this.generateSecureToken();

    const created = await db
      .insert(tripShares)
      .values({
        tripId,
        shareToken: token,
        allowCopy: input.allowCopy ?? true,
        expiresAt: input.expiresAt ?? null,
        createdBy,
      })
      .returning();

    return created[0];
  }

  static async findShareByToken(token: string) {
    const now = new Date();
    const results = await db
      .select({
        share: tripShares,
        trip: trips,
        creator: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(tripShares)
      .innerJoin(trips, eq(tripShares.tripId, trips.id))
      .innerJoin(user, eq(tripShares.createdBy, user.id))
      .where(
        and(
          eq(tripShares.shareToken, token),
          eq(tripShares.isActive, true),
          isNull(trips.deletedAt),
          sql`(${tripShares.expiresAt} IS NULL OR ${tripShares.expiresAt} > ${now})`
        )
      )
      .limit(1);

    if (!results[0]) return null;
    return results[0];
  }

  static async findSharesByTrip(tripId: string) {
    return db
      .select({
        share: tripShares,
        creator: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
      .from(tripShares)
      .innerJoin(user, eq(tripShares.createdBy, user.id))
      .where(eq(tripShares.tripId, tripId));
  }

  static async updateShare(tripId: string, shareId: string, input: UpdateTripShareInput) {
    const updateValues: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (input.isActive !== undefined) updateValues.isActive = input.isActive;
    if (input.allowCopy !== undefined) updateValues.allowCopy = input.allowCopy;
    if (input.expiresAt !== undefined) updateValues.expiresAt = input.expiresAt;

    const updated = await db
      .update(tripShares)
      .set(updateValues)
      .where(and(eq(tripShares.id, shareId), eq(tripShares.tripId, tripId)))
      .returning();

    return updated[0] ?? null;
  }

  static async deleteShare(tripId: string, shareId: string) {
    const deleted = await db
      .delete(tripShares)
      .where(and(eq(tripShares.id, shareId), eq(tripShares.tripId, tripId)))
      .returning();
    return deleted[0] ?? null;
  }
}

export const sharingRepository = SharingRepository;
