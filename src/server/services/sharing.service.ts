import { sharingRepository } from "../repositories/sharing.repository";
import { tripRepository } from "../repositories/trip.repository";
import { generateShareToken } from "@/lib/share-token";
import { authorizationService } from "./authorization.service";

export class SharingService {
  async getOrCreateShareLink(userId: string, tripId: string, isPublic: boolean = true, allowCopy: boolean = true) {
    const isOwner = await authorizationService.isTripOwner(userId, tripId);
    if (!isOwner) throw new Error("Only the owner can manage share links");

    const existing = await sharingRepository.findByTripId(tripId);
    if (existing) return existing;

    const token = generateShareToken(24);
    const id = `shr_${Date.now()}`;
    return sharingRepository.create({
      id,
      tripId,
      shareToken: token,
      isPublic,
      allowCopy,
      createdById: userId,
    });
  }

  async getSharedTrip(token: string) {
    const record = await sharingRepository.findByToken(token);
    if (!record) return null;

    await sharingRepository.incrementViews(token);
    return record;
  }
}

export const sharingService = new SharingService();
