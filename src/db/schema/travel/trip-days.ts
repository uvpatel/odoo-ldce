import { pgTable, text, timestamp, integer, date, index, uniqueIndex } from "drizzle-orm/pg-core";
import { trips } from "./trips";
import { tripStops } from "./trip-stops";

export const tripDays = pgTable(
  "trip_days",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    tripId: text("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    tripStopId: text("trip_stop_id").references(() => tripStops.id, {
      onDelete: "set null",
    }),
    date: date("date").notNull(),
    dayNumber: integer("day_number").notNull(),
    title: text("title"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("trip_days_trip_date_uidx").on(table.tripId, table.date),
    uniqueIndex("trip_days_trip_day_number_uidx").on(table.tripId, table.dayNumber),
    index("trip_days_trip_id_idx").on(table.tripId),
    index("trip_days_trip_stop_id_idx").on(table.tripStopId),
    index("trip_days_date_idx").on(table.date),
  ]
);

export type TripDay = typeof tripDays.$inferSelect;
export type NewTripDay = typeof tripDays.$inferInsert;
