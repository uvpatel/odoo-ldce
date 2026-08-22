import { apiClient } from "@/lib/api-client";

export interface TripFilters {
  page?: number;
  limit?: number;
  status?: string;
  visibility?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateTripPayload {
  name: string;
  description?: string | null;
  coverImageUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  visibility?: "private" | "friends" | "public";
  currency?: string;
  budgetLimit?: number | null;
}

export interface UpdateTripPayload extends Partial<CreateTripPayload> {
  status?: "draft" | "planned" | "ongoing" | "completed" | "cancelled";
}

export const tripsApi = {
  list: (filters?: TripFilters) =>
    apiClient.get<{ items: Trip[]; total: number; page: number; totalPages: number }>(
      "/api/trips",
      filters as Record<string, string | number | boolean | undefined | null>
    ),

  detail: (tripId: string, shareToken?: string) =>
    apiClient.get<TripDetails>(`/api/trips/${tripId}`, shareToken ? { shareToken } : undefined),

  create: (data: CreateTripPayload) =>
    apiClient.post<Trip>("/api/trips", data),

  update: (tripId: string, data: UpdateTripPayload) =>
    apiClient.put<Trip>(`/api/trips/${tripId}`, data),

  delete: (tripId: string) =>
    apiClient.delete<{ success: boolean }>(`/api/trips/${tripId}`),

  copy: (tripId: string) =>
    apiClient.post<Trip>(`/api/trips/${tripId}/copy`),
};

export interface Trip {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  status: "draft" | "planned" | "ongoing" | "completed" | "cancelled";
  visibility: "private" | "friends" | "public";
  currency: string;
  budgetLimit: string | null;
  sourceTripId: string | null;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export interface TripStop {
  id: string;
  tripId: string;
  cityId: string;
  position: number;
  arrivalDate: string | null;
  departureDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  city: {
    id: string;
    name: string;
    slug: string;
    latitude: string;
    longitude: string;
    timezone: string;
    imageUrl: string | null;
  };
  country: {
    id: string;
    name: string;
    iso2: string;
  };
}

export interface TripDay {
  id: string;
  tripId: string;
  tripStopId: string | null;
  date: string;
  dayNumber: number;
  title: string | null;
  notes: string | null;
  items: ItineraryItem[];
}

export interface ItineraryItem {
  id: string;
  tripId: string;
  tripDayId: string;
  activityId: string | null;
  type: "activity" | "transport" | "accommodation" | "meal" | "custom";
  title: string;
  description: string | null;
  location: string | null;
  startTime: string | null;
  endTime: string | null;
  estimatedCost: string;
  currency: string;
  position: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  activity?: {
    id: string;
    name: string;
    imageUrl: string | null;
    rating: string | null;
    durationMinutes: number | null;
  } | null;
}

export interface TripMember {
  id: string;
  tripId: string;
  userId: string;
  role: "owner" | "editor" | "viewer";
  joinedAt: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export interface BudgetSummary {
  budget: {
    id: string;
    tripId: string;
    totalBudget: string;
    currency: string;
    transportBudget: string;
    accommodationBudget: string;
    activityBudget: string;
    foodBudget: string;
    otherBudget: string;
  } | null;
  totalEstimated: number;
  totalActual: number;
  remaining: number;
  percentageUsed: number;
  categoryBreakdown: {
    category: string;
    estimated: number;
    actual: number;
  }[];
}

export interface TripDetails {
  trip: Trip;
  members: TripMember[];
  stops: TripStop[];
  days: TripDay[];
  budget: BudgetSummary;
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canManageMembers: boolean;
    canManageBudget: boolean;
    userRole: string | null;
  };
}
