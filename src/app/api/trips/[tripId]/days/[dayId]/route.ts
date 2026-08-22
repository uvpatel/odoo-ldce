import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { ItineraryService } from "@/server/services/itinerary.service";
import { updateTripDaySchema } from "@/lib/validation";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; dayId: string }> }
) {
  try {
    const { tripId, dayId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateTripDaySchema.parse(body);

    const updated = await ItineraryService.updateDay(user.id, tripId, dayId, validatedData, user.role);
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update trip day";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; dayId: string }> }
) {
  try {
    const { tripId, dayId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await ItineraryService.deleteDay(user.id, tripId, dayId, user.role);
    return NextResponse.json({ success: true, day: deleted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete trip day";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
