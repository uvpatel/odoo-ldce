import { NextRequest, NextResponse } from "next/server";
import { CityRepository } from "@/server/repositories/city.repository";
import { ActivityRepository } from "@/server/repositories/activity.repository";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cityId: string }> }
) {
  try {
    const { cityId } = await params;

    let city = await CityRepository.findCityById(cityId);
    if (!city) {
      city = await CityRepository.findCityBySlug(cityId);
    }

    if (!city) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    // Fetch activities for this city
    const activitiesResult = await ActivityRepository.findActivities({
      cityId: city.id,
      page: 1,
      limit: 12,
      sortBy: "popularity",
      sortOrder: "desc",
    });

    return NextResponse.json({
      ...city,
      activities: activitiesResult.items,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch city details";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
