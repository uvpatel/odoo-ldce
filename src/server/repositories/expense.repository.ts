import { db } from "@/db";
import { expenses, ExpenseTable, NewExpenseTable } from "@/db/schema/budget/expenses";
import { eq, desc, sql } from "drizzle-orm";

export class ExpenseRepository {
  async findByTripId(tripId: string) {
    return db.select().from(expenses).where(eq(expenses.tripId, tripId)).orderBy(desc(expenses.createdAt));
  }

  async findById(id: string) {
    const [expense] = await db.select().from(expenses).where(eq(expenses.id, id)).limit(1);
    return expense || null;
  }

  async create(data: NewExpenseTable) {
    const [created] = await db.insert(expenses).values(data).returning();
    return created;
  }

  async update(id: string, data: Partial<NewExpenseTable>) {
    const [updated] = await db.update(expenses).set({ ...data, updatedAt: new Date() }).where(eq(expenses.id, id)).returning();
    return updated || null;
  }

  async delete(id: string) {
    const [deleted] = await db.delete(expenses).where(eq(expenses.id, id)).returning();
    return deleted || null;
  }

  async getTotalByTrip(tripId: string) {
    const res = await db
      .select({ total: sql<string>`COALESCE(SUM(amount), 0)::text` })
      .from(expenses)
      .where(eq(expenses.tripId, tripId));
    return parseFloat(res[0]?.total || "0");
  }
}

export const expenseRepository = new ExpenseRepository();
