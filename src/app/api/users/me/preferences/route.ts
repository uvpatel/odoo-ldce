import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { UserRepository } from "@/server/repositories/user.repository";
import { updateUserPreferencesSchema } from "@/lib/validation";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences = await UserRepository.findUserPreferences(user.id);
    return NextResponse.json(preferences);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch preferences";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateUserPreferencesSchema.parse(body);

    const updated = await UserRepository.updateUserPreferences(user.id, validatedData);
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update preferences";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
