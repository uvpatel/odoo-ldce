import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "employee",
  "manager",
  "hr",
  "admin",
  "super_admin",
]);

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "suspended",
]);

export const tripVisibilityEnum = pgEnum("trip_visibility", [
  "private",
  "shared",
  "public",
]);

export const tripStatusEnum = pgEnum("trip_status", [
  "draft",
  "planning",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
]);

export const memberRoleEnum = pgEnum("member_role", [
  "owner",
  "editor",
  "viewer",
]);

export const expenseCategoryEnum = pgEnum("expense_category", [
  "accommodation",
  "flight",
  "transit",
  "food",
  "activity",
  "shopping",
  "insurance",
  "other",
]);

export const itineraryItemTypeEnum = pgEnum("itinerary_item_type", [
  "activity",
  "transit",
  "lodging",
  "meal",
  "note",
]);
