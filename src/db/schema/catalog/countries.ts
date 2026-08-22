import { pgTable, text, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";

export const countries = pgTable(
  "countries",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    iso2: text("iso2").notNull(),
    iso3: text("iso3").notNull(),
    currencyCode: text("currency_code").notNull(),
    region: text("region").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("countries_iso2_uidx").on(table.iso2),
    uniqueIndex("countries_iso3_uidx").on(table.iso3),
    index("countries_region_idx").on(table.region),
    index("countries_name_idx").on(table.name),
  ]
);

export type Country = typeof countries.$inferSelect;
export type NewCountry = typeof countries.$inferInsert;
