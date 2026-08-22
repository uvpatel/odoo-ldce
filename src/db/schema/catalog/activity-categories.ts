import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const activityCategories = pgTable(
  "activity_categories",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    icon: text("icon"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("activity_categories_slug_uidx").on(table.slug),
  ]
);

export type ActivityCategory = typeof activityCategories.$inferSelect;
export type NewActivityCategory = typeof activityCategories.$inferInsert;
