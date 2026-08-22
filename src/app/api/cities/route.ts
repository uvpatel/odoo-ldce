import { NextRequest, NextResponse } from "next/server";
import { CityRepository } from "@/server/repositories/city.repository";
import { citySearchSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isPopular = searchParams.get("popular") === "true";

    if (isPopular) {
      const limit = Number(searchParams.get("limit")) || 8;
      const popularCities = await CityRepository.findPopularCities(limit);
      return NextResponse.json(popularCities);
    }

    const filters = citySearchSchema.parse({
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 20,
      search: searchParams.get("search") || undefined,
      countryId: searchParams.get("countryId") || undefined,
      region: searchParams.get("region") || undefined,
      minCost: searchParams.get("minCost") || undefined,
      maxCost: searchParams.get("maxCost") || undefined,
      sortBy: searchParams.get("sortBy") || "popularity",
      sortOrder: searchParams.get("sortOrder") || "desc",
    });

    const result = await CityRepository.findCities(filters);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch cities";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
