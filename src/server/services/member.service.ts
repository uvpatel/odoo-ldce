import { memberRepository } from "../repositories/member.repository";
import { userRepository } from "../repositories/user.repository";
import { authorizationService } from "./authorization.service";

export class MemberService {
  async getTripMembers(tripId: string) {
    return memberRepository.findByTripId(tripId);
  }

  async inviteMember(inviterId: string, tripId: string, email: string, role: "editor" | "viewer" = "editor") {
    const isOwner = await authorizationService.isTripOwner(inviterId, tripId);
    if (!isOwner) throw new Error("Only the owner can invite new members");

    const targetUser = await userRepository.findByEmail(email);
    if (!targetUser) throw new Error("User with that email was not found");

    const existing = await memberRepository.findMember(tripId, targetUser.id);
    if (existing) throw new Error("User is already a member of this trip");

    const id = `mbr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    return memberRepository.addMember({
      id,
      tripId,
      userId: targetUser.id,
      role,
      invitedBy: inviterId,
    });
  }

  async updateMemberRole(userId: string, tripId: string, memberId: string, role: "editor" | "viewer") {
    const isOwner = await authorizationService.isTripOwner(userId, tripId);
    if (!isOwner) throw new Error("Only the owner can update member roles");
    return memberRepository.updateRole(memberId, role);
  }

  async removeMember(userId: string, tripId: string, memberId: string) {
    const isOwner = await authorizationService.isTripOwner(userId, tripId);
    if (!isOwner) throw new Error("Only the owner can remove members");
    return memberRepository.removeMember(memberId);
  }
}

export const memberService = new MemberService();
