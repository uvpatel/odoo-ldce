export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
] as const;

export const EXPENSE_CATEGORIES = [
  "accommodation",
  "flight",
  "transit",
  "food",
  "activity",
  "shopping",
  "insurance",
  "other",
] as const;

export const TRIP_VISIBILITIES = ["private", "shared", "public"] as const;
export const TRIP_STATUSES = ["draft", "planning", "confirmed", "in_progress", "completed", "cancelled"] as const;
export const MEMBER_ROLES = ["owner", "editor", "viewer"] as const;
