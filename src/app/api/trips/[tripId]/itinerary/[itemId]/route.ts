import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { ItineraryService } from "@/server/services/itinerary.service";
import { ItineraryRepository } from "@/server/repositories/itinerary.repository";
import { AuthorizationService } from "@/server/services/authorization.service";
import { updateItineraryItemSchema } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; itemId: string }> }
) {
  try {
    const { tripId, itemId } = await params;
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

    // Fetch all items for this trip and find the one we need
    const allItems = await ItineraryRepository.findItineraryItemsByTrip(tripId);
    const item = allItems.find((i) => i.id === itemId);

    if (!item) {
      return NextResponse.json({ error: "Itinerary item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch itinerary item";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; itemId: string }> }
) {
  try {
    const { tripId, itemId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateItineraryItemSchema.parse(body);

    const updated = await ItineraryService.updateItineraryItem(user.id, tripId, itemId, validatedData, user.role);
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update item";
    const status = message.includes("Unauthorized") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

/** PATCH is an alias for PUT — supports partial updates from the frontend */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; itemId: string }> }
) {
  return PUT(req, { params });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; itemId: string }> }
) {
  try {
    const { tripId, itemId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await ItineraryService.deleteItineraryItem(user.id, tripId, itemId, user.role);
    return NextResponse.json({ success: true, item: deleted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete item";
    const status = message.includes("Unauthorized") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
