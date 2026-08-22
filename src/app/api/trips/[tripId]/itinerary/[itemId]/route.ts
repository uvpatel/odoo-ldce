import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { ItineraryService } from "@/server/services/itinerary.service";
import { updateItineraryItemSchema } from "@/lib/validation";

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
