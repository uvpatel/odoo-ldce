import { z } from "zod";

export const tripSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  destination: z.string().min(1, "Destination is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  coverImage: z.string().optional(),
  visibility: z.enum(["private", "shared", "public"]).default("private"),
  status: z.enum(["draft", "planning", "confirmed", "in_progress", "completed", "cancelled"]).default("planning"),
  budgetTotal: z.string().default("0.00"),
  currency: z.string().default("USD"),
});

export type TripFormData = z.infer<typeof tripSchema>;
