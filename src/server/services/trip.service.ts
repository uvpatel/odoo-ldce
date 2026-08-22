import { tripRepository } from "../repositories/trip.repository";
import { itineraryRepository } from "../repositories/itinerary.repository";
import { budgetRepository } from "../repositories/budget.repository";
import { memberRepository } from "../repositories/member.repository";
import { authorizationService } from "./authorization.service";
import { NewTripTable } from "@/db/schema/travel/trips";

export class TripService {
  async getTrip(tripId: string, userId?: string) {
    const trip = await tripRepository.findById(tripId);
    if (!trip) return null;

    if (userId) {
      const canAccess = await authorizationService.canAccessTrip(userId, tripId);
      if (!canAccess && trip.visibility !== "public") return null;
    }

    const stops = await itineraryRepository.getStopsByTrip(tripId);
    const days = await itineraryRepository.getDaysByTrip(tripId);
    const budget = await budgetRepository.findByTripId(tripId);
    const members = await memberRepository.findByTripId(tripId);

    return {
      ...trip,
      stops,
      days,
      budget,
      members,
    };
  }

  async getUserTrips(userId: string, limit?: number, offset?: number) {
    return tripRepository.findUserTrips(userId, limit, offset);
  }

  async createTrip(userId: string, data: Omit<NewTripTable, "id" | "ownerId">) {
    const tripId = `trip_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const trip = await tripRepository.create({
      ...data,
      id: tripId,
      ownerId: userId,
    });

    // Add owner as a member
    await memberRepository.addMember({
      id: `mbr_${Date.now()}`,
      tripId,
      userId,
      role: "owner",
    });

    // Create initial budget
    if (data.budgetTotal) {
      await budgetRepository.upsert(tripId, data.budgetTotal, data.currency || "USD");
    }

    return trip;
  }

  async updateTrip(userId: string, tripId: string, data: Partial<NewTripTable>) {
    const canEdit = await authorizationService.canEditTrip(userId, tripId);
    if (!canEdit) throw new Error("Unauthorized to edit trip");
    return tripRepository.update(tripId, data);
  }

  async deleteTrip(userId: string, tripId: string) {
    const isOwner = await authorizationService.isTripOwner(userId, tripId);
    if (!isOwner) throw new Error("Only the trip owner can delete this trip");
    return tripRepository.delete(tripId);
  }

  async duplicateTrip(userId: string, sourceTripId: string) {
    const source = await this.getTrip(sourceTripId);
    if (!source) throw new Error("Trip not found");

    const newTripId = `trip_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const duplicatedTrip = await tripRepository.create({
      id: newTripId,
      ownerId: userId,
      title: `${source.title} (Copy)`,
      description: source.description,
      destination: source.destination,
      startDate: source.startDate,
      endDate: source.endDate,
      coverImage: source.coverImage,
      visibility: "private",
      status: "planning",
      budgetTotal: source.budgetTotal,
      currency: source.currency,
      isArchived: false,
    });

    return duplicatedTrip;
  }
}

export const tripService = new TripService();
