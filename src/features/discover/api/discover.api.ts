import { apiClient } from "@/lib/api-client";

export interface City {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  latitude: string;
  longitude: string;
  timezone: string;
  costIndex: number;
  popularityScore: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  country: {
    id: string;
    name: string;
    iso2: string;
    iso3?: string;
    currencyCode?: string;
    region: string;
  };
  activities?: Activity[];
}

export interface Activity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  estimatedCost: string;
  currency: string;
  durationMinutes: number | null;
  popularityScore: string;
  rating: string | null;
  createdAt: string;
  updatedAt: string;
  city: {
    id: string;
    name: string;
    slug: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  };
}

export interface ActivityCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

export interface SavedDestination {
  id: string;
  userId: string;
  cityId: string;
  createdAt: string;
  city: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    costIndex: number;
    popularityScore: string;
  };
  country: {
    id: string;
    name: string;
    iso2: string;
    region: string;
  };
}

export interface CitySearchFilters {
  page?: number;
  limit?: number;
  search?: string;
  countryId?: string;
  region?: string;
  minCost?: number;
  maxCost?: number;
  sortBy?: "popularity" | "name" | "cost";
  sortOrder?: "asc" | "desc";
}

export interface ActivitySearchFilters {
  page?: number;
  limit?: number;
  cityId?: string;
  categoryId?: string;
  search?: string;
  minCost?: number;
  maxCost?: number;
  maxDuration?: number;
  minRating?: number;
  sortBy?: "popularity" | "rating" | "cost" | "duration" | "name";
  sortOrder?: "asc" | "desc";
}

export const discoverApi = {
  // Cities
  getCities: (filters?: CitySearchFilters) =>
    apiClient.get<{ items: City[]; total: number; page: number; totalPages: number }>(
      "/api/cities",
      filters as Record<string, string | number | boolean | undefined | null>
    ),

  getPopularCities: (limit?: number) =>
    apiClient.get<City[]>("/api/cities", { popular: true, limit: limit ?? 8 }),

  getCity: (cityId: string) =>
    apiClient.get<City>(`/api/cities/${cityId}`),

  // Activities
  getActivities: (filters?: ActivitySearchFilters) =>
    apiClient.get<{ items: Activity[]; total: number; page: number; totalPages: number }>(
      "/api/activities",
      filters as Record<string, string | number | boolean | undefined | null>
    ),

  getActivity: (activityId: string) =>
    apiClient.get<Activity>(`/api/activities/${activityId}`),

  getCategories: () =>
    apiClient.get<ActivityCategory[]>("/api/activities", { categories: true }),

  // Saved destinations
  getSavedDestinations: () =>
    apiClient.get<SavedDestination[]>("/api/saved-destinations"),

  toggleSavedDestination: (cityId: string) =>
    apiClient.post<{ saved: boolean }>("/api/saved-destinations", { cityId }),

  removeSavedDestination: (cityId: string) =>
    apiClient.delete<{ success: boolean }>(`/api/saved-destinations/${cityId}`),
};
