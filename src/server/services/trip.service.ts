import { db } from "@/db";
import { trips, tripMembers, tripStops, tripDays, itineraryItems } from "@/db/schema/travel";
import { tripBudgets, expenses } from "@/db/schema/budget";
import { TripRepository } from "../repositories/trip.repository";
import { ItineraryRepository } from "../repositories/itinerary.repository";
import { BudgetRepository } from "../repositories/budget.repository";
import { CityRepository } from "../repositories/city.repository";
import { SharingRepository } from "../repositories/sharing.repository";
import { AuthorizationService } from "./authorization.service";
import { eq, and, asc } from "drizzle-orm";
import type { CreateTripInput, UpdateTripInput, TripFilterInput } from "@/lib/validation";

export class TripService {
  static generateSlug(name: string): string {
    const base = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    return `${base || "trip"}-${randomSuffix}`;
  }

  static async createTrip(userId: string, input: CreateTripInput) {
    const slug = this.generateSlug(input.name);
    return TripRepository.createTrip(userId, { ...input, slug });
  }

  static async updateTrip(userId: string, tripId: string, input: UpdateTripInput, userRole?: string) {
    const canEdit = await AuthorizationService.canEditTrip(userId, tripId, userRole);
    if (!canEdit) {
      throw new Error("Unauthorized: You do not have permission to edit this trip.");
    }
    return TripRepository.updateTrip(tripId, input);
  }

  static async deleteTrip(userId: string, tripId: string, userRole?: string) {
    const canDelete = await AuthorizationService.canDeleteTrip(userId, tripId, userRole);
    if (!canDelete) {
      throw new Error("Unauthorized: Only the trip owner can delete this trip.");
    }
    return TripRepository.softDeleteTrip(tripId);
  }

  static async getUserTrips(userId: string, filters: TripFilterInput) {
    return TripRepository.findUserTrips(userId, filters);
  }

  static async getPublicTrips(filters: TripFilterInput) {
    return TripRepository.findPublicTrips(filters);
  }

  static async getTripDetails(
    tripId: string,
    accessCtx: { userId?: string | null; userRole?: string | null; shareToken?: string | null }
  ) {
    const canView = await AuthorizationService.canViewTrip({
      tripId,
      userId: accessCtx.userId,
      userRole: accessCtx.userRole,
      shareToken: accessCtx.shareToken,
    });

    if (!canView) {
      throw new Error("Unauthorized: You do not have permission to view this trip.");
    }

    const [trip, members, itinerary, budgetSummary] = await Promise.all([
      TripRepository.findTripById(tripId),
      TripRepository.getTripMembers(tripId),
      ItineraryRepository.findFullTripItinerary(tripId),
      BudgetRepository.calculateBudgetSummary(tripId),
    ]);

    if (!trip) {
      throw new Error("Trip not found.");
    }

    const isOwner = Boolean(accessCtx.userId && trip.ownerId === accessCtx.userId);
    const userMember = members.find((m) => m.userId === accessCtx.userId);
    const userRole = isOwner ? "owner" : (userMember?.role ?? (trip.visibility === "public" ? "viewer" : null));
    const canSeeMemberEmails =
      isOwner ||
      Boolean(userMember) ||
      accessCtx.userRole === "admin" ||
      accessCtx.userRole === "super_admin";
    const visibleMembers = canSeeMemberEmails
      ? members
      : members.map((member) => ({
          id: member.id,
          role: member.role,
          joinedAt: member.joinedAt,
          user: {
            id: member.user.id,
            name: member.user.name,
            image: member.user.image,
          },
        }));
    const visibleTrip = canSeeMemberEmails
      ? trip
      : {
          ...trip,
          owner: {
            id: trip.owner.id,
            name: trip.owner.name,
            image: trip.owner.image,
          },
        };

    return {
      trip: visibleTrip,
      members: visibleMembers,
      stops: itinerary.stops,
      days: itinerary.days,
      budget: budgetSummary,
      permissions: {
        canEdit: userRole === "owner" || userRole === "editor",
        canDelete: isOwner,
        canManageMembers: isOwner,
        canManageBudget: userRole === "owner" || userRole === "editor",
        userRole,
      },
    };
  }

  /**
   * Complete, atomic copy trip implementation.
   * Copies trip, stops, days, items, budget, and estimated expenses without copying private members or share tokens.
   */
  static async copyTrip(
    sourceTripId: string,
    targetUserId: string,
    options: {
      customName?: string;
      shareToken?: string;
      userRole?: string;
    } = {}
  ) {
    // 1. Fetch source trip and its explicitly authorized members.
    const [sourceTrip, sourceMembers] = await Promise.all([
      TripRepository.findTripById(sourceTripId),
      TripRepository.getTripMembers(sourceTripId),
    ]);
    if (!sourceTrip) {
      throw new Error("Source trip not found.");
    }

    const isOwner = sourceTrip.ownerId === targetUserId;
    const isMember = sourceMembers.some((member) => member.userId === targetUserId);
    const isAdmin = options.userRole === "admin" || options.userRole === "super_admin";

    if (!isOwner && !isMember && !isAdmin) {
      if (!options.shareToken) {
        throw new Error("Unauthorized: A copy-enabled share link is required.");
      }

      const activeShare = await SharingRepository.findShareByToken(options.shareToken);
      if (activeShare?.share.tripId !== sourceTripId || !activeShare.share.allowCopy) {
        throw new Error("Unauthorized: This share link does not allow copying.");
      }
    }

    // 2. Fetch all source child records
    const [sourceStops, sourceDays, sourceItems, sourceBudget, sourceExpenses] = await Promise.all([
      db.select().from(tripStops).where(eq(tripStops.tripId, sourceTripId)).orderBy(asc(tripStops.position)),
      db.select().from(tripDays).where(eq(tripDays.tripId, sourceTripId)).orderBy(asc(tripDays.dayNumber)),
      db.select().from(itineraryItems).where(eq(itineraryItems.tripId, sourceTripId)).orderBy(asc(itineraryItems.position)),
      db.select().from(tripBudgets).where(eq(tripBudgets.tripId, sourceTripId)).limit(1),
      db.select().from(expenses).where(and(eq(expenses.tripId, sourceTripId), eq(expenses.isEstimated, true))),
    ]);

    const newName = options.customName || `Copy of ${sourceTrip.name}`;
    const newSlug = this.generateSlug(newName);

    // 3. Perform atomic copy sequence
    // A. Create new trip
    const newTripResult = await db
      .insert(trips)
      .values({
        ownerId: targetUserId,
        name: newName,
        slug: newSlug,
        description: sourceTrip.description,
        coverImageUrl: sourceTrip.coverImageUrl,
        startDate: sourceTrip.startDate,
        endDate: sourceTrip.endDate,
        status: "draft",
        visibility: "private",
        currency: sourceTrip.currency,
        budgetLimit: sourceTrip.budgetLimit,
        sourceTripId: sourceTrip.id,
      })
      .returning();

    const newTrip = newTripResult[0];
    if (!newTrip) {
      throw new Error("Failed to create copied trip.");
    }

    // B. Add new owner membership
    await db.insert(tripMembers).values({
      tripId: newTrip.id,
      userId: targetUserId,
      role: "owner",
    });

    // C. Copy stops & map oldStopId -> newStopId
    const stopIdMap = new Map<string, string>();
    for (const stop of sourceStops) {
      const newStopResult = await db
        .insert(tripStops)
        .values({
          tripId: newTrip.id,
          cityId: stop.cityId,
          position: stop.position,
          arrivalDate: stop.arrivalDate,
          departureDate: stop.departureDate,
          notes: stop.notes,
        })
        .returning();

      if (newStopResult[0]) {
        stopIdMap.set(stop.id, newStopResult[0].id);
      }
    }

    // D. Copy days & map oldDayId -> newDayId (linking new stopId)
    const dayIdMap = new Map<string, string>();
    for (const day of sourceDays) {
      const mappedStopId = day.tripStopId ? stopIdMap.get(day.tripStopId) ?? null : null;
      const newDayResult = await db
        .insert(tripDays)
        .values({
          tripId: newTrip.id,
          tripStopId: mappedStopId,
          date: day.date,
          dayNumber: day.dayNumber,
          title: day.title,
          notes: day.notes,
        })
        .returning();

      if (newDayResult[0]) {
        dayIdMap.set(day.id, newDayResult[0].id);
      }
    }

    // E. Copy itinerary items (linking new dayId)
    const itemIdMap = new Map<string, string>();
    for (const item of sourceItems) {
      const mappedDayId = dayIdMap.get(item.tripDayId);
      if (!mappedDayId) continue;

      const newItemResult = await db
        .insert(itineraryItems)
        .values({
          tripId: newTrip.id,
          tripDayId: mappedDayId,
          activityId: item.activityId,
          type: item.type,
          title: item.title,
          description: item.description,
          location: item.location,
          startTime: item.startTime,
          endTime: item.endTime,
          estimatedCost: item.estimatedCost,
          currency: item.currency,
          position: item.position,
          notes: item.notes,
        })
        .returning();

      if (newItemResult[0]) {
        itemIdMap.set(item.id, newItemResult[0].id);
      }
    }

    // F. Copy budget configuration if present
    if (sourceBudget[0]) {
      const b = sourceBudget[0];
      await db.insert(tripBudgets).values({
        tripId: newTrip.id,
        totalBudget: b.totalBudget,
        currency: b.currency,
        transportBudget: b.transportBudget,
        accommodationBudget: b.accommodationBudget,
        activityBudget: b.activityBudget,
        foodBudget: b.foodBudget,
        otherBudget: b.otherBudget,
      });
    }

    // G. Copy estimated expenses (with mapped day and item ids)
    for (const exp of sourceExpenses) {
      const mappedDayId = exp.tripDayId ? dayIdMap.get(exp.tripDayId) ?? null : null;
      const mappedItemId = exp.itineraryItemId ? itemIdMap.get(exp.itineraryItemId) ?? null : null;

      await db.insert(expenses).values({
        tripId: newTrip.id,
        tripDayId: mappedDayId,
        itineraryItemId: mappedItemId,
        category: exp.category,
        title: exp.title,
        description: exp.description,
        amount: exp.amount,
        currency: exp.currency,
        expenseDate: exp.expenseDate,
        isEstimated: true,
      });
    }

    return newTrip;
  }

  /**
   * Retrieves aggregated dashboard data for the authenticated user.
   */
  static async getUserDashboard(userId: string) {
    const today = new Date().toISOString().split("T")[0];

    const [userTripsData, popularCities] = await Promise.all([
      TripRepository.findUserTrips(userId, { page: 1, limit: 10, sortBy: "startDate", sortOrder: "asc" }),
      CityRepository.findPopularCities(6),
    ]);

    const upcomingTrips = userTripsData.items.filter(
      (t) => t.startDate && t.startDate >= today && t.status !== "cancelled"
    );

    const ongoingTrips = userTripsData.items.filter((t) => t.status === "ongoing");

    return {
      upcomingTrips: upcomingTrips.slice(0, 3),
      ongoingTrips,
      recentTrips: userTripsData.items.slice(0, 5),
      totalTripsCount: userTripsData.total,
      popularCities,
    };
  }
}
