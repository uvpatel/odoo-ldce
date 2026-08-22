import { pgTable, text, timestamp, numeric, uniqueIndex, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { trips } from "../travel/trips";

export const tripBudgets = pgTable(
  "trip_budgets",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    tripId: text("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    totalBudget: numeric("total_budget", { precision: 12, scale: 2 })
      .default("0.00")
      .notNull(),
    currency: text("currency").default("USD").notNull(),
    transportBudget: numeric("transport_budget", { precision: 12, scale: 2 })
      .default("0.00")
      .notNull(),
    accommodationBudget: numeric("accommodation_budget", { precision: 12, scale: 2 })
      .default("0.00")
      .notNull(),
    activityBudget: numeric("activity_budget", { precision: 12, scale: 2 })
      .default("0.00")
      .notNull(),
    foodBudget: numeric("food_budget", { precision: 12, scale: 2 })
      .default("0.00")
      .notNull(),
    otherBudget: numeric("other_budget", { precision: 12, scale: 2 })
      .default("0.00")
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("trip_budgets_trip_id_uidx").on(table.tripId),
    check("trip_budgets_total_non_negative", sql`${table.totalBudget} >= 0`),
    check("trip_budgets_transport_non_negative", sql`${table.transportBudget} >= 0`),
    check("trip_budgets_accommodation_non_negative", sql`${table.accommodationBudget} >= 0`),
    check("trip_budgets_activity_non_negative", sql`${table.activityBudget} >= 0`),
    check("trip_budgets_food_non_negative", sql`${table.foodBudget} >= 0`),
    check("trip_budgets_other_non_negative", sql`${table.otherBudget} >= 0`),
  ]
);

export type TripBudget = typeof tripBudgets.$inferSelect;
export type NewTripBudget = typeof tripBudgets.$inferInsert;
