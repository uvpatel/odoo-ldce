import { SharingRepository } from "../repositories/sharing.repository";
import { AuthorizationService } from "./authorization.service";
import type { CreateTripShareInput, UpdateTripShareInput } from "@/lib/validation";

export class SharingService {
  static async createShareLink(userId: string, input: CreateTripShareInput, userRole?: string) {
    const canManage = await AuthorizationService.canManageMembers(userId, input.tripId, userRole);
    if (!canManage) {
      throw new Error("Unauthorized: Only trip owners can generate share links.");
    }
    return SharingRepository.createShare(input.tripId, userId, input);
  }

  static async getShareByToken(token: string) {
    const shareData = await SharingRepository.findShareByToken(token);
    if (!shareData) {
      throw new Error("Share link is invalid, expired, or deactivated.");
    }
    return shareData;
  }

  static async getSharesByTrip(userId: string, tripId: string, userRole?: string) {
    const canManage = await AuthorizationService.canManageMembers(userId, tripId, userRole);
    if (!canManage) {
      throw new Error("Unauthorized: Cannot view share links.");
    }
    return SharingRepository.findSharesByTrip(tripId);
  }

  static async updateShare(
    userId: string,
    tripId: string,
    shareId: string,
    input: UpdateTripShareInput,
    userRole?: string
  ) {
    const canManage = await AuthorizationService.canManageMembers(userId, tripId, userRole);
    if (!canManage) {
      throw new Error("Unauthorized: Cannot update share link.");
    }
    return SharingRepository.updateShare(shareId, input);
  }

  static async revokeShare(
    userId: string,
    tripId: string,
    shareId: string,
    userRole?: string
  ) {
    const canManage = await AuthorizationService.canManageMembers(userId, tripId, userRole);
    if (!canManage) {
      throw new Error("Unauthorized: Cannot revoke share link.");
    }
    return SharingRepository.updateShare(shareId, { isActive: false });
  }
}
