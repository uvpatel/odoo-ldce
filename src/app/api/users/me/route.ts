import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { UserRepository } from "@/server/repositories/user.repository";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [userRecord, preferences] = await Promise.all([
      UserRepository.findUserById(user.id),
      UserRepository.findUserPreferences(user.id),
    ]);

    return NextResponse.json({
      user: userRecord,
      preferences,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch user profile";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
