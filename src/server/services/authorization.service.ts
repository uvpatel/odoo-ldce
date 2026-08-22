import { db } from "@/db";
import { trips, tripMembers } from "@/db/schema/travel";
import { user } from "@/db/schema/auth";
import { tripShares } from "@/db/schema/social";
import { eq, and, isNull, sql } from "drizzle-orm";
import type { TripMemberRole } from "@/db/schema/enums";

export interface TripAccessContext {
  userId?: string | null;
  userRole?: string | null;
  tripId: string;
  shareToken?: string | null;
}

export class AuthorizationService {
  /**
   * Evaluates whether a user or visitor can view a specific trip.
   * Access is allowed if:
   * 1. User is the trip owner
   * 2. User is a member of the trip (owner, editor, or viewer)
   * 3. User is an admin / super_admin
   * 4. Trip is public
   * 5. A valid, active, non-expired share token is provided
   */
  static async canViewTrip(ctx: TripAccessContext): Promise<boolean> {
    const { userId, userRole, tripId, shareToken } = ctx;

    // Fetch the trip
    const tripResults = await db
      .select({
        id: trips.id,
        ownerId: trips.ownerId,
        visibility: trips.visibility,
        deletedAt: trips.deletedAt,
      })
      .from(trips)
      .where(and(eq(trips.id, tripId), isNull(trips.deletedAt)))
      .limit(1);

    const trip = tripResults[0];
    if (!trip) return false;

    // Platform admin check
    if (userRole === "admin" || userRole === "super_admin") {
      return true;
    }

    // Owner check
    if (userId && trip.ownerId === userId) {
      return true;
    }

    // Public trip check
    if (trip.visibility === "public") {
      return true;
    }

    // Share token check
    if (shareToken) {
      const now = new Date();
      const shareResults = await db
        .select({ id: tripShares.id })
        .from(tripShares)
        .where(
          and(
            eq(tripShares.tripId, tripId),
            eq(tripShares.shareToken, shareToken),
            eq(tripShares.isActive, true),
            sql`(${tripShares.expiresAt} IS NULL OR ${tripShares.expiresAt} > ${now})`
          )
        )
        .limit(1);

      if (shareResults.length > 0) {
        return true;
      }
    }

    // Trip membership check (editor / viewer)
    if (userId) {
      const memberResults = await db
        .select({ role: tripMembers.role })
        .from(tripMembers)
        .where(and(eq(tripMembers.tripId, tripId), eq(tripMembers.userId, userId)))
        .limit(1);

      if (memberResults.length > 0) {
        return true;
      }
    }

    return false;
  }

  /**
   * Evaluates whether a user can edit a trip's itinerary and content.
   * Access is allowed if:
   * 1. User is the trip owner
   * 2. User is an editor or owner member
   * 3. User is an admin / super_admin
   */
  static async canEditTrip(userId: string, tripId: string, userRole?: string): Promise<boolean> {
    if (userRole === "admin" || userRole === "super_admin") {
      return true;
    }

    const tripResults = await db
      .select({ ownerId: trips.ownerId })
      .from(trips)
      .where(and(eq(trips.id, tripId), isNull(trips.deletedAt)))
      .limit(1);

    const trip = tripResults[0];
    if (!trip) return false;

    if (trip.ownerId === userId) {
      return true;
    }

    const memberResults = await db
      .select({ role: tripMembers.role })
      .from(tripMembers)
      .where(and(eq(tripMembers.tripId, tripId), eq(tripMembers.userId, userId)))
      .limit(1);

    const member = memberResults[0];
    if (member && (member.role === "owner" || member.role === "editor")) {
      return true;
    }

    return false;
  }

  /**
   * Evaluates whether a user can delete or archive a trip.
   * Only the trip owner or platform admin can delete a trip.
   */
  static async canDeleteTrip(userId: string, tripId: string, userRole?: string): Promise<boolean> {
    if (userRole === "admin" || userRole === "super_admin") {
      return true;
    }

    const tripResults = await db
      .select({ ownerId: trips.ownerId })
      .from(trips)
      .where(and(eq(trips.id, tripId), isNull(trips.deletedAt)))
      .limit(1);

    const trip = tripResults[0];
    if (!trip) return false;

    return trip.ownerId === userId;
  }

  /**
   * Evaluates whether a user can manage collaborators (invite, change roles, remove).
   * Only the trip owner (or platform admin) can manage members.
   */
  static async canManageMembers(userId: string, tripId: string, userRole?: string): Promise<boolean> {
    if (userRole === "admin" || userRole === "super_admin") {
      return true;
    }

    const tripResults = await db
      .select({ ownerId: trips.ownerId })
      .from(trips)
      .where(and(eq(trips.id, tripId), isNull(trips.deletedAt)))
      .limit(1);

    const trip = tripResults[0];
    if (!trip) return false;

    if (trip.ownerId === userId) {
      return true;
    }

    const memberResults = await db
      .select({ role: tripMembers.role })
      .from(tripMembers)
      .where(and(eq(tripMembers.tripId, tripId), eq(tripMembers.userId, userId)))
      .limit(1);

    return memberResults[0]?.role === "owner";
  }

  /**
   * Evaluates whether a user can manage the trip budget and expenses.
   */
  static async canManageBudget(userId: string, tripId: string, userRole?: string): Promise<boolean> {
    return this.canEditTrip(userId, tripId, userRole);
  }
}

export const authorizationService = AuthorizationService;
