import { pgTable, text, timestamp, numeric, boolean, date, index, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { trips } from "../travel/trips";
import { tripDays } from "../travel/trip-days";
import { itineraryItems } from "../travel/itinerary-items";
import { expenseCategoryEnum } from "../enums";

export const expenses = pgTable(
  "expenses",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    tripId: text("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    tripDayId: text("trip_day_id").references(() => tripDays.id, {
      onDelete: "set null",
    }),
    itineraryItemId: text("itinerary_item_id").references(
      () => itineraryItems.id,
      { onDelete: "set null" }
    ),
    category: expenseCategoryEnum("category").default("other").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: text("currency").default("USD").notNull(),
    expenseDate: date("expense_date"),
    isEstimated: boolean("is_estimated").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("expenses_trip_id_idx").on(table.tripId),
    index("expenses_trip_day_id_idx").on(table.tripDayId),
    index("expenses_itinerary_item_id_idx").on(table.itineraryItemId),
    index("expenses_category_idx").on(table.category),
    index("expenses_expense_date_idx").on(table.expenseDate),
    check("expenses_amount_non_negative", sql`${table.amount} >= 0`),
  ]
);

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
