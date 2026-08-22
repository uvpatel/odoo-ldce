import { relations } from "drizzle-orm/_relations";
import { countries } from "../schema/catalog/countries";
import { cities } from "../schema/catalog/cities";
import { activityCategories } from "../schema/catalog/activity-categories";
import { activities } from "../schema/catalog/activities";
import { savedDestinations } from "../schema/social/saved-destinations";
import { user } from "../schema/auth/users";

export const countriesRelations = relations(countries, ({ many }) => ({
  cities: many(cities),
}));

export const citiesRelations = relations(cities, ({ one, many }) => ({
  country: one(countries, {
    fields: [cities.countryId],
    references: [countries.id],
  }),
  activities: many(activities),
  savedBy: many(savedDestinations),
}));

export const activityCategoriesRelations = relations(activityCategories, ({ many }) => ({
  activities: many(activities),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  city: one(cities, {
    fields: [activities.cityId],
    references: [cities.id],
  }),
  category: one(activityCategories, {
    fields: [activities.categoryId],
    references: [activityCategories.id],
  }),
}));

export const savedDestinationsRelations = relations(savedDestinations, ({ one }) => ({
  user: one(user, {
    fields: [savedDestinations.userId],
    references: [user.id],
  }),
  city: one(cities, {
    fields: [savedDestinations.cityId],
    references: [cities.id],
  }),
}));
