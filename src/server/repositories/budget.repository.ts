import { db } from "@/db";
import { tripBudgets, TripBudgetTable, NewTripBudgetTable } from "@/db/schema/budget/trip-budgets";
import { eq } from "drizzle-orm";

export class BudgetRepository {
  async findByTripId(tripId: string) {
    const [budget] = await db.select().from(tripBudgets).where(eq(tripBudgets.tripId, tripId)).limit(1);
    return budget || null;
  }

  async upsert(tripId: string, totalBudget: string, currency: string = "USD", notes?: string) {
    const [existing] = await db.select().from(tripBudgets).where(eq(tripBudgets.tripId, tripId)).limit(1);
    if (existing) {
      const [updated] = await db
        .update(tripBudgets)
        .set({ totalBudget, currency, notes, updatedAt: new Date() })
        .where(eq(tripBudgets.tripId, tripId))
        .returning();
      return updated;
    }
    const [created] = await db
      .insert(tripBudgets)
      .values({ id: `bgt_${tripId}`, tripId, totalBudget, currency, notes })
      .returning();
    return created;
  }
}

export const budgetRepository = new BudgetRepository();
