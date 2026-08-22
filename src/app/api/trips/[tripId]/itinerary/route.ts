import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { ItineraryRepository } from "@/server/repositories/itinerary.repository";
import { ItineraryService } from "@/server/services/itinerary.service";
import { AuthorizationService } from "@/server/services/authorization.service";
import { createItineraryItemSchema } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const shareToken = searchParams.get("shareToken");

    const canView = await AuthorizationService.canViewTrip({
      tripId,
      userId: user?.id,
      userRole: user?.role,
      shareToken,
    });

    if (!canView) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const fullItinerary = await ItineraryRepository.findFullTripItinerary(tripId);
    return NextResponse.json(fullItinerary);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch itinerary";
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
    const validatedData = createItineraryItemSchema.parse({
      ...body,
      tripId,
    });

    const item = await ItineraryService.addItineraryItem(user.id, validatedData, user.role);
    return NextResponse.json(item, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to add itinerary item";
    const status = message.includes("Unauthorized") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
