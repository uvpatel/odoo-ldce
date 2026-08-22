import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { AnalyticsRepository } from "@/server/repositories/analytics.repository";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "admin" && user.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const analytics = await AnalyticsRepository.getPlatformAnalytics();
    return NextResponse.json(analytics);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch analytics";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
