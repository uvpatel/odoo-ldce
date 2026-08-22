import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { BudgetService } from "@/server/services/budget.service";
import { updateExpenseSchema } from "@/lib/validation";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; expenseId: string }> }
) {
  try {
    const { tripId, expenseId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateExpenseSchema.parse(body);

    const updated = await BudgetService.updateExpense(user.id, tripId, expenseId, validatedData, user.role);
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update expense";
    const status = message.includes("Unauthorized") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; expenseId: string }> }
) {
  try {
    const { tripId, expenseId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await BudgetService.deleteExpense(user.id, tripId, expenseId, user.role);
    return NextResponse.json({ success: true, expense: deleted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete expense";
    const status = message.includes("Unauthorized") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
