import { pgTable, text, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "../auth/users";
import { cities } from "../catalog/cities";

export const savedDestinations = pgTable(
  "saved_destinations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    cityId: text("city_id")
      .notNull()
      .references(() => cities.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("saved_destinations_user_city_uidx").on(table.userId, table.cityId),
    index("saved_destinations_user_id_idx").on(table.userId),
    index("saved_destinations_city_id_idx").on(table.cityId),
  ]
);

export type SavedDestination = typeof savedDestinations.$inferSelect;
export type NewSavedDestination = typeof savedDestinations.$inferInsert;
