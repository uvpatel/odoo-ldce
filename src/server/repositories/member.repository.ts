import { db } from "@/db";
import { tripMembers, TripMemberTable, NewTripMemberTable } from "@/db/schema/travel/trip-members";
import { user } from "@/db/schema/auth/users";
import { eq, and } from "drizzle-orm";

export class MemberRepository {
  async findByTripId(tripId: string) {
    return db
      .select({
        id: tripMembers.id,
        tripId: tripMembers.tripId,
        userId: tripMembers.userId,
        role: tripMembers.role,
        createdAt: tripMembers.createdAt,
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
      })
      .from(tripMembers)
      .innerJoin(user, eq(tripMembers.userId, user.id))
      .where(eq(tripMembers.tripId, tripId));
  }

  async findMember(tripId: string, userId: string) {
    const [member] = await db
      .select()
      .from(tripMembers)
      .where(and(eq(tripMembers.tripId, tripId), eq(tripMembers.userId, userId)))
      .limit(1);
    return member || null;
  }

  async addMember(data: NewTripMemberTable) {
    const [created] = await db.insert(tripMembers).values(data).returning();
    return created;
  }

  async updateRole(id: string, role: "owner" | "editor" | "viewer") {
    const [updated] = await db.update(tripMembers).set({ role, updatedAt: new Date() }).where(eq(tripMembers.id, id)).returning();
    return updated || null;
  }

  async removeMember(id: string) {
    const [deleted] = await db.delete(tripMembers).where(eq(tripMembers.id, id)).returning();
    return deleted || null;
  }
}

export const memberRepository = new MemberRepository();
