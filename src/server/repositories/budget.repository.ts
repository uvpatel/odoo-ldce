import { db } from "@/db";
import { tripBudgets, expenses } from "@/db/schema/budget";
import { trips } from "@/db/schema/travel";
import { eq, and, sql, desc, asc } from "drizzle-orm";
import type {
  UpsertTripBudgetInput,
  CreateExpenseInput,
  UpdateExpenseInput,
  ExpenseFilterInput,
} from "@/lib/validation";

export class BudgetRepository {
  static async findTripBudget(tripId: string) {
    const results = await db
      .select()
      .from(tripBudgets)
      .where(eq(tripBudgets.tripId, tripId))
      .limit(1);

    return results[0] ?? null;
  }

  static async upsertTripBudget(input: UpsertTripBudgetInput) {
    const values = {
      tripId: input.tripId,
      totalBudget: String(input.totalBudget),
      currency: input.currency ?? "USD",
      transportBudget: String(input.transportBudget ?? 0),
      accommodationBudget: String(input.accommodationBudget ?? 0),
      activityBudget: String(input.activityBudget ?? 0),
      foodBudget: String(input.foodBudget ?? 0),
      otherBudget: String(input.otherBudget ?? 0),
      updatedAt: new Date(),
    };

    const existing = await this.findTripBudget(input.tripId);

    if (existing) {
      const updated = await db
        .update(tripBudgets)
        .set(values)
        .where(eq(tripBudgets.tripId, input.tripId))
        .returning();
      return updated[0];
    } else {
      const created = await db.insert(tripBudgets).values(values).returning();
      return created[0];
    }
  }

  static async findExpenses(filters: ExpenseFilterInput) {
    const conditions = [eq(expenses.tripId, filters.tripId)];

    if (filters.tripDayId) {
      conditions.push(eq(expenses.tripDayId, filters.tripDayId));
    }

    if (filters.category) {
      conditions.push(eq(expenses.category, filters.category));
    }

    if (filters.isEstimated !== undefined) {
      conditions.push(eq(expenses.isEstimated, filters.isEstimated));
    }

    return db
      .select()
      .from(expenses)
      .where(and(...conditions))
      .orderBy(desc(expenses.expenseDate), desc(expenses.createdAt));
  }

  static async findExpenseById(expenseId: string) {
    const results = await db.select().from(expenses).where(eq(expenses.id, expenseId)).limit(1);
    return results[0] ?? null;
  }

  static async createExpense(input: CreateExpenseInput) {
    const newExpense = await db
      .insert(expenses)
      .values({
        tripId: input.tripId,
        tripDayId: input.tripDayId ?? null,
        itineraryItemId: input.itineraryItemId ?? null,
        category: input.category ?? "other",
        title: input.title,
        description: input.description ?? null,
        amount: String(input.amount),
        currency: input.currency ?? "USD",
        expenseDate: input.expenseDate ?? null,
        isEstimated: input.isEstimated ?? false,
      })
      .returning();

    return newExpense[0];
  }

  static async updateExpense(expenseId: string, input: UpdateExpenseInput) {
    const updateValues: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (input.tripDayId !== undefined) updateValues.tripDayId = input.tripDayId;
    if (input.itineraryItemId !== undefined) updateValues.itineraryItemId = input.itineraryItemId;
    if (input.category !== undefined) updateValues.category = input.category;
    if (input.title !== undefined) updateValues.title = input.title;
    if (input.description !== undefined) updateValues.description = input.description;
    if (input.amount !== undefined) updateValues.amount = String(input.amount);
    if (input.currency !== undefined) updateValues.currency = input.currency;
    if (input.expenseDate !== undefined) updateValues.expenseDate = input.expenseDate;
    if (input.isEstimated !== undefined) updateValues.isEstimated = input.isEstimated;

    const updated = await db
      .update(expenses)
      .set(updateValues)
      .where(eq(expenses.id, expenseId))
      .returning();

    return updated[0] ?? null;
  }

  static async deleteExpense(expenseId: string) {
    const deleted = await db.delete(expenses).where(eq(expenses.id, expenseId)).returning();
    return deleted[0] ?? null;
  }

  static async calculateBudgetSummary(tripId: string) {
    const [budgetConfig, allExpenses] = await Promise.all([
      this.findTripBudget(tripId),
      db.select().from(expenses).where(eq(expenses.tripId, tripId)),
    ]);

    const totalBudget = budgetConfig ? Number(budgetConfig.totalBudget) : 0;
    const currency = budgetConfig?.currency || "USD";

    let totalSpent = 0;
    let actualSpent = 0;
    let estimatedSpent = 0;

    const breakdown: Record<string, { planned: number; spent: number; remaining: number }> = {
      transport: {
        planned: budgetConfig ? Number(budgetConfig.transportBudget) : 0,
        spent: 0,
        remaining: 0,
      },
      accommodation: {
        planned: budgetConfig ? Number(budgetConfig.accommodationBudget) : 0,
        spent: 0,
        remaining: 0,
      },
      activity: {
        planned: budgetConfig ? Number(budgetConfig.activityBudget) : 0,
        spent: 0,
        remaining: 0,
      },
      food: {
        planned: budgetConfig ? Number(budgetConfig.foodBudget) : 0,
        spent: 0,
        remaining: 0,
      },
      shopping: {
        planned: 0,
        spent: 0,
        remaining: 0,
      },
      other: {
        planned: budgetConfig ? Number(budgetConfig.otherBudget) : 0,
        spent: 0,
        remaining: 0,
      },
    };

    for (const exp of allExpenses) {
      const amt = Number(exp.amount);
      totalSpent += amt;

      if (exp.isEstimated) {
        estimatedSpent += amt;
      } else {
        actualSpent += amt;
      }

      if (breakdown[exp.category]) {
        breakdown[exp.category].spent += amt;
      }
    }

    for (const cat in breakdown) {
      breakdown[cat].remaining = breakdown[cat].planned - breakdown[cat].spent;
    }

    const remainingBudget = totalBudget - totalSpent;
    const percentageUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 10000) / 100 : 0;

    return {
      tripId,
      totalBudget,
      currency,
      totalSpent: Math.round(totalSpent * 100) / 100,
      actualSpent: Math.round(actualSpent * 100) / 100,
      estimatedSpent: Math.round(estimatedSpent * 100) / 100,
      remainingBudget: Math.round(remainingBudget * 100) / 100,
      percentageUsed,
      breakdown,
      expensesCount: allExpenses.length,
    };
  }
}

export const budgetRepository = BudgetRepository;
