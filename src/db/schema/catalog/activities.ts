import { pgTable, text, timestamp, numeric, integer, index, uniqueIndex, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { cities } from "./cities";
import { activityCategories } from "./activity-categories";

export const activities = pgTable(
  "activities",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    cityId: text("city_id")
      .notNull()
      .references(() => cities.id, { onDelete: "restrict" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => activityCategories.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    address: text("address"),
    latitude: numeric("latitude", { precision: 9, scale: 6 }),
    longitude: numeric("longitude", { precision: 9, scale: 6 }),
    estimatedCost: numeric("estimated_cost", { precision: 12, scale: 2 })
      .default("0.00")
      .notNull(),
    currency: text("currency").default("USD").notNull(),
    durationMinutes: integer("duration_minutes").default(60).notNull(),
    popularityScore: numeric("popularity_score", { precision: 5, scale: 2 })
      .default("0.00")
      .notNull(),
    rating: numeric("rating", { precision: 3, scale: 2 })
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
    uniqueIndex("activities_city_slug_uidx").on(table.cityId, table.slug),
    index("activities_city_id_idx").on(table.cityId),
    index("activities_category_id_idx").on(table.categoryId),
    index("activities_popularity_score_idx").on(table.popularityScore),
    index("activities_rating_idx").on(table.rating),
    index("activities_estimated_cost_idx").on(table.estimatedCost),
    check("activities_cost_non_negative", sql`${table.estimatedCost} >= 0`),
    check("activities_duration_positive", sql`${table.durationMinutes} > 0`),
    check("activities_rating_range", sql`${table.rating} >= 0 AND ${table.rating} <= 5`),
  ]
);

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;
export type ActivityTable = Activity;
export type NewActivityTable = NewActivity;
