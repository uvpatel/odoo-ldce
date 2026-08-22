import { pgTable, text, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "../auth/users";
import { trips } from "./trips";
import { tripMemberRoleEnum } from "../enums";

export const tripMembers = pgTable(
  "trip_members",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    tripId: text("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: tripMemberRoleEnum("role").default("editor").notNull(),
    invitedBy: text("invited_by").references(() => user.id, { onDelete: "set null" }),
    joinedAt: timestamp("joined_at", { withTimezone: true, mode: "date" })
      .defaultNow()
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
    uniqueIndex("trip_members_trip_user_uidx").on(table.tripId, table.userId),
    index("trip_members_trip_id_idx").on(table.tripId),
    index("trip_members_user_id_idx").on(table.userId),
  ]
);

export type TripMember = typeof tripMembers.$inferSelect;
export type NewTripMember = typeof tripMembers.$inferInsert;
export type TripMemberTable = TripMember;
export type NewTripMemberTable = NewTripMember;
