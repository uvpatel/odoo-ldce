import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { TripService } from "@/server/services/trip.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in to copy this trip" }, { status: 401 });
    }

    let customName: string | undefined;
    try {
      const body = await req.json();
      customName = body.name;
    } catch {
      // Body optional
    }

    const copiedTrip = await TripService.copyTrip(tripId, user.id, customName);
    return NextResponse.json(copiedTrip, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to copy trip";
    const status = message.includes("Unauthorized") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
