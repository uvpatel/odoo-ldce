import { db } from "@/db";
import { tripStops, tripDays, itineraryItems } from "@/db/schema/travel";
import { cities, countries, activities, activityCategories } from "@/db/schema/catalog";
import { eq, and, asc, inArray } from "drizzle-orm";
import type {
  CreateTripStopInput,
  UpdateTripStopInput,
  CreateTripDayInput,
  UpdateTripDayInput,
  CreateItineraryItemInput,
  UpdateItineraryItemInput,
} from "@/lib/validation";

export class ItineraryRepository {
  // ==========================================
  // STOPS
  // ==========================================

  static async findTripStops(tripId: string) {
    return db
      .select({
        id: tripStops.id,
        tripId: tripStops.tripId,
        cityId: tripStops.cityId,
        position: tripStops.position,
        arrivalDate: tripStops.arrivalDate,
        departureDate: tripStops.departureDate,
        notes: tripStops.notes,
        createdAt: tripStops.createdAt,
        updatedAt: tripStops.updatedAt,
        city: {
          id: cities.id,
          name: cities.name,
          slug: cities.slug,
          latitude: cities.latitude,
          longitude: cities.longitude,
          timezone: cities.timezone,
          imageUrl: cities.imageUrl,
        },
        country: {
          id: countries.id,
          name: countries.name,
          iso2: countries.iso2,
        },
      })
      .from(tripStops)
      .innerJoin(cities, eq(tripStops.cityId, cities.id))
      .innerJoin(countries, eq(cities.countryId, countries.id))
      .where(eq(tripStops.tripId, tripId))
      .orderBy(asc(tripStops.position));
  }

  static async createStop(input: CreateTripStopInput) {
    const newStop = await db
      .insert(tripStops)
      .values({
        tripId: input.tripId,
        cityId: input.cityId,
        position: input.position ?? 0,
        arrivalDate: input.arrivalDate ?? null,
        departureDate: input.departureDate ?? null,
        notes: input.notes ?? null,
      })
      .returning();

    return newStop[0];
  }

  static async updateStop(stopId: string, input: UpdateTripStopInput) {
    const updateValues: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (input.position !== undefined) updateValues.position = input.position;
    if (input.arrivalDate !== undefined) updateValues.arrivalDate = input.arrivalDate;
    if (input.departureDate !== undefined) updateValues.departureDate = input.departureDate;
    if (input.notes !== undefined) updateValues.notes = input.notes;

    const updated = await db
      .update(tripStops)
      .set(updateValues)
      .where(eq(tripStops.id, stopId))
      .returning();

    return updated[0] ?? null;
  }

  static async deleteStop(stopId: string) {
    const deleted = await db.delete(tripStops).where(eq(tripStops.id, stopId)).returning();
    return deleted[0] ?? null;
  }

  static async reorderStops(tripId: string, stopIds: string[]) {
    // Reorder using sequential updates with position offset to avoid unique constraint collisions
    const updates = stopIds.map((stopId, index) =>
      db
        .update(tripStops)
        .set({ position: index, updatedAt: new Date() })
        .where(and(eq(tripStops.id, stopId), eq(tripStops.tripId, tripId)))
    );

    await Promise.all(updates);
    return this.findTripStops(tripId);
  }

  // ==========================================
  // DAYS
  // ==========================================

  static async findTripDays(tripId: string) {
    return db
      .select()
      .from(tripDays)
      .where(eq(tripDays.tripId, tripId))
      .orderBy(asc(tripDays.dayNumber));
  }

  static async findTripDayById(dayId: string) {
    const results = await db.select().from(tripDays).where(eq(tripDays.id, dayId)).limit(1);
    return results[0] ?? null;
  }

  static async createDay(input: CreateTripDayInput) {
    const newDay = await db
      .insert(tripDays)
      .values({
        tripId: input.tripId,
        tripStopId: input.tripStopId ?? null,
        date: input.date,
        dayNumber: input.dayNumber,
        title: input.title ?? null,
        notes: input.notes ?? null,
      })
      .returning();

    return newDay[0];
  }

  static async updateDay(dayId: string, input: UpdateTripDayInput) {
    const updateValues: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (input.tripStopId !== undefined) updateValues.tripStopId = input.tripStopId;
    if (input.title !== undefined) updateValues.title = input.title;
    if (input.notes !== undefined) updateValues.notes = input.notes;

    const updated = await db
      .update(tripDays)
      .set(updateValues)
      .where(eq(tripDays.id, dayId))
      .returning();

    return updated[0] ?? null;
  }

  static async deleteDay(dayId: string) {
    const deleted = await db.delete(tripDays).where(eq(tripDays.id, dayId)).returning();
    return deleted[0] ?? null;
  }

  // ==========================================
  // ITINERARY ITEMS
  // ==========================================

  static async findItineraryItemsByDay(tripDayId: string) {
    return db
      .select({
        id: itineraryItems.id,
        tripId: itineraryItems.tripId,
        tripDayId: itineraryItems.tripDayId,
        activityId: itineraryItems.activityId,
        type: itineraryItems.type,
        title: itineraryItems.title,
        description: itineraryItems.description,
        location: itineraryItems.location,
        startTime: itineraryItems.startTime,
        endTime: itineraryItems.endTime,
        estimatedCost: itineraryItems.estimatedCost,
        currency: itineraryItems.currency,
        position: itineraryItems.position,
        notes: itineraryItems.notes,
        createdAt: itineraryItems.createdAt,
        updatedAt: itineraryItems.updatedAt,
        activity: {
          id: activities.id,
          name: activities.name,
          imageUrl: activities.imageUrl,
          rating: activities.rating,
          durationMinutes: activities.durationMinutes,
        },
      })
      .from(itineraryItems)
      .leftJoin(activities, eq(itineraryItems.activityId, activities.id))
      .where(eq(itineraryItems.tripDayId, tripDayId))
      .orderBy(asc(itineraryItems.position));
  }

  static async findItineraryItemsByTrip(tripId: string) {
    return db
      .select({
        id: itineraryItems.id,
        tripId: itineraryItems.tripId,
        tripDayId: itineraryItems.tripDayId,
        activityId: itineraryItems.activityId,
        type: itineraryItems.type,
        title: itineraryItems.title,
        description: itineraryItems.description,
        location: itineraryItems.location,
        startTime: itineraryItems.startTime,
        endTime: itineraryItems.endTime,
        estimatedCost: itineraryItems.estimatedCost,
        currency: itineraryItems.currency,
        position: itineraryItems.position,
        notes: itineraryItems.notes,
        createdAt: itineraryItems.createdAt,
        updatedAt: itineraryItems.updatedAt,
        activity: {
          id: activities.id,
          name: activities.name,
          imageUrl: activities.imageUrl,
          rating: activities.rating,
          durationMinutes: activities.durationMinutes,
        },
      })
      .from(itineraryItems)
      .leftJoin(activities, eq(itineraryItems.activityId, activities.id))
      .where(eq(itineraryItems.tripId, tripId))
      .orderBy(asc(itineraryItems.position));
  }

  static async createItineraryItem(input: CreateItineraryItemInput) {
    const newItem = await db
      .insert(itineraryItems)
      .values({
        tripId: input.tripId,
        tripDayId: input.tripDayId,
        activityId: input.activityId ?? null,
        type: input.type ?? "activity",
        title: input.title,
        description: input.description ?? null,
        location: input.location ?? null,
        startTime: input.startTime ?? null,
        endTime: input.endTime ?? null,
        estimatedCost: input.estimatedCost ? String(input.estimatedCost) : "0.00",
        currency: input.currency ?? "USD",
        position: input.position ?? 0,
        notes: input.notes ?? null,
      })
      .returning();

    return newItem[0];
  }

  static async updateItineraryItem(itemId: string, input: UpdateItineraryItemInput) {
    const updateValues: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (input.activityId !== undefined) updateValues.activityId = input.activityId;
    if (input.type !== undefined) updateValues.type = input.type;
    if (input.title !== undefined) updateValues.title = input.title;
    if (input.description !== undefined) updateValues.description = input.description;
    if (input.location !== undefined) updateValues.location = input.location;
    if (input.startTime !== undefined) updateValues.startTime = input.startTime;
    if (input.endTime !== undefined) updateValues.endTime = input.endTime;
    if (input.estimatedCost !== undefined) updateValues.estimatedCost = String(input.estimatedCost);
    if (input.currency !== undefined) updateValues.currency = input.currency;
    if (input.position !== undefined) updateValues.position = input.position;
    if (input.notes !== undefined) updateValues.notes = input.notes;

    const updated = await db
      .update(itineraryItems)
      .set(updateValues)
      .where(eq(itineraryItems.id, itemId))
      .returning();

    return updated[0] ?? null;
  }

  static async deleteItineraryItem(itemId: string) {
    const deleted = await db.delete(itineraryItems).where(eq(itineraryItems.id, itemId)).returning();
    return deleted[0] ?? null;
  }

  static async reorderItineraryItems(tripDayId: string, itemIds: string[]) {
    const updates = itemIds.map((itemId, index) =>
      db
        .update(itineraryItems)
        .set({ position: index, updatedAt: new Date() })
        .where(and(eq(itineraryItems.id, itemId), eq(itineraryItems.tripDayId, tripDayId)))
    );

    await Promise.all(updates);
    return this.findItineraryItemsByDay(tripDayId);
  }

  // ==========================================
  // FULL ITINERARY AGGREGATION
  // ==========================================

  static async findFullTripItinerary(tripId: string) {
    const [stopsList, daysList, itemsList] = await Promise.all([
      this.findTripStops(tripId),
      this.findTripDays(tripId),
      this.findItineraryItemsByTrip(tripId),
    ]);

    // Group items by tripDayId
    const itemsByDay = new Map<string, typeof itemsList>();
    for (const item of itemsList) {
      const dayItems = itemsByDay.get(item.tripDayId) || [];
      dayItems.push(item);
      itemsByDay.set(item.tripDayId, dayItems);
    }

    // Attach items to days
    const daysWithItems = daysList.map((day) => ({
      ...day,
      items: itemsByDay.get(day.id) || [],
    }));

    return {
      stops: stopsList,
      days: daysWithItems,
    };
  }
}

export const itineraryRepository = ItineraryRepository;
