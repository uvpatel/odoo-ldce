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
    let shareToken: string | undefined;
    try {
      const body: unknown = await req.json();
      if (body && typeof body === "object") {
        const payload = body as Record<string, unknown>;
        customName = typeof payload.name === "string" ? payload.name : undefined;
        shareToken = typeof payload.shareToken === "string" ? payload.shareToken : undefined;
      }
    } catch {
      // Body optional
    }

    const copiedTrip = await TripService.copyTrip(tripId, user.id, {
      customName,
      shareToken,
      userRole: user.role,
    });
    return NextResponse.json(copiedTrip, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to copy trip";
    const status = message.includes("Unauthorized") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
