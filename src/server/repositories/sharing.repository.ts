import { db } from "@/db";
import { tripShares, TripShareTable, NewTripShareTable } from "@/db/schema/social/trip-shares";
import { trips } from "@/db/schema/travel/trips";
import { eq, sql } from "drizzle-orm";

export class SharingRepository {
  async findByToken(shareToken: string) {
    const [share] = await db
      .select({
        share: tripShares,
        trip: trips,
      })
      .from(tripShares)
      .innerJoin(trips, eq(tripShares.tripId, trips.id))
      .where(eq(tripShares.shareToken, shareToken))
      .limit(1);
    return share || null;
  }

  async findByTripId(tripId: string) {
    const [share] = await db.select().from(tripShares).where(eq(tripShares.tripId, tripId)).limit(1);
    return share || null;
  }

  async create(data: NewTripShareTable) {
    const [share] = await db.insert(tripShares).values(data).returning();
    return share;
  }

  async incrementViews(shareToken: string) {
    await db
      .update(tripShares)
      .set({ viewCount: sql`${tripShares.viewCount} + 1` })
      .where(eq(tripShares.shareToken, shareToken));
  }

  async incrementCopies(shareToken: string) {
    await db
      .update(tripShares)
      .set({ copyCount: sql`${tripShares.copyCount} + 1` })
      .where(eq(tripShares.shareToken, shareToken));
  }
}

export const sharingRepository = new SharingRepository();
