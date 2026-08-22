"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "../api/dashboard.api";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
  });
}
