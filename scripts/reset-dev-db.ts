import "dotenv/config";
import { db } from "../src/db";
import { sql } from "drizzle-orm";
import { seedDatabase } from "../src/db/seed";

async function main() {
  console.log("⚠️ Resetting dev database...");
  try {
    // Truncate non-auth travel tables in dev environment
    await db.execute(
      sql`TRUNCATE TABLE "trip_shares", "saved_destinations", "expenses", "trip_budgets", "itinerary_items", "trip_days", "trip_stops", "trip_members", "trips", "activities", "activity_categories", "cities", "countries" CASCADE;`
    );
    console.log("🧹 Tables truncated.");
    await seedDatabase();
    console.log("✨ Reset & seed finished successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Reset dev db failed:", error);
    process.exit(1);
  }
}

main();
