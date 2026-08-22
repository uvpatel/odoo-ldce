import { apiClient } from "@/lib/api-client";
import type { ItineraryItem, TripDay } from "@/features/trips/api/trips.api";

export type { ItineraryItem, TripDay };

export interface FullItinerary {
  stops: {
    id: string;
    tripId: string;
    cityId: string;
    position: number;
    arrivalDate: string | null;
    departureDate: string | null;
    city: { id: string; name: string; imageUrl: string | null };
    country: { id: string; name: string; iso2: string };
  }[];
  days: (TripDay & { items: ItineraryItem[] })[];
}

export interface UpdateItineraryItemPayload {
  type?: "activity" | "transport" | "accommodation" | "meal" | "custom";
  title?: string;
  description?: string | null;
  location?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  estimatedCost?: number;
  currency?: string;
  notes?: string | null;
}

export interface CreateItineraryItemPayload {
  tripDayId: string;
  type: "activity" | "transport" | "accommodation" | "meal" | "custom";
  title: string;
  location?: string;
  startTime?: string;
  estimatedCost?: number;
  notes?: string;
}

export const itineraryApi = {
  /** Get full itinerary (days + items) for a trip */
  getFullItinerary: (tripId: string, shareToken?: string) =>
    apiClient.get<FullItinerary>(
      `/api/trips/${tripId}/itinerary`,
      shareToken ? { shareToken } : undefined
    ),

  /** Get a single itinerary item by ID */
  getItem: (tripId: string, itemId: string) =>
    apiClient.get<ItineraryItem>(`/api/trips/${tripId}/itinerary/${itemId}`),

  /** Create a new itinerary item */
  createItem: (tripId: string, data: CreateItineraryItemPayload) =>
    apiClient.post<ItineraryItem>(`/api/trips/${tripId}/itinerary`, {
      ...data,
      tripId,
      estimatedCost: data.estimatedCost ?? 0,
    }),

  /** Update an itinerary item (full or partial) */
  updateItem: (tripId: string, itemId: string, data: UpdateItineraryItemPayload) =>
    apiClient.patch<ItineraryItem>(`/api/trips/${tripId}/itinerary/${itemId}`, data),

  /** Delete an itinerary item */
  deleteItem: (tripId: string, itemId: string) =>
    apiClient.delete<{ success: boolean; item: ItineraryItem }>(
      `/api/trips/${tripId}/itinerary/${itemId}`
    ),

  /** Reorder items within a day */
  reorderItems: (tripId: string, tripDayId: string, itemIds: string[]) =>
    apiClient.post<ItineraryItem[]>(
      `/api/trips/${tripId}/itinerary/reorder`,
      { tripDayId, itemIds }
    ),
};
