"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tripKeys } from "@/lib/query-keys";
import { itineraryApi, type UpdateItineraryItemPayload, type CreateItineraryItemPayload } from "../api/itinerary.api";
import { toast } from "sonner";

/** React Query keys for itinerary */
export const itineraryKeys = {
  fullItinerary: (tripId: string) => tripKeys.itinerary(tripId),
  item: (tripId: string, itemId: string) => [...tripKeys.itinerary(tripId), "item", itemId] as const,
};

/** Fetch the full trip itinerary (days + items) */
export function useFullItinerary(tripId: string, shareToken?: string) {
  return useQuery({
    queryKey: itineraryKeys.fullItinerary(tripId),
    queryFn: () => itineraryApi.getFullItinerary(tripId, shareToken),
    enabled: !!tripId,
  });
}

/** Fetch a single itinerary item */
export function useItineraryItem(tripId: string, itemId: string) {
  return useQuery({
    queryKey: itineraryKeys.item(tripId, itemId),
    queryFn: () => itineraryApi.getItem(tripId, itemId),
    enabled: !!tripId && !!itemId,
  });
}

/** Create a new itinerary item */
export function useCreateItineraryItem(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItineraryItemPayload) => itineraryApi.createItem(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: itineraryKeys.fullItinerary(tripId) });
      toast.success("Activity added!");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to add activity"),
  });
}

/** Update an itinerary item */
export function useUpdateItineraryItem(tripId: string, itemId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateItineraryItemPayload) => itineraryApi.updateItem(tripId, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: itineraryKeys.fullItinerary(tripId) });
      queryClient.invalidateQueries({ queryKey: itineraryKeys.item(tripId, itemId) });
      toast.success("Activity updated!");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update activity"),
  });
}

/** Delete an itinerary item */
export function useDeleteItineraryItem(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => itineraryApi.deleteItem(tripId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: itineraryKeys.fullItinerary(tripId) });
      toast.info("Activity removed.");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to remove activity"),
  });
}
