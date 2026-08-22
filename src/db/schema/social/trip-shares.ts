import { pgTable, text, timestamp, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { trips } from "../travel/trips";
import { user } from "../auth/users";

export const tripShares = pgTable(
  "trip_shares",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    tripId: text("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    shareToken: text("share_token").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    allowCopy: boolean("allow_copy").default(true).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("trip_shares_share_token_uidx").on(table.shareToken),
    index("trip_shares_trip_id_idx").on(table.tripId),
    index("trip_shares_created_by_idx").on(table.createdBy),
  ]
);

export type TripShare = typeof tripShares.$inferSelect;
export type NewTripShare = typeof tripShares.$inferInsert;
