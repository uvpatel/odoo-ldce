import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { BudgetService } from "@/server/services/budget.service";
import { upsertTripBudgetSchema } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const shareToken = searchParams.get("shareToken");

    const summary = await BudgetService.getBudgetSummary(tripId, {
      userId: user?.id,
      userRole: user?.role,
      shareToken,
    });
    return NextResponse.json(summary);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch budget";
    const status = message.includes("Unauthorized") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = upsertTripBudgetSchema.parse({ ...body, tripId });

    const budget = await BudgetService.setTripBudget(user.id, validatedData, user.role);
    return NextResponse.json(budget);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update budget";
    const status = message.includes("Unauthorized") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
