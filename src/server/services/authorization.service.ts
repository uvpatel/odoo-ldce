import { tripRepository } from "../repositories/trip.repository";
import { memberRepository } from "../repositories/member.repository";
import { UserRole } from "@/types/auth";

export class AuthorizationService {
  async canAccessTrip(userId: string, tripId: string): Promise<boolean> {
    const trip = await tripRepository.findById(tripId);
    if (!trip) return false;
    if (trip.ownerId === userId) return true;
    if (trip.visibility === "public") return true;

    const member = await memberRepository.findMember(tripId, userId);
    return !!member;
  }

  async canEditTrip(userId: string, tripId: string): Promise<boolean> {
    const trip = await tripRepository.findById(tripId);
    if (!trip) return false;
    if (trip.ownerId === userId) return true;

    const member = await memberRepository.findMember(tripId, userId);
    return member?.role === "owner" || member?.role === "editor";
  }

  async isTripOwner(userId: string, tripId: string): Promise<boolean> {
    const trip = await tripRepository.findById(tripId);
    return trip?.ownerId === userId;
  }

  isAdmin(role: UserRole | string): boolean {
    return role === "admin" || role === "super_admin";
  }
}

export const authorizationService = new AuthorizationService();
