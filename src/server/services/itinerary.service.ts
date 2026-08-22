import { ItineraryRepository } from "../repositories/itinerary.repository";
import { AuthorizationService } from "./authorization.service";
import type {
  CreateTripStopInput,
  UpdateTripStopInput,
  CreateTripDayInput,
  UpdateTripDayInput,
  CreateItineraryItemInput,
  UpdateItineraryItemInput,
} from "@/lib/validation";

export class ItineraryService {
  static async addStop(userId: string, input: CreateTripStopInput, userRole?: string) {
    const canEdit = await AuthorizationService.canEditTrip(userId, input.tripId, userRole);
    if (!canEdit) {
      throw new Error("Unauthorized: Cannot modify trip stops.");
    }
    return ItineraryRepository.createStop(input);
  }

  static async updateStop(
    userId: string,
    tripId: string,
    stopId: string,
    input: UpdateTripStopInput,
    userRole?: string
  ) {
    const canEdit = await AuthorizationService.canEditTrip(userId, tripId, userRole);
    if (!canEdit) {
      throw new Error("Unauthorized: Cannot modify trip stops.");
    }
    return ItineraryRepository.updateStop(tripId, stopId, input);
  }

  static async deleteStop(userId: string, tripId: string, stopId: string, userRole?: string) {
    const canEdit = await AuthorizationService.canEditTrip(userId, tripId, userRole);
    if (!canEdit) {
      throw new Error("Unauthorized: Cannot delete trip stop.");
    }
    return ItineraryRepository.deleteStop(tripId, stopId);
  }

  static async reorderStops(userId: string, tripId: string, stopIds: string[], userRole?: string) {
    const canEdit = await AuthorizationService.canEditTrip(userId, tripId, userRole);
    if (!canEdit) {
      throw new Error("Unauthorized: Cannot reorder trip stops.");
    }
    return ItineraryRepository.reorderStops(tripId, stopIds);
  }

  static async addDay(userId: string, input: CreateTripDayInput, userRole?: string) {
    const canEdit = await AuthorizationService.canEditTrip(userId, input.tripId, userRole);
    if (!canEdit) {
      throw new Error("Unauthorized: Cannot modify trip days.");
    }

    if (
      input.tripStopId &&
      !(await ItineraryRepository.findTripStopById(input.tripId, input.tripStopId))
    ) {
      throw new Error("Invalid trip stop: The stop does not belong to this trip.");
    }

    return ItineraryRepository.createDay(input);
  }

  static async updateDay(
    userId: string,
    tripId: string,
    dayId: string,
    input: UpdateTripDayInput,
    userRole?: string
  ) {
    const canEdit = await AuthorizationService.canEditTrip(userId, tripId, userRole);
    if (!canEdit) {
      throw new Error("Unauthorized: Cannot modify trip days.");
    }

    if (
      input.tripStopId &&
      !(await ItineraryRepository.findTripStopById(tripId, input.tripStopId))
    ) {
      throw new Error("Invalid trip stop: The stop does not belong to this trip.");
    }

    return ItineraryRepository.updateDay(tripId, dayId, input);
  }

  static async deleteDay(userId: string, tripId: string, dayId: string, userRole?: string) {
    const canEdit = await AuthorizationService.canEditTrip(userId, tripId, userRole);
    if (!canEdit) {
      throw new Error("Unauthorized: Cannot delete trip day.");
    }
    return ItineraryRepository.deleteDay(tripId, dayId);
  }

  static async addItineraryItem(
    userId: string,
    input: CreateItineraryItemInput,
    userRole?: string
  ) {
    const canEdit = await AuthorizationService.canEditTrip(userId, input.tripId, userRole);
    if (!canEdit) {
      throw new Error("Unauthorized: Cannot add itinerary items.");
    }

    if (!(await ItineraryRepository.findTripDayById(input.tripId, input.tripDayId))) {
      throw new Error("Invalid trip day: The day does not belong to this trip.");
    }

    return ItineraryRepository.createItineraryItem(input);
  }

  static async updateItineraryItem(
    userId: string,
    tripId: string,
    itemId: string,
    input: UpdateItineraryItemInput,
    userRole?: string
  ) {
    const canEdit = await AuthorizationService.canEditTrip(userId, tripId, userRole);
    if (!canEdit) {
      throw new Error("Unauthorized: Cannot edit itinerary item.");
    }
    return ItineraryRepository.updateItineraryItem(tripId, itemId, input);
  }

  static async deleteItineraryItem(
    userId: string,
    tripId: string,
    itemId: string,
    userRole?: string
  ) {
    const canEdit = await AuthorizationService.canEditTrip(userId, tripId, userRole);
    if (!canEdit) {
      throw new Error("Unauthorized: Cannot delete itinerary item.");
    }
    return ItineraryRepository.deleteItineraryItem(tripId, itemId);
  }

  static async reorderItineraryItems(
    userId: string,
    tripId: string,
    tripDayId: string,
    itemIds: string[],
    userRole?: string
  ) {
    const canEdit = await AuthorizationService.canEditTrip(userId, tripId, userRole);
    if (!canEdit) {
      throw new Error("Unauthorized: Cannot reorder itinerary items.");
    }

    if (!(await ItineraryRepository.findTripDayById(tripId, tripDayId))) {
      throw new Error("Invalid trip day: The day does not belong to this trip.");
    }

    return ItineraryRepository.reorderItineraryItems(tripId, tripDayId, itemIds);
  }
}
