import { NextRequest, NextResponse } from "next/server";
import { ActivityRepository } from "@/server/repositories/activity.repository";
import { activitySearchSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const getCategories = searchParams.get("categories") === "true";

    if (getCategories) {
      const categories = await ActivityRepository.findCategories();
      return NextResponse.json(categories);
    }

    const filters = activitySearchSchema.parse({
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 20,
      cityId: searchParams.get("cityId") || undefined,
      categoryId: searchParams.get("categoryId") || undefined,
      search: searchParams.get("search") || undefined,
      minCost: searchParams.get("minCost") || undefined,
      maxCost: searchParams.get("maxCost") || undefined,
      maxDuration: searchParams.get("maxDuration") || undefined,
      minRating: searchParams.get("minRating") || undefined,
      sortBy: searchParams.get("sortBy") || "popularity",
      sortOrder: searchParams.get("sortOrder") || "desc",
    });

    const result = await ActivityRepository.findActivities(filters);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch activities";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
