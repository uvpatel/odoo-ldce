import { NextRequest, NextResponse } from "next/server";
import { SharingService } from "@/server/services/sharing.service";
import { TripService } from "@/server/services/trip.service";
import { ItineraryRepository } from "@/server/repositories/itinerary.repository";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const shareData = await SharingService.getShareByToken(token);
    if (!shareData) {
      return NextResponse.json({ error: "Share link is invalid, expired, or disabled" }, { status: 404 });
    }

    const { trip } = shareData;

    const fullItinerary = await ItineraryRepository.findFullTripItinerary(trip.id);

    return NextResponse.json({
      share: shareData.share,
      trip: {
        ...trip,
        owner: shareData.creator,
      },
      itinerary: fullItinerary,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load shared trip";
    const status = message.includes("invalid") || message.includes("expired") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
