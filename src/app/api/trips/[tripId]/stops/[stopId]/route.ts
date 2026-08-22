import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { ItineraryService } from "@/server/services/itinerary.service";
import { updateTripStopSchema } from "@/lib/validation";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; stopId: string }> }
) {
  try {
    const { tripId, stopId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateTripStopSchema.parse(body);

    const updated = await ItineraryService.updateStop(user.id, tripId, stopId, validatedData, user.role);
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update stop";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; stopId: string }> }
) {
  try {
    const { tripId, stopId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await ItineraryService.deleteStop(user.id, tripId, stopId, user.role);
    return NextResponse.json({ success: true, stop: deleted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete stop";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
