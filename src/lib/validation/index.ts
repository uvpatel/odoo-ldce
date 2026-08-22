import { z } from "zod";

// ==========================================
// ENUMS & COMMON
// ==========================================

export const tripStatusSchema = z.enum([
  "draft",
  "planned",
  "ongoing",
  "completed",
  "cancelled",
]);

export const tripVisibilitySchema = z.enum(["private", "friends", "public"]);

export const tripMemberRoleSchema = z.enum(["owner", "editor", "viewer"]);

export const itineraryItemTypeSchema = z.enum([
  "activity",
  "transport",
  "accommodation",
  "meal",
  "custom",
]);

export const expenseCategorySchema = z.enum([
  "transport",
  "accommodation",
  "activity",
  "food",
  "shopping",
  "other",
]);

export const currencyCodeSchema = z
  .string()
  .min(3, "Currency code must be 3 characters")
  .max(3, "Currency code must be 3 characters")
  .toUpperCase();

export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

export const timeStringSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, "Time must be HH:MM or HH:MM:SS");

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ==========================================
// USER PREFERENCES
// ==========================================

export const updateUserPreferencesSchema = z.object({
  language: z.string().min(2).max(10).optional(),
  currency: currencyCodeSchema.optional(),
  timezone: z.string().min(1).max(100).optional(),
  isProfilePublic: z.boolean().optional(),
});

export type UpdateUserPreferencesInput = z.infer<typeof updateUserPreferencesSchema>;

// ==========================================
// TRIPS
// ==========================================

export const createTripSchema = z
  .object({
    name: z.string().min(1, "Trip name is required").max(200, "Trip name too long"),
    description: z.string().max(2000).optional().nullable(),
    coverImageUrl: z.string().url().optional().nullable().or(z.literal("")),
    startDate: dateStringSchema.optional().nullable(),
    endDate: dateStringSchema.optional().nullable(),
    visibility: tripVisibilitySchema.default("private"),
    currency: currencyCodeSchema.default("USD"),
    budgetLimit: z.coerce.number().min(0, "Budget cannot be negative").optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: "End date must be on or after start date",
      path: ["endDate"],
    }
  );

export type CreateTripInput = z.infer<typeof createTripSchema>;

export const updateTripSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    slug: z.string().min(1).max(250).optional(),
    description: z.string().max(2000).optional().nullable(),
    coverImageUrl: z.string().url().optional().nullable().or(z.literal("")),
    startDate: dateStringSchema.optional().nullable(),
    endDate: dateStringSchema.optional().nullable(),
    status: tripStatusSchema.optional(),
    visibility: tripVisibilitySchema.optional(),
    currency: currencyCodeSchema.optional(),
    budgetLimit: z.coerce.number().min(0).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: "End date must be on or after start date",
      path: ["endDate"],
    }
  );

export type UpdateTripInput = z.infer<typeof updateTripSchema>;

export const tripFilterSchema = paginationSchema.extend({
  status: tripStatusSchema.optional(),
  visibility: tripVisibilitySchema.optional(),
  search: z.string().optional(),
  sortBy: z.enum(["startDate", "createdAt", "name", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type TripFilterInput = z.input<typeof tripFilterSchema>;

// ==========================================
// TRIP MEMBERS
// ==========================================

export const inviteTripMemberSchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  userId: z.string().min(1, "User ID is required"),
  role: tripMemberRoleSchema.default("editor"),
});

export type InviteTripMemberInput = z.infer<typeof inviteTripMemberSchema>;

export const updateTripMemberRoleSchema = z.object({
  role: tripMemberRoleSchema,
});

export type UpdateTripMemberRoleInput = z.infer<typeof updateTripMemberRoleSchema>;

// ==========================================
// TRIP STOPS
// ==========================================

export const createTripStopSchema = z
  .object({
    tripId: z.string().min(1, "Trip ID is required"),
    cityId: z.string().min(1, "City ID is required"),
    position: z.number().int().min(0).default(0),
    arrivalDate: dateStringSchema.optional().nullable(),
    departureDate: dateStringSchema.optional().nullable(),
    notes: z.string().max(1000).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.arrivalDate && data.departureDate) {
        return new Date(data.arrivalDate) <= new Date(data.departureDate);
      }
      return true;
    },
    {
      message: "Departure date must be on or after arrival date",
      path: ["departureDate"],
    }
  );

export type CreateTripStopInput = z.infer<typeof createTripStopSchema>;

export const updateTripStopSchema = z
  .object({
    position: z.number().int().min(0).optional(),
    arrivalDate: dateStringSchema.optional().nullable(),
    departureDate: dateStringSchema.optional().nullable(),
    notes: z.string().max(1000).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.arrivalDate && data.departureDate) {
        return new Date(data.arrivalDate) <= new Date(data.departureDate);
      }
      return true;
    },
    {
      message: "Departure date must be on or after arrival date",
      path: ["departureDate"],
    }
  );

export type UpdateTripStopInput = z.infer<typeof updateTripStopSchema>;

export const reorderTripStopsSchema = z.object({
  tripId: z.string().min(1),
  stopIds: z.array(z.string().min(1)).min(1, "Must provide at least one stop ID"),
});

export type ReorderTripStopsInput = z.infer<typeof reorderTripStopsSchema>;

// ==========================================
// TRIP DAYS
// ==========================================

export const createTripDaySchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  tripStopId: z.string().optional().nullable(),
  date: dateStringSchema,
  dayNumber: z.number().int().positive("Day number must be >= 1"),
  title: z.string().max(200).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export type CreateTripDayInput = z.infer<typeof createTripDaySchema>;

export const updateTripDaySchema = z.object({
  tripStopId: z.string().optional().nullable(),
  title: z.string().max(200).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export type UpdateTripDayInput = z.infer<typeof updateTripDaySchema>;

// ==========================================
// ITINERARY ITEMS
// ==========================================

export const createItineraryItemSchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  tripDayId: z.string().min(1, "Trip Day ID is required"),
  activityId: z.string().optional().nullable(),
  type: itineraryItemTypeSchema.default("activity"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional().nullable(),
  location: z.string().max(300).optional().nullable(),
  startTime: timeStringSchema.optional().nullable(),
  endTime: timeStringSchema.optional().nullable(),
  estimatedCost: z.coerce.number().min(0, "Estimated cost cannot be negative").default(0),
  currency: currencyCodeSchema.default("USD"),
  position: z.number().int().min(0).default(0),
  notes: z.string().max(1000).optional().nullable(),
});

export type CreateItineraryItemInput = z.infer<typeof createItineraryItemSchema>;

export const updateItineraryItemSchema = z.object({
  activityId: z.string().optional().nullable(),
  type: itineraryItemTypeSchema.optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  location: z.string().max(300).optional().nullable(),
  startTime: timeStringSchema.optional().nullable(),
  endTime: timeStringSchema.optional().nullable(),
  estimatedCost: z.coerce.number().min(0).optional(),
  currency: currencyCodeSchema.optional(),
  position: z.number().int().min(0).optional(),
  notes: z.string().max(1000).optional().nullable(),
});

export type UpdateItineraryItemInput = z.infer<typeof updateItineraryItemSchema>;

export const reorderItineraryItemsSchema = z.object({
  tripDayId: z.string().min(1),
  itemIds: z.array(z.string().min(1)).min(1, "Must provide at least one item ID"),
});

export type ReorderItineraryItemsInput = z.infer<typeof reorderItineraryItemsSchema>;

// ==========================================
// BUDGET & EXPENSES
// ==========================================

export const upsertTripBudgetSchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  totalBudget: z.coerce.number().min(0, "Total budget must be non-negative").default(0),
  currency: currencyCodeSchema.default("USD"),
  transportBudget: z.coerce.number().min(0).default(0),
  accommodationBudget: z.coerce.number().min(0).default(0),
  activityBudget: z.coerce.number().min(0).default(0),
  foodBudget: z.coerce.number().min(0).default(0),
  otherBudget: z.coerce.number().min(0).default(0),
});

export type UpsertTripBudgetInput = z.infer<typeof upsertTripBudgetSchema>;

export const createExpenseSchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  tripDayId: z.string().optional().nullable(),
  itineraryItemId: z.string().optional().nullable(),
  category: expenseCategorySchema.default("other"),
  title: z.string().min(1, "Expense title is required").max(200),
  description: z.string().max(1000).optional().nullable(),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  currency: currencyCodeSchema.default("USD"),
  expenseDate: dateStringSchema.optional().nullable(),
  isEstimated: z.boolean().default(false),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

export const updateExpenseSchema = z.object({
  tripDayId: z.string().optional().nullable(),
  itineraryItemId: z.string().optional().nullable(),
  category: expenseCategorySchema.optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  amount: z.coerce.number().min(0.01).optional(),
  currency: currencyCodeSchema.optional(),
  expenseDate: dateStringSchema.optional().nullable(),
  isEstimated: z.boolean().optional(),
});

export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

export const expenseFilterSchema = z.object({
  tripId: z.string().min(1),
  tripDayId: z.string().optional(),
  category: expenseCategorySchema.optional(),
  isEstimated: z.boolean().optional(),
});

export type ExpenseFilterInput = z.infer<typeof expenseFilterSchema>;

// ==========================================
// SOCIAL & SHARING
// ==========================================

export const createTripShareSchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  allowCopy: z.boolean().default(true),
  expiresAt: z.coerce.date().optional().nullable(),
});

export type CreateTripShareInput = z.infer<typeof createTripShareSchema>;

export const updateTripShareSchema = z.object({
  isActive: z.boolean().optional(),
  allowCopy: z.boolean().optional(),
  expiresAt: z.coerce.date().optional().nullable(),
});

export type UpdateTripShareInput = z.infer<typeof updateTripShareSchema>;

export const toggleSavedDestinationSchema = z.object({
  cityId: z.string().min(1, "City ID is required"),
});

export type ToggleSavedDestinationInput = z.infer<typeof toggleSavedDestinationSchema>;

// ==========================================
// CATALOG SEARCH & FILTERS
// ==========================================

export const citySearchSchema = paginationSchema.extend({
  search: z.string().optional(),
  countryId: z.string().optional(),
  region: z.string().optional(),
  minCost: z.coerce.number().int().min(1).max(5).optional(),
  maxCost: z.coerce.number().int().min(1).max(5).optional(),
  sortBy: z.enum(["popularity", "name", "cost"]).default("popularity"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CitySearchInput = z.infer<typeof citySearchSchema>;

export const activitySearchSchema = paginationSchema.extend({
  cityId: z.string().optional(),
  categoryId: z.string().optional(),
  search: z.string().optional(),
  minCost: z.coerce.number().min(0).optional(),
  maxCost: z.coerce.number().min(0).optional(),
  maxDuration: z.coerce.number().int().positive().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sortBy: z.enum(["popularity", "rating", "cost", "duration", "name"]).default("popularity"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ActivitySearchInput = z.infer<typeof activitySearchSchema>;
