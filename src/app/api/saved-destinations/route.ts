import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { UserRepository } from "@/server/repositories/user.repository";
import { toggleSavedDestinationSchema } from "@/lib/validation";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = await UserRepository.findSavedDestinations(user.id);
    return NextResponse.json(saved);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch saved destinations";
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
    const { cityId } = toggleSavedDestinationSchema.parse(body);

    const result = await UserRepository.toggleSavedDestination(user.id, cityId);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to toggle saved destination";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
