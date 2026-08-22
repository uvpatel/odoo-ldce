import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { TripService } from "@/server/services/trip.service";
import { updateTripSchema } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const shareToken = searchParams.get("shareToken");

    const tripDetails = await TripService.getTripDetails(tripId, {
      userId: user?.id,
      userRole: user?.role,
      shareToken,
    });

    return NextResponse.json(tripDetails);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch trip details";
    const status = message.includes("Unauthorized") ? 403 : message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(
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
    const validatedData = updateTripSchema.parse(body);

    const updated = await TripService.updateTrip(user.id, tripId, validatedData, user.role);
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update trip";
    const status = message.includes("Unauthorized") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await TripService.deleteTrip(user.id, tripId, user.role);
    return NextResponse.json({ success: true, trip: deleted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete trip";
    const status = message.includes("Unauthorized") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
