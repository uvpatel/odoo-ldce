import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { ItineraryService } from "@/server/services/itinerary.service";
import { ItineraryRepository } from "@/server/repositories/itinerary.repository";
import { AuthorizationService } from "@/server/services/authorization.service";
import { createTripStopSchema } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    const user = await getCurrentUser();
    const shareToken = req.nextUrl.searchParams.get("shareToken");
    const canView = await AuthorizationService.canViewTrip({
      tripId,
      userId: user?.id,
      userRole: user?.role,
      shareToken,
    });

    if (!canView) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const stops = await ItineraryRepository.findTripStops(tripId);
    return NextResponse.json(stops);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch stops";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

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
    const validatedData = createTripStopSchema.parse({ ...body, tripId });

    const newStop = await ItineraryService.addStop(user.id, validatedData, user.role);
    return NextResponse.json(newStop, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create stop";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
