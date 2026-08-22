"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { catalogKeys } from "@/lib/query-keys";
import {
  discoverApi,
  type CitySearchFilters,
  type ActivitySearchFilters,
} from "../api/discover.api";
import { toast } from "sonner";

// --- POPULAR CITIES ---
export function usePopularCities(limit?: number) {
  return useQuery({
    queryKey: catalogKeys.popularCities(),
    queryFn: () => discoverApi.getPopularCities(limit),
  });
}

// --- CITY LIST ---
export function useCities(filters?: CitySearchFilters) {
  return useQuery({
    queryKey: catalogKeys.cityList(filters),
    queryFn: () => discoverApi.getCities(filters),
  });
}

// --- CITY DETAIL ---
export function useCity(cityId: string | undefined) {
  return useQuery({
    queryKey: catalogKeys.cityDetail(cityId ?? ""),
    queryFn: () => discoverApi.getCity(cityId!),
    enabled: !!cityId,
  });
}

// --- ACTIVITIES LIST ---
export function useActivities(filters?: ActivitySearchFilters) {
  return useQuery({
    queryKey: catalogKeys.activityList(filters),
    queryFn: () => discoverApi.getActivities(filters),
  });
}

// --- ACTIVITY DETAIL ---
export function useActivity(activityId: string | undefined) {
  return useQuery({
    queryKey: catalogKeys.activityDetail(activityId ?? ""),
    queryFn: () => discoverApi.getActivity(activityId!),
    enabled: !!activityId,
  });
}

// --- ACTIVITY CATEGORIES ---
export function useActivityCategories() {
  return useQuery({
    queryKey: catalogKeys.categories(),
    queryFn: () => discoverApi.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 min - categories rarely change
  });
}

// --- SAVED DESTINATIONS ---
export function useSavedDestinations() {
  return useQuery({
    queryKey: catalogKeys.savedDestinations,
    queryFn: () => discoverApi.getSavedDestinations(),
  });
}

// --- TOGGLE SAVE ---
export function useToggleSaveDestination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cityId: string) => discoverApi.toggleSavedDestination(cityId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.savedDestinations });
      toast.success(data.saved ? "Destination saved!" : "Destination removed from saved");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update saved destinations");
    },
  });
}

// --- REMOVE SAVED DESTINATION ---
export function useRemoveSavedDestination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cityId: string) => discoverApi.removeSavedDestination(cityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.savedDestinations });
      toast.success("Destination removed");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove destination");
    },
  });
}
