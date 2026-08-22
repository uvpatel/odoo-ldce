import { pgTable, text, timestamp, date, numeric, index, uniqueIndex, check, foreignKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "../auth/users";
import { tripStatusEnum, tripVisibilityEnum } from "../enums";

export const trips = pgTable(
  "trips",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    coverImageUrl: text("cover_image_url"),
    startDate: date("start_date"),
    endDate: date("end_date"),
    status: tripStatusEnum("status").default("draft").notNull(),
    visibility: tripVisibilityEnum("visibility").default("private").notNull(),
    currency: text("currency").default("USD").notNull(),
    budgetLimit: numeric("budget_limit", { precision: 12, scale: 2 }),
    sourceTripId: text("source_trip_id"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    foreignKey({
      columns: [table.sourceTripId],
      foreignColumns: [table.id],
      name: "trips_source_trip_id_fkey",
    }).onDelete("set null"),
    uniqueIndex("trips_owner_slug_uidx").on(table.ownerId, table.slug),
    index("trips_owner_id_idx").on(table.ownerId),
    index("trips_status_idx").on(table.status),
    index("trips_visibility_idx").on(table.visibility),
    index("trips_start_date_idx").on(table.startDate),
    index("trips_end_date_idx").on(table.endDate),
    index("trips_deleted_at_idx").on(table.deletedAt),
    check(
      "trips_date_range_check",
      sql`${table.startDate} IS NULL OR ${table.endDate} IS NULL OR ${table.startDate} <= ${table.endDate}`
    ),
    check(
      "trips_budget_limit_check",
      sql`${table.budgetLimit} IS NULL OR ${table.budgetLimit} >= 0`
    ),
  ]
);

export type Trip = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;
