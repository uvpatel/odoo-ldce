import { itineraryRepository } from "../repositories/itinerary.repository";
import { authorizationService } from "./authorization.service";
import { NewTripStopTable } from "@/db/schema/travel/trip-stops";
import { NewTripDayTable } from "@/db/schema/travel/trip-days";
import { NewItineraryItemTable } from "@/db/schema/travel/itinerary-items";

export class ItineraryService {
  async getFullItinerary(tripId: string) {
    const stops = await itineraryRepository.getStopsByTrip(tripId);
    const days = await itineraryRepository.getDaysByTrip(tripId);
    const items = await itineraryRepository.getItemsByTrip(tripId);

    return {
      stops,
      days: days.map((day) => ({
        ...day,
        items: items.filter((item) => item.dayId === day.id),
      })),
    };
  }

  // Stops
  async addStop(userId: string, tripId: string, data: Omit<NewTripStopTable, "id" | "tripId">) {
    const canEdit = await authorizationService.canEditTrip(userId, tripId);
    if (!canEdit) throw new Error("Unauthorized to edit trip");

    const id = `stp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    return itineraryRepository.createStop({ ...data, id, tripId });
  }

  async removeStop(userId: string, tripId: string, stopId: string) {
    const canEdit = await authorizationService.canEditTrip(userId, tripId);
    if (!canEdit) throw new Error("Unauthorized to edit trip");
    return itineraryRepository.deleteStop(stopId);
  }

  // Days
  async addDay(userId: string, tripId: string, data: Omit<NewTripDayTable, "id" | "tripId">) {
    const canEdit = await authorizationService.canEditTrip(userId, tripId);
    if (!canEdit) throw new Error("Unauthorized to edit trip");

    const id = `day_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    return itineraryRepository.createDay({ ...data, id, tripId });
  }

  // Items
  async addItem(userId: string, tripId: string, data: Omit<NewItineraryItemTable, "id" | "tripId">) {
    const canEdit = await authorizationService.canEditTrip(userId, tripId);
    if (!canEdit) throw new Error("Unauthorized to edit trip");

    const id = `itm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    return itineraryRepository.createItem({ ...data, id, tripId });
  }

  async updateItem(userId: string, tripId: string, itemId: string, data: Partial<NewItineraryItemTable>) {
    const canEdit = await authorizationService.canEditTrip(userId, tripId);
    if (!canEdit) throw new Error("Unauthorized to edit trip");
    return itineraryRepository.updateItem(itemId, data);
  }

  async removeItem(userId: string, tripId: string, itemId: string) {
    const canEdit = await authorizationService.canEditTrip(userId, tripId);
    if (!canEdit) throw new Error("Unauthorized to edit trip");
    return itineraryRepository.deleteItem(itemId);
  }
}

export const itineraryService = new ItineraryService();
