import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { ItineraryService } from "@/server/services/itinerary.service";
import { reorderTripStopsSchema } from "@/lib/validation";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = reorderTripStopsSchema.parse({ ...body, tripId });

    const stops = await ItineraryService.reorderStops(
      user.id,
      tripId,
      validatedData.stopIds,
      user.role
    );
    return NextResponse.json(stops);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to reorder stops";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
