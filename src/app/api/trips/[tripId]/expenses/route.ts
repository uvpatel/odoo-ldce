import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { BudgetService } from "@/server/services/budget.service";
import { createExpenseSchema, expenseFilterSchema } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filters = expenseFilterSchema.parse({
      tripId,
      tripDayId: searchParams.get("tripDayId") || undefined,
      category: searchParams.get("category") || undefined,
      isEstimated: searchParams.get("isEstimated") ? searchParams.get("isEstimated") === "true" : undefined,
    });

    const expensesList = await BudgetService.getExpenses(user.id, filters, user.role);
    return NextResponse.json(expensesList);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch expenses";
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
    const validatedData = createExpenseSchema.parse({ ...body, tripId });

    const newExpense = await BudgetService.addExpense(user.id, validatedData, user.role);
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to add expense";
    const status = message.includes("Unauthorized") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
