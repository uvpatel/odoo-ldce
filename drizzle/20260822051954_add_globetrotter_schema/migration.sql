CREATE TYPE "expense_category" AS ENUM('transport', 'accommodation', 'activity', 'food', 'shopping', 'other');--> statement-breakpoint
CREATE TYPE "itinerary_item_type" AS ENUM('activity', 'transport', 'accommodation', 'meal', 'custom');--> statement-breakpoint
CREATE TYPE "trip_member_role" AS ENUM('owner', 'editor', 'viewer');--> statement-breakpoint
CREATE TYPE "trip_status" AS ENUM('draft', 'planned', 'ongoing', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "trip_visibility" AS ENUM('private', 'friends', 'public');--> statement-breakpoint
CREATE TABLE "trips" (
	"id" text PRIMARY KEY,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"cover_image_url" text,
	"start_date" date,
	"end_date" date,
	"status" "trip_status" DEFAULT 'draft'::"trip_status" NOT NULL,
	"visibility" "trip_visibility" DEFAULT 'private'::"trip_visibility" NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"budget_limit" numeric(12,2),
	"source_trip_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "trips_date_range_check" CHECK ("start_date" IS NULL OR "end_date" IS NULL OR "start_date" <= "end_date"),
	CONSTRAINT "trips_budget_limit_check" CHECK ("budget_limit" IS NULL OR "budget_limit" >= 0)
);
--> statement-breakpoint
CREATE TABLE "trip_members" (
	"id" text PRIMARY KEY,
	"trip_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" "trip_member_role" DEFAULT 'editor'::"trip_member_role" NOT NULL,
	"invited_by" text,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trip_stops" (
	"id" text PRIMARY KEY,
	"trip_id" text NOT NULL,
	"city_id" text NOT NULL,
	"position" integer NOT NULL,
	"arrival_date" date,
	"departure_date" date,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "trip_stops_date_range_check" CHECK ("arrival_date" IS NULL OR "departure_date" IS NULL OR "arrival_date" <= "departure_date")
);
--> statement-breakpoint
CREATE TABLE "trip_days" (
	"id" text PRIMARY KEY,
	"trip_id" text NOT NULL,
	"trip_stop_id" text,
	"date" date NOT NULL,
	"day_number" integer NOT NULL,
	"title" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "itinerary_items" (
	"id" text PRIMARY KEY,
	"trip_id" text NOT NULL,
	"trip_day_id" text NOT NULL,
	"activity_id" text,
	"type" "itinerary_item_type" DEFAULT 'activity'::"itinerary_item_type" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"location" text,
	"start_time" text,
	"end_time" text,
	"estimated_cost" numeric(12,2) DEFAULT '0.00' NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"position" integer NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "itinerary_items_cost_non_negative" CHECK ("estimated_cost" >= 0)
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"iso2" text NOT NULL,
	"iso3" text NOT NULL,
	"currency_code" text NOT NULL,
	"region" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" text PRIMARY KEY,
	"country_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"latitude" numeric(9,6) NOT NULL,
	"longitude" numeric(9,6) NOT NULL,
	"timezone" text NOT NULL,
	"cost_index" integer DEFAULT 3 NOT NULL,
	"popularity_score" numeric(5,2) DEFAULT '0.00' NOT NULL,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cities_cost_index_check" CHECK ("cost_index" >= 1 AND "cost_index" <= 5)
);
--> statement-breakpoint
CREATE TABLE "activity_categories" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"icon" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activities" (
	"id" text PRIMARY KEY,
	"city_id" text NOT NULL,
	"category_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"image_url" text,
	"address" text,
	"latitude" numeric(9,6),
	"longitude" numeric(9,6),
	"estimated_cost" numeric(12,2) DEFAULT '0.00' NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"duration_minutes" integer DEFAULT 60 NOT NULL,
	"popularity_score" numeric(5,2) DEFAULT '0.00' NOT NULL,
	"rating" numeric(3,2) DEFAULT '0.00' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "activities_cost_non_negative" CHECK ("estimated_cost" >= 0),
	CONSTRAINT "activities_duration_positive" CHECK ("duration_minutes" > 0),
	CONSTRAINT "activities_rating_range" CHECK ("rating" >= 0 AND "rating" <= 5)
);
--> statement-breakpoint
CREATE TABLE "trip_budgets" (
	"id" text PRIMARY KEY,
	"trip_id" text NOT NULL,
	"total_budget" numeric(12,2) DEFAULT '0.00' NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"transport_budget" numeric(12,2) DEFAULT '0.00' NOT NULL,
	"accommodation_budget" numeric(12,2) DEFAULT '0.00' NOT NULL,
	"activity_budget" numeric(12,2) DEFAULT '0.00' NOT NULL,
	"food_budget" numeric(12,2) DEFAULT '0.00' NOT NULL,
	"other_budget" numeric(12,2) DEFAULT '0.00' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "trip_budgets_total_non_negative" CHECK ("total_budget" >= 0),
	CONSTRAINT "trip_budgets_transport_non_negative" CHECK ("transport_budget" >= 0),
	CONSTRAINT "trip_budgets_accommodation_non_negative" CHECK ("accommodation_budget" >= 0),
	CONSTRAINT "trip_budgets_activity_non_negative" CHECK ("activity_budget" >= 0),
	CONSTRAINT "trip_budgets_food_non_negative" CHECK ("food_budget" >= 0),
	CONSTRAINT "trip_budgets_other_non_negative" CHECK ("other_budget" >= 0)
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" text PRIMARY KEY,
	"trip_id" text NOT NULL,
	"trip_day_id" text,
	"itinerary_item_id" text,
	"category" "expense_category" DEFAULT 'other'::"expense_category" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"amount" numeric(12,2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"expense_date" date,
	"is_estimated" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "expenses_amount_non_negative" CHECK ("amount" >= 0)
);
--> statement-breakpoint
CREATE TABLE "trip_shares" (
	"id" text PRIMARY KEY,
	"trip_id" text NOT NULL,
	"share_token" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"allow_copy" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp with time zone,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_destinations" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"city_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"is_profile_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "trips_owner_slug_uidx" ON "trips" ("owner_id","slug");--> statement-breakpoint
CREATE INDEX "trips_owner_id_idx" ON "trips" ("owner_id");--> statement-breakpoint
CREATE INDEX "trips_status_idx" ON "trips" ("status");--> statement-breakpoint
CREATE INDEX "trips_visibility_idx" ON "trips" ("visibility");--> statement-breakpoint
CREATE INDEX "trips_start_date_idx" ON "trips" ("start_date");--> statement-breakpoint
CREATE INDEX "trips_end_date_idx" ON "trips" ("end_date");--> statement-breakpoint
CREATE INDEX "trips_deleted_at_idx" ON "trips" ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "trip_members_trip_user_uidx" ON "trip_members" ("trip_id","user_id");--> statement-breakpoint
CREATE INDEX "trip_members_trip_id_idx" ON "trip_members" ("trip_id");--> statement-breakpoint
CREATE INDEX "trip_members_user_id_idx" ON "trip_members" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "trip_stops_trip_position_uidx" ON "trip_stops" ("trip_id","position");--> statement-breakpoint
CREATE INDEX "trip_stops_trip_id_idx" ON "trip_stops" ("trip_id");--> statement-breakpoint
CREATE INDEX "trip_stops_city_id_idx" ON "trip_stops" ("city_id");--> statement-breakpoint
CREATE UNIQUE INDEX "trip_days_trip_date_uidx" ON "trip_days" ("trip_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "trip_days_trip_day_number_uidx" ON "trip_days" ("trip_id","day_number");--> statement-breakpoint
CREATE INDEX "trip_days_trip_id_idx" ON "trip_days" ("trip_id");--> statement-breakpoint
CREATE INDEX "trip_days_trip_stop_id_idx" ON "trip_days" ("trip_stop_id");--> statement-breakpoint
CREATE INDEX "trip_days_date_idx" ON "trip_days" ("date");--> statement-breakpoint
CREATE UNIQUE INDEX "itinerary_items_day_position_uidx" ON "itinerary_items" ("trip_day_id","position");--> statement-breakpoint
CREATE INDEX "itinerary_items_trip_id_idx" ON "itinerary_items" ("trip_id");--> statement-breakpoint
CREATE INDEX "itinerary_items_trip_day_id_idx" ON "itinerary_items" ("trip_day_id");--> statement-breakpoint
CREATE INDEX "itinerary_items_activity_id_idx" ON "itinerary_items" ("activity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "countries_iso2_uidx" ON "countries" ("iso2");--> statement-breakpoint
CREATE UNIQUE INDEX "countries_iso3_uidx" ON "countries" ("iso3");--> statement-breakpoint
CREATE INDEX "countries_region_idx" ON "countries" ("region");--> statement-breakpoint
CREATE INDEX "countries_name_idx" ON "countries" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "cities_slug_uidx" ON "cities" ("slug");--> statement-breakpoint
CREATE INDEX "cities_country_id_idx" ON "cities" ("country_id");--> statement-breakpoint
CREATE INDEX "cities_name_idx" ON "cities" ("name");--> statement-breakpoint
CREATE INDEX "cities_popularity_score_idx" ON "cities" ("popularity_score");--> statement-breakpoint
CREATE UNIQUE INDEX "activity_categories_slug_uidx" ON "activity_categories" ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "activities_city_slug_uidx" ON "activities" ("city_id","slug");--> statement-breakpoint
CREATE INDEX "activities_city_id_idx" ON "activities" ("city_id");--> statement-breakpoint
CREATE INDEX "activities_category_id_idx" ON "activities" ("category_id");--> statement-breakpoint
CREATE INDEX "activities_popularity_score_idx" ON "activities" ("popularity_score");--> statement-breakpoint
CREATE INDEX "activities_rating_idx" ON "activities" ("rating");--> statement-breakpoint
CREATE INDEX "activities_estimated_cost_idx" ON "activities" ("estimated_cost");--> statement-breakpoint
CREATE UNIQUE INDEX "trip_budgets_trip_id_uidx" ON "trip_budgets" ("trip_id");--> statement-breakpoint
CREATE INDEX "expenses_trip_id_idx" ON "expenses" ("trip_id");--> statement-breakpoint
CREATE INDEX "expenses_trip_day_id_idx" ON "expenses" ("trip_day_id");--> statement-breakpoint
CREATE INDEX "expenses_itinerary_item_id_idx" ON "expenses" ("itinerary_item_id");--> statement-breakpoint
CREATE INDEX "expenses_category_idx" ON "expenses" ("category");--> statement-breakpoint
CREATE INDEX "expenses_expense_date_idx" ON "expenses" ("expense_date");--> statement-breakpoint
CREATE UNIQUE INDEX "trip_shares_share_token_uidx" ON "trip_shares" ("share_token");--> statement-breakpoint
CREATE INDEX "trip_shares_trip_id_idx" ON "trip_shares" ("trip_id");--> statement-breakpoint
CREATE INDEX "trip_shares_created_by_idx" ON "trip_shares" ("created_by");--> statement-breakpoint
CREATE UNIQUE INDEX "saved_destinations_user_city_uidx" ON "saved_destinations" ("user_id","city_id");--> statement-breakpoint
CREATE INDEX "saved_destinations_user_id_idx" ON "saved_destinations" ("user_id");--> statement-breakpoint
CREATE INDEX "saved_destinations_city_id_idx" ON "saved_destinations" ("city_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_preferences_user_id_uidx" ON "user_preferences" ("user_id");--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_owner_id_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_source_trip_id_fkey" FOREIGN KEY ("source_trip_id") REFERENCES "trips"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "trip_members" ADD CONSTRAINT "trip_members_trip_id_trips_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trip_members" ADD CONSTRAINT "trip_members_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trip_members" ADD CONSTRAINT "trip_members_invited_by_user_id_fkey" FOREIGN KEY ("invited_by") REFERENCES "user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_trip_id_trips_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_city_id_cities_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "trip_days" ADD CONSTRAINT "trip_days_trip_id_trips_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trip_days" ADD CONSTRAINT "trip_days_trip_stop_id_trip_stops_id_fkey" FOREIGN KEY ("trip_stop_id") REFERENCES "trip_stops"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "itinerary_items" ADD CONSTRAINT "itinerary_items_trip_id_trips_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "itinerary_items" ADD CONSTRAINT "itinerary_items_trip_day_id_trip_days_id_fkey" FOREIGN KEY ("trip_day_id") REFERENCES "trip_days"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "itinerary_items" ADD CONSTRAINT "itinerary_items_activity_id_activities_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_countries_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_city_id_cities_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_category_id_activity_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "activity_categories"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "trip_budgets" ADD CONSTRAINT "trip_budgets_trip_id_trips_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_trip_id_trips_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_trip_day_id_trip_days_id_fkey" FOREIGN KEY ("trip_day_id") REFERENCES "trip_days"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_itinerary_item_id_itinerary_items_id_fkey" FOREIGN KEY ("itinerary_item_id") REFERENCES "itinerary_items"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "trip_shares" ADD CONSTRAINT "trip_shares_trip_id_trips_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trip_shares" ADD CONSTRAINT "trip_shares_created_by_user_id_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "saved_destinations" ADD CONSTRAINT "saved_destinations_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "saved_destinations" ADD CONSTRAINT "saved_destinations_city_id_cities_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;