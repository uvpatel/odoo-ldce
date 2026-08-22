import { db } from "@/db";
import { tripStops, tripDays, itineraryItems } from "@/db/schema/travel";
import { cities, countries, activities } from "@/db/schema/catalog";
import { eq, and, asc, max } from "drizzle-orm";
import type {
  CreateTripStopInput,
  UpdateTripStopInput,
  CreateTripDayInput,
  UpdateTripDayInput,
  CreateItineraryItemInput,
  UpdateItineraryItemInput,
} from "@/lib/validation";

function assertCompleteOrder(
  providedIds: string[],
  existingRows: Array<{ id: string }>,
  entityName: string
) {
  const providedIdSet = new Set(providedIds);
  const hasDuplicates = providedIdSet.size !== providedIds.length;
  const hasEveryExistingRow = existingRows.every((row) => providedIdSet.has(row.id));

  if (hasDuplicates || providedIds.length !== existingRows.length || !hasEveryExistingRow) {
    throw new Error(`Invalid ${entityName} order: IDs must match the trip's current ${entityName}.`);
  }
}

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

  static async findTripStopById(tripId: string, stopId: string) {
    const results = await db
      .select()
      .from(tripStops)
      .where(and(eq(tripStops.id, stopId), eq(tripStops.tripId, tripId)))
      .limit(1);

    return results[0] ?? null;
  }

  static async createStop(input: CreateTripStopInput) {
    let position = input.position ?? 0;

    if (position === 0) {
      const positionResult = await db
        .select({ maxPosition: max(tripStops.position) })
        .from(tripStops)
        .where(eq(tripStops.tripId, input.tripId));
      const maxPosition = positionResult[0]?.maxPosition;
      position = maxPosition === null || maxPosition === undefined ? 0 : maxPosition + 1;
    }

    const newStop = await db
      .insert(tripStops)
      .values({
        tripId: input.tripId,
        cityId: input.cityId,
        position,
        arrivalDate: input.arrivalDate ?? null,
        departureDate: input.departureDate ?? null,
        notes: input.notes ?? null,
      })
      .returning();

    return newStop[0];
  }

  static async updateStop(tripId: string, stopId: string, input: UpdateTripStopInput) {
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
      .where(and(eq(tripStops.id, stopId), eq(tripStops.tripId, tripId)))
      .returning();

    return updated[0] ?? null;
  }

  static async deleteStop(tripId: string, stopId: string) {
    const deleted = await db
      .delete(tripStops)
      .where(and(eq(tripStops.id, stopId), eq(tripStops.tripId, tripId)))
      .returning();
    return deleted[0] ?? null;
  }

  static async reorderStops(tripId: string, stopIds: string[]) {
    const existingStops = await db
      .select({ id: tripStops.id, position: tripStops.position })
      .from(tripStops)
      .where(eq(tripStops.tripId, tripId));

    assertCompleteOrder(stopIds, existingStops, "stops");

    const minimumPosition = Math.min(0, ...existingStops.map((stop) => stop.position));
    const temporaryStart = minimumPosition - stopIds.length;
    const updatedAt = new Date();
    const temporaryUpdates = stopIds.map((stopId, index) =>
      db
        .update(tripStops)
        .set({ position: temporaryStart + index, updatedAt })
        .where(and(eq(tripStops.id, stopId), eq(tripStops.tripId, tripId)))
    );
    const finalUpdates = stopIds.map((stopId, index) =>
      db
        .update(tripStops)
        .set({ position: index, updatedAt })
        .where(and(eq(tripStops.id, stopId), eq(tripStops.tripId, tripId)))
    );
    const updates = [...temporaryUpdates, ...finalUpdates];

    await db.batch(updates as [typeof updates[number], ...Array<typeof updates[number]>]);
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

  static async findTripDayById(tripId: string, dayId: string) {
    const results = await db
      .select()
      .from(tripDays)
      .where(and(eq(tripDays.id, dayId), eq(tripDays.tripId, tripId)))
      .limit(1);
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

  static async updateDay(tripId: string, dayId: string, input: UpdateTripDayInput) {
    const updateValues: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (input.tripStopId !== undefined) updateValues.tripStopId = input.tripStopId;
    if (input.title !== undefined) updateValues.title = input.title;
    if (input.notes !== undefined) updateValues.notes = input.notes;

    const updated = await db
      .update(tripDays)
      .set(updateValues)
      .where(and(eq(tripDays.id, dayId), eq(tripDays.tripId, tripId)))
      .returning();

    return updated[0] ?? null;
  }

  static async deleteDay(tripId: string, dayId: string) {
    const deleted = await db
      .delete(tripDays)
      .where(and(eq(tripDays.id, dayId), eq(tripDays.tripId, tripId)))
      .returning();
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

  static async findItineraryItemById(tripId: string, itemId: string) {
    const results = await db
      .select()
      .from(itineraryItems)
      .where(and(eq(itineraryItems.id, itemId), eq(itineraryItems.tripId, tripId)))
      .limit(1);

    return results[0] ?? null;
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
    let position = input.position ?? 0;

    if (position === 0) {
      const positionResult = await db
        .select({ maxPosition: max(itineraryItems.position) })
        .from(itineraryItems)
        .where(
          and(
            eq(itineraryItems.tripId, input.tripId),
            eq(itineraryItems.tripDayId, input.tripDayId)
          )
        );
      const maxPosition = positionResult[0]?.maxPosition;
      position = maxPosition === null || maxPosition === undefined ? 0 : maxPosition + 1;
    }

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
        position,
        notes: input.notes ?? null,
      })
      .returning();

    return newItem[0];
  }

  static async updateItineraryItem(
    tripId: string,
    itemId: string,
    input: UpdateItineraryItemInput
  ) {
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
      .where(and(eq(itineraryItems.id, itemId), eq(itineraryItems.tripId, tripId)))
      .returning();

    return updated[0] ?? null;
  }

  static async deleteItineraryItem(tripId: string, itemId: string) {
    const deleted = await db
      .delete(itineraryItems)
      .where(and(eq(itineraryItems.id, itemId), eq(itineraryItems.tripId, tripId)))
      .returning();
    return deleted[0] ?? null;
  }

  static async reorderItineraryItems(tripId: string, tripDayId: string, itemIds: string[]) {
    const existingItems = await db
      .select({ id: itineraryItems.id, position: itineraryItems.position })
      .from(itineraryItems)
      .where(
        and(
          eq(itineraryItems.tripId, tripId),
          eq(itineraryItems.tripDayId, tripDayId)
        )
      );

    assertCompleteOrder(itemIds, existingItems, "itinerary items");

    const minimumPosition = Math.min(0, ...existingItems.map((item) => item.position));
    const temporaryStart = minimumPosition - itemIds.length;
    const updatedAt = new Date();
    const temporaryUpdates = itemIds.map((itemId, index) =>
      db
        .update(itineraryItems)
        .set({ position: temporaryStart + index, updatedAt })
        .where(
          and(
            eq(itineraryItems.id, itemId),
            eq(itineraryItems.tripId, tripId),
            eq(itineraryItems.tripDayId, tripDayId)
          )
        )
    );
    const finalUpdates = itemIds.map((itemId, index) =>
      db
        .update(itineraryItems)
        .set({ position: index, updatedAt })
        .where(
          and(
            eq(itineraryItems.id, itemId),
            eq(itineraryItems.tripId, tripId),
            eq(itineraryItems.tripDayId, tripDayId)
          )
        )
    );
    const updates = [...temporaryUpdates, ...finalUpdates];

    await db.batch(updates as [typeof updates[number], ...Array<typeof updates[number]>]);
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
