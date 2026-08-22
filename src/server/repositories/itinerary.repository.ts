import { db } from "@/db";
import { tripStops, TripStopTable, NewTripStopTable } from "@/db/schema/travel/trip-stops";
import { tripDays, TripDayTable, NewTripDayTable } from "@/db/schema/travel/trip-days";
import { itineraryItems, ItineraryItemTable, NewItineraryItemTable } from "@/db/schema/travel/itinerary-items";
import { eq, asc } from "drizzle-orm";

export class ItineraryRepository {
  // Stops
  async getStopsByTrip(tripId: string) {
    return db.select().from(tripStops).where(eq(tripStops.tripId, tripId)).orderBy(asc(tripStops.orderIndex));
  }

  async createStop(data: NewTripStopTable) {
    const [stop] = await db.insert(tripStops).values(data).returning();
    return stop;
  }

  async updateStop(id: string, data: Partial<NewTripStopTable>) {
    const [updated] = await db.update(tripStops).set({ ...data, updatedAt: new Date() }).where(eq(tripStops.id, id)).returning();
    return updated || null;
  }

  async deleteStop(id: string) {
    const [deleted] = await db.delete(tripStops).where(eq(tripStops.id, id)).returning();
    return deleted || null;
  }

  // Days
  async getDaysByTrip(tripId: string) {
    return db.select().from(tripDays).where(eq(tripDays.tripId, tripId)).orderBy(asc(tripDays.dayNumber));
  }

  async createDay(data: NewTripDayTable) {
    const [day] = await db.insert(tripDays).values(data).returning();
    return day;
  }

  async updateDay(id: string, data: Partial<NewTripDayTable>) {
    const [updated] = await db.update(tripDays).set({ ...data, updatedAt: new Date() }).where(eq(tripDays.id, id)).returning();
    return updated || null;
  }

  async deleteDay(id: string) {
    const [deleted] = await db.delete(tripDays).where(eq(tripDays.id, id)).returning();
    return deleted || null;
  }

  // Itinerary Items
  async getItemsByDay(dayId: string) {
    return db.select().from(itineraryItems).where(eq(itineraryItems.dayId, dayId)).orderBy(asc(itineraryItems.orderIndex));
  }

  async getItemsByTrip(tripId: string) {
    return db.select().from(itineraryItems).where(eq(itineraryItems.tripId, tripId)).orderBy(asc(itineraryItems.orderIndex));
  }

  async createItem(data: NewItineraryItemTable) {
    const [item] = await db.insert(itineraryItems).values(data).returning();
    return item;
  }

  async updateItem(id: string, data: Partial<NewItineraryItemTable>) {
    const [updated] = await db.update(itineraryItems).set({ ...data, updatedAt: new Date() }).where(eq(itineraryItems.id, id)).returning();
    return updated || null;
  }

  async deleteItem(id: string) {
    const [deleted] = await db.delete(itineraryItems).where(eq(itineraryItems.id, id)).returning();
    return deleted || null;
  }
}

export const itineraryRepository = new ItineraryRepository();
