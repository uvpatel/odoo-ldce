import { relations } from "drizzle-orm/_relations";
import { user } from "../schema/auth/users";
import { session } from "../schema/auth/sessions";
import { account } from "../schema/auth/accounts";
import { trips } from "../schema/travel/trips";
import { tripMembers } from "../schema/travel/trip-members";
import { userPreferences } from "../schema/user/user-preferences";
import { savedDestinations } from "../schema/social/saved-destinations";
import { expenses } from "../schema/budget/expenses";

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  ownedTrips: many(trips),
  tripMemberships: many(tripMembers),
  preferences: one(userPreferences, {
    fields: [user.id],
    references: [userPreferences.userId],
  }),
  savedDestinations: many(savedDestinations),
  expensesPaid: many(expenses),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(user, {
    fields: [userPreferences.userId],
    references: [user.id],
  }),
}));
