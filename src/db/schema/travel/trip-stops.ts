import { pgTable, text, timestamp, integer, date, index, uniqueIndex, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { trips } from "./trips";
import { cities } from "../catalog/cities";

export const tripStops = pgTable(
  "trip_stops",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    tripId: text("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    cityId: text("city_id")
      .notNull()
      .references(() => cities.id, { onDelete: "restrict" }),
    position: integer("position").notNull(),
    arrivalDate: date("arrival_date"),
    departureDate: date("departure_date"),
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
    uniqueIndex("trip_stops_trip_position_uidx").on(table.tripId, table.position),
    index("trip_stops_trip_id_idx").on(table.tripId),
    index("trip_stops_city_id_idx").on(table.cityId),
    check(
      "trip_stops_date_range_check",
      sql`${table.arrivalDate} IS NULL OR ${table.departureDate} IS NULL OR ${table.arrivalDate} <= ${table.departureDate}`
    ),
  ]
);

export type TripStop = typeof tripStops.$inferSelect;
export type NewTripStop = typeof tripStops.$inferInsert;
