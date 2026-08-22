import { defineRelations } from "drizzle-orm";
import { user, session, account, verification } from "../auth";
import { userPreferences } from "../user";
import { countries, cities, activityCategories, activities } from "../catalog";
import { trips, tripMembers, tripStops, tripDays, itineraryItems } from "../travel";
import { tripBudgets, expenses } from "../budget";
import { tripShares, savedDestinations } from "../social";

export const schemaTables = {
  user,
  session,
  account,
  verification,
  userPreferences,
  countries,
  cities,
  activityCategories,
  activities,
  trips,
  tripMembers,
  tripStops,
  tripDays,
  itineraryItems,
  tripBudgets,
  expenses,
  tripShares,
  savedDestinations,
};

export const schemaRelations = defineRelations(schemaTables, (r) => ({
  user: {
    sessions: r.many.session({ from: r.user.id, to: r.session.userId }),
    accounts: r.many.account({ from: r.user.id, to: r.account.userId }),
    preferences: r.one.userPreferences({ from: r.user.id, to: r.userPreferences.userId }),
    trips: r.many.trips({ from: r.user.id, to: r.trips.ownerId }),
    tripMembers: r.many.tripMembers({ from: r.user.id, to: r.tripMembers.userId }),
    savedDestinations: r.many.savedDestinations({ from: r.user.id, to: r.savedDestinations.userId }),
    createdShares: r.many.tripShares({ from: r.user.id, to: r.tripShares.createdBy }),
  },
  session: {
    user: r.one.user({ from: r.session.userId, to: r.user.id }),
  },
  account: {
    user: r.one.user({ from: r.account.userId, to: r.user.id }),
  },
  userPreferences: {
    user: r.one.user({ from: r.userPreferences.userId, to: r.user.id }),
  },
  countries: {
    cities: r.many.cities({ from: r.countries.id, to: r.cities.countryId }),
  },
  cities: {
    country: r.one.countries({ from: r.cities.countryId, to: r.countries.id }),
    activities: r.many.activities({ from: r.cities.id, to: r.activities.cityId }),
    tripStops: r.many.tripStops({ from: r.cities.id, to: r.tripStops.cityId }),
    savedByUsers: r.many.savedDestinations({ from: r.cities.id, to: r.savedDestinations.cityId }),
  },
  activityCategories: {
    activities: r.many.activities({ from: r.activityCategories.id, to: r.activities.categoryId }),
  },
  activities: {
    city: r.one.cities({ from: r.activities.cityId, to: r.cities.id }),
    category: r.one.activityCategories({ from: r.activities.categoryId, to: r.activityCategories.id }),
    itineraryItems: r.many.itineraryItems({ from: r.activities.id, to: r.itineraryItems.activityId }),
  },
  trips: {
    owner: r.one.user({ from: r.trips.ownerId, to: r.user.id }),
    sourceTrip: r.one.trips({ from: r.trips.sourceTripId, to: r.trips.id }),
    copiedTrips: r.many.trips({ from: r.trips.id, to: r.trips.sourceTripId }),
    members: r.many.tripMembers({ from: r.trips.id, to: r.tripMembers.tripId }),
    stops: r.many.tripStops({ from: r.trips.id, to: r.tripStops.tripId }),
    days: r.many.tripDays({ from: r.trips.id, to: r.tripDays.tripId }),
    itineraryItems: r.many.itineraryItems({ from: r.trips.id, to: r.itineraryItems.tripId }),
    budget: r.one.tripBudgets({ from: r.trips.id, to: r.tripBudgets.tripId }),
    expenses: r.many.expenses({ from: r.trips.id, to: r.expenses.tripId }),
    shares: r.many.tripShares({ from: r.trips.id, to: r.tripShares.tripId }),
  },
  tripMembers: {
    trip: r.one.trips({ from: r.tripMembers.tripId, to: r.trips.id }),
    user: r.one.user({ from: r.tripMembers.userId, to: r.user.id }),
    inviter: r.one.user({ from: r.tripMembers.invitedBy, to: r.user.id }),
  },
  tripStops: {
    trip: r.one.trips({ from: r.tripStops.tripId, to: r.trips.id }),
    city: r.one.cities({ from: r.tripStops.cityId, to: r.cities.id }),
    days: r.many.tripDays({ from: r.tripStops.id, to: r.tripDays.tripStopId }),
  },
  tripDays: {
    trip: r.one.trips({ from: r.tripDays.tripId, to: r.trips.id }),
    stop: r.one.tripStops({ from: r.tripDays.tripStopId, to: r.tripStops.id }),
    itineraryItems: r.many.itineraryItems({ from: r.tripDays.id, to: r.itineraryItems.tripDayId }),
    expenses: r.many.expenses({ from: r.tripDays.id, to: r.expenses.tripDayId }),
  },
  itineraryItems: {
    trip: r.one.trips({ from: r.itineraryItems.tripId, to: r.trips.id }),
    day: r.one.tripDays({ from: r.itineraryItems.tripDayId, to: r.tripDays.id }),
    activity: r.one.activities({ from: r.itineraryItems.activityId, to: r.activities.id }),
    expenses: r.many.expenses({ from: r.itineraryItems.id, to: r.expenses.itineraryItemId }),
  },
  tripBudgets: {
    trip: r.one.trips({ from: r.tripBudgets.tripId, to: r.trips.id }),
  },
  expenses: {
    trip: r.one.trips({ from: r.expenses.tripId, to: r.trips.id }),
    day: r.one.tripDays({ from: r.expenses.tripDayId, to: r.tripDays.id }),
    itineraryItem: r.one.itineraryItems({ from: r.expenses.itineraryItemId, to: r.itineraryItems.id }),
  },
  tripShares: {
    trip: r.one.trips({ from: r.tripShares.tripId, to: r.trips.id }),
    creator: r.one.user({ from: r.tripShares.createdBy, to: r.user.id }),
  },
  savedDestinations: {
    user: r.one.user({ from: r.savedDestinations.userId, to: r.user.id }),
    city: r.one.cities({ from: r.savedDestinations.cityId, to: r.cities.id }),
  },
}));
