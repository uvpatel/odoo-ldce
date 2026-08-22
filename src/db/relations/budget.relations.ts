import { relations } from "drizzle-orm/_relations";
import { trips } from "../schema/travel/trips";
import { tripBudgets } from "../schema/budget/trip-budgets";
import { expenses } from "../schema/budget/expenses";
import { user } from "../schema/auth/users";

export const tripBudgetsRelations = relations(tripBudgets, ({ one }) => ({
  trip: one(trips, {
    fields: [tripBudgets.tripId],
    references: [trips.id],
  }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  trip: one(trips, {
    fields: [expenses.tripId],
    references: [trips.id],
  }),
  paidBy: one(user, {
    fields: [expenses.paidById],
    references: [user.id],
  }),
}));
