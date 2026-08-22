import { relations } from "drizzle-orm/_relations";
import { trips } from "../schema/travel/trips";
import { tripMembers } from "../schema/travel/trip-members";
import { tripStops } from "../schema/travel/trip-stops";
import { tripDays } from "../schema/travel/trip-days";
import { itineraryItems } from "../schema/travel/itinerary-items";
import { tripBudgets } from "../schema/budget/trip-budgets";
import { expenses } from "../schema/budget/expenses";
import { tripShares } from "../schema/social/trip-shares";
import { user } from "../schema/auth/users";

export const tripsRelations = relations(trips, ({ one, many }) => ({
  owner: one(user, {
    fields: [trips.ownerId],
    references: [user.id],
  }),
  members: many(tripMembers),
  stops: many(tripStops),
  days: many(tripDays),
  itineraryItems: many(itineraryItems),
  budget: one(tripBudgets, {
    fields: [trips.id],
    references: [tripBudgets.tripId],
  }),
  expenses: many(expenses),
  shares: many(tripShares),
}));

export const tripMembersRelations = relations(tripMembers, ({ one }) => ({
  trip: one(trips, {
    fields: [tripMembers.tripId],
    references: [trips.id],
  }),
  user: one(user, {
    fields: [tripMembers.userId],
    references: [user.id],
  }),
}));

export const tripStopsRelations = relations(tripStops, ({ one, many }) => ({
  trip: one(trips, {
    fields: [tripStops.tripId],
    references: [trips.id],
  }),
  days: many(tripDays),
}));

export const tripDaysRelations = relations(tripDays, ({ one, many }) => ({
  trip: one(trips, {
    fields: [tripDays.tripId],
    references: [trips.id],
  }),
  stop: one(tripStops, {
    fields: [tripDays.stopId],
    references: [tripStops.id],
  }),
  items: many(itineraryItems),
}));

export const itineraryItemsRelations = relations(itineraryItems, ({ one }) => ({
  trip: one(trips, {
    fields: [itineraryItems.tripId],
    references: [trips.id],
  }),
  day: one(tripDays, {
    fields: [itineraryItems.dayId],
    references: [tripDays.id],
  }),
}));
