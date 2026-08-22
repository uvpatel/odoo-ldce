import { pgTable, text, timestamp, integer, numeric, index, uniqueIndex, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { trips } from "./trips";
import { tripDays } from "./trip-days";
import { activities } from "../catalog/activities";
import { itineraryItemTypeEnum } from "../enums";

export const itineraryItems = pgTable(
  "itinerary_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    tripId: text("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    tripDayId: text("trip_day_id")
      .notNull()
      .references(() => tripDays.id, { onDelete: "cascade" }),
    activityId: text("activity_id").references(() => activities.id, {
      onDelete: "set null",
    }),
    type: itineraryItemTypeEnum("type").default("activity").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    location: text("location"),
    startTime: text("start_time"),
    endTime: text("end_time"),
    estimatedCost: numeric("estimated_cost", { precision: 12, scale: 2 })
      .default("0.00")
      .notNull(),
    currency: text("currency").default("USD").notNull(),
    position: integer("position").notNull(),
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
    uniqueIndex("itinerary_items_day_position_uidx").on(table.tripDayId, table.position),
    index("itinerary_items_trip_id_idx").on(table.tripId),
    index("itinerary_items_trip_day_id_idx").on(table.tripDayId),
    index("itinerary_items_activity_id_idx").on(table.activityId),
    check("itinerary_items_cost_non_negative", sql`${table.estimatedCost} >= 0`),
  ]
);

export type ItineraryItem = typeof itineraryItems.$inferSelect;
export type NewItineraryItem = typeof itineraryItems.$inferInsert;
