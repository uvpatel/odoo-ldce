import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { TripRepository } from "@/server/repositories/trip.repository";
import { AuthorizationService } from "@/server/services/authorization.service";
import { db } from "@/db";
import { user as userTable } from "@/db/schema/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const inviteMemberSchema = z.object({
  email: z.string().email().optional(),
  userId: z.string().optional(),
  role: z.enum(["editor", "viewer"]).default("editor"),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    const user = await getCurrentUser();

    const canView = await AuthorizationService.canViewTrip({
      tripId,
      userId: user?.id,
      userRole: user?.role,
    });

    if (!canView) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const members = await TripRepository.getTripMembers(tripId);
    return NextResponse.json(members);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch members";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const canManage = await AuthorizationService.canManageMembers(currentUser.id, tripId, currentUser.role);
    if (!canManage) {
      return NextResponse.json({ error: "Unauthorized: Only trip owners can invite members" }, { status: 403 });
    }

    const body = await req.json();
    const data = inviteMemberSchema.parse(body);

    let targetUserId = data.userId;

    if (!targetUserId && data.email) {
      const found = await db
        .select({ id: userTable.id })
        .from(userTable)
        .where(eq(userTable.email, data.email.toLowerCase().trim()))
        .limit(1);

      if (!found[0]) {
        return NextResponse.json({ error: `No user found with email ${data.email}. Make sure they have an account.` }, { status: 404 });
      }
      targetUserId = found[0].id;
    }

    if (!targetUserId) {
      return NextResponse.json({ error: "User ID or valid email is required" }, { status: 400 });
    }

    const newMember = await TripRepository.addMember(
      tripId,
      targetUserId,
      data.role,
      currentUser.id
    );

    return NextResponse.json(newMember, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to invite member";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
