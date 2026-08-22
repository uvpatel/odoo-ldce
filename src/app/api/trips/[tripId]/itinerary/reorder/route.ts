import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { ItineraryService } from "@/server/services/itinerary.service";
import { reorderItineraryItemsSchema } from "@/lib/validation";

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
    const validatedData = reorderItineraryItemsSchema.parse(body);

    const reordered = await ItineraryService.reorderItineraryItems(
      user.id,
      tripId,
      validatedData.tripDayId,
      validatedData.itemIds,
      user.role
    );
    return NextResponse.json(reordered);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to reorder itinerary items";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
