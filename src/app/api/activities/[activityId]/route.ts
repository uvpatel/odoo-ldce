import { NextRequest, NextResponse } from "next/server";
import { ActivityRepository } from "@/server/repositories/activity.repository";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ activityId: string }> }
) {
  try {
    const { activityId } = await params;
    const activity = await ActivityRepository.findActivityById(activityId);

    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    return NextResponse.json(activity);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch activity details";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
