import { NextRequest, NextResponse } from "next/server";
import { TripService } from "@/server/services/trip.service";
import { tripFilterSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = tripFilterSchema.parse({
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 12,
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sortBy") || "updatedAt",
      sortOrder: searchParams.get("sortOrder") || "desc",
      visibility: "public",
    });

    const result = await TripService.getPublicTrips(filters);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load public trips";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
