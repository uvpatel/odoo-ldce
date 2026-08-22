"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTripsApi } from "../api/trips.api";

export function useTrips() {
  return useQuery({
    queryKey: ["trips"],
    queryFn: fetchTripsApi,
  });
}
