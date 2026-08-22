import { pgEnum } from "drizzle-orm/pg-core";

/**
 * User system roles (preserved and compatible with Better Auth configuration)
 */
export const userRoleEnum = pgEnum("user_role", [
  "employee",
  "manager",
  "hr",
  "admin",
  "super_admin",
]);

/**
 * User account status
 */
export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "suspended",
]);

/**
 * Trip lifecycle status
 */
export const tripStatusEnum = pgEnum("trip_status", [
  "draft",
  "planned",
  "ongoing",
  "completed",
  "cancelled",
]);

/**
 * Trip visibility
 */
export const tripVisibilityEnum = pgEnum("trip_visibility", [
  "private",
  "friends",
  "public",
]);

/**
 * Trip member collaboration role
 */
export const tripMemberRoleEnum = pgEnum("trip_member_role", [
  "owner",
  "editor",
  "viewer",
]);

/**
 * Itinerary item types
 */
export const itineraryItemTypeEnum = pgEnum("itinerary_item_type", [
  "activity",
  "transport",
  "accommodation",
  "meal",
  "custom",
]);

/**
 * Expense financial category
 */
export const expenseCategoryEnum = pgEnum("expense_category", [
  "transport",
  "accommodation",
  "activity",
  "food",
  "shopping",
  "other",
]);

export type UserRole = (typeof userRoleEnum.enumValues)[number];
export type UserStatus = (typeof userStatusEnum.enumValues)[number];
export type TripStatus = (typeof tripStatusEnum.enumValues)[number];
export type TripVisibility = (typeof tripVisibilityEnum.enumValues)[number];
export type TripMemberRole = (typeof tripMemberRoleEnum.enumValues)[number];
export type ItineraryItemType = (typeof itineraryItemTypeEnum.enumValues)[number];
export type ExpenseCategory = (typeof expenseCategoryEnum.enumValues)[number];
