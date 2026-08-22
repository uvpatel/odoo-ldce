import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { TripRepository } from "@/server/repositories/trip.repository";
import { AuthorizationService } from "@/server/services/authorization.service";
import { updateTripMemberRoleSchema } from "@/lib/validation";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; memberId: string }> }
) {
  try {
    const { tripId, memberId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const canManage = await AuthorizationService.canManageMembers(user.id, tripId, user.role);
    if (!canManage) {
      return NextResponse.json({ error: "Unauthorized: Cannot change member roles" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = updateTripMemberRoleSchema.parse(body);
    const targetMember = await TripRepository.findTripMemberById(tripId, memberId);
    if (!targetMember) {
      return NextResponse.json({ error: "Trip member not found" }, { status: 404 });
    }
    if (targetMember.role === "owner" || validatedData.role === "owner") {
      return NextResponse.json(
        { error: "Trip ownership cannot be changed from the member role endpoint" },
        { status: 400 }
      );
    }

    const updated = await TripRepository.updateMemberRoleById(
      tripId,
      memberId,
      validatedData.role
    );
    if (!updated) {
      return NextResponse.json({ error: "Trip member not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update member role";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; memberId: string }> }
) {
  try {
    const { tripId, memberId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [canManage, targetMember] = await Promise.all([
      AuthorizationService.canManageMembers(user.id, tripId, user.role),
      TripRepository.findTripMemberById(tripId, memberId),
    ]);

    if (!targetMember) {
      return NextResponse.json({ error: "Trip member not found" }, { status: 404 });
    }

    const isSelfLeaving = user.id === targetMember.userId;

    if (!canManage && !isSelfLeaving) {
      return NextResponse.json({ error: "Unauthorized: Cannot remove member" }, { status: 403 });
    }

    if (targetMember.role === "owner") {
      return NextResponse.json(
        { error: "The trip owner cannot be removed" },
        { status: 400 }
      );
    }

    const deleted = await TripRepository.removeMemberById(tripId, memberId);
    if (!deleted) {
      return NextResponse.json({ error: "Trip member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, member: deleted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to remove member";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
