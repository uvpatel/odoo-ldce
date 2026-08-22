import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { TripService } from "@/server/services/trip.service";
import { createTripSchema, tripFilterSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parsedFilters = tripFilterSchema.parse({
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 20,
      status: searchParams.get("status") || undefined,
      visibility: searchParams.get("visibility") || undefined,
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: searchParams.get("sortOrder") || "desc",
    });

    const trips = await TripService.getUserTrips(user.id, parsedFilters);
    return NextResponse.json(trips);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch trips";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createTripSchema.parse(body);

    const trip = await TripService.createTrip(user.id, validatedData);
    return NextResponse.json(trip, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create trip";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
