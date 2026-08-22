import { pgTable, text, timestamp, numeric, integer, index, uniqueIndex, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { countries } from "./countries";

export const cities = pgTable(
  "cities",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    countryId: text("country_id")
      .notNull()
      .references(() => countries.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    latitude: numeric("latitude", { precision: 9, scale: 6 }).notNull(),
    longitude: numeric("longitude", { precision: 9, scale: 6 }).notNull(),
    timezone: text("timezone").notNull(),
    costIndex: integer("cost_index").default(3).notNull(),
    popularityScore: numeric("popularity_score", { precision: 5, scale: 2 })
      .default("0.00")
      .notNull(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("cities_slug_uidx").on(table.slug),
    index("cities_country_id_idx").on(table.countryId),
    index("cities_name_idx").on(table.name),
    index("cities_popularity_score_idx").on(table.popularityScore),
    check("cities_cost_index_check", sql`${table.costIndex} >= 1 AND ${table.costIndex} <= 5`),
  ]
);

export type City = typeof cities.$inferSelect;
export type NewCity = typeof cities.$inferInsert;
export type CityTable = City;
export type NewCityTable = NewCity;
