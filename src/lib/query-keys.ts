export const tripKeys = {
  all: ["trips"] as const,
  lists: () => [...tripKeys.all, "list"] as const,
  list: (filters?: unknown) => [...tripKeys.lists(), filters] as const,
  details: () => [...tripKeys.all, "detail"] as const,
  detail: (tripId: string) => [...tripKeys.details(), tripId] as const,
  overview: (tripId: string) => [...tripKeys.detail(tripId), "overview"] as const,
  itinerary: (tripId: string) => [...tripKeys.detail(tripId), "itinerary"] as const,
  budget: (tripId: string) => [...tripKeys.detail(tripId), "budget"] as const,
  expenses: (tripId: string, filters?: unknown) => [...tripKeys.detail(tripId), "expenses", filters] as const,
  members: (tripId: string) => [...tripKeys.detail(tripId), "members"] as const,
  shares: (tripId: string) => [...tripKeys.detail(tripId), "shares"] as const,
};

export const catalogKeys = {
  cities: ["cities"] as const,
  cityList: (filters?: unknown) => [...catalogKeys.cities, "list", filters] as const,
  cityDetail: (cityIdOrSlug: string) => [...catalogKeys.cities, "detail", cityIdOrSlug] as const,
  popularCities: () => [...catalogKeys.cities, "popular"] as const,

  activities: ["activities"] as const,
  activityList: (filters?: unknown) => [...catalogKeys.activities, "list", filters] as const,
  activityDetail: (activityIdOrSlug: string) => [...catalogKeys.activities, "detail", activityIdOrSlug] as const,
  categories: () => ["activity-categories"] as const,

  savedDestinations: ["saved-destinations"] as const,
};

export const userKeys = {
  dashboard: ["user-dashboard"] as const,
  profile: ["user-profile"] as const,
  preferences: ["user-preferences"] as const,
};

export const adminKeys = {
  analytics: ["admin-analytics"] as const,
  users: (filters?: unknown) => ["admin-users", filters] as const,
  trips: (filters?: unknown) => ["admin-trips", filters] as const,
  cities: (filters?: unknown) => ["admin-cities", filters] as const,
  activities: (filters?: unknown) => ["admin-activities", filters] as const,
};

export const sharedTripKeys = {
  detail: (token: string) => ["shared-trip", token] as const,
};
