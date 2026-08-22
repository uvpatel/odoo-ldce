"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tripKeys } from "@/lib/query-keys";
import { tripsApi, type TripFilters, type CreateTripPayload, type UpdateTripPayload } from "../api/trips.api";
import { toast } from "sonner";

// --- LIST TRIPS ---
export function useTrips(filters?: TripFilters) {
  return useQuery({
    queryKey: tripKeys.list(filters),
    queryFn: () => tripsApi.list(filters),
  });
}

// --- TRIP DETAILS ---
export function useTripDetails(tripId: string | undefined, shareToken?: string) {
  return useQuery({
    queryKey: tripKeys.detail(tripId ?? ""),
    queryFn: () => tripsApi.detail(tripId!, shareToken),
    enabled: !!tripId,
  });
}

// --- CREATE TRIP ---
export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTripPayload) => tripsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.lists() });
      toast.success("Trip created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create trip");
    },
  });
}

// --- UPDATE TRIP ---
export function useUpdateTrip(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTripPayload) => tripsApi.update(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: tripKeys.lists() });
      toast.success("Trip updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update trip");
    },
  });
}

// --- DELETE TRIP ---
export function useDeleteTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => tripsApi.delete(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.lists() });
      toast.success("Trip deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete trip");
    },
  });
}

// --- COPY TRIP ---
export function useCopyTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => tripsApi.copy(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.lists() });
      toast.success("Trip copied to your account!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to copy trip");
    },
  });
}
