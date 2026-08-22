import { db } from "./index";
import { countries } from "./schema/catalog/countries";
import { cities } from "./schema/catalog/cities";
import { activityCategories } from "./schema/catalog/activity-categories";
import { activities } from "./schema/catalog/activities";

export async function seedDatabase() {
  console.log("🌱 Seeding database...");

  // 1. Countries
  const seedCountries = [
    { id: "cnt_jp", name: "Japan", code: "JP", continent: "Asia", currency: "JPY" },
    { id: "cnt_fr", name: "France", code: "FR", continent: "Europe", currency: "EUR" },
    { id: "cnt_us", name: "United States", code: "US", continent: "North America", currency: "USD" },
    { id: "cnt_it", name: "Italy", code: "IT", continent: "Europe", currency: "EUR" },
    { id: "cnt_id", name: "Indonesia", code: "ID", continent: "Asia", currency: "IDR" },
    { id: "cnt_uk", name: "United Kingdom", code: "GB", continent: "Europe", currency: "GBP" },
  ];

  for (const c of seedCountries) {
    await db.insert(countries).values(c).onConflictDoNothing();
  }

  // 2. Cities
  const seedCities = [
    {
      id: "city_tokyo",
      name: "Tokyo",
      slug: "tokyo",
      countryId: "cnt_jp",
      countryName: "Japan",
      description: "A dazzling metropolis blending ultra-modern neon skyscrapers with historic temples.",
      coverImage: "/images/cities/tokyo.jpg",
      latitude: "35.6762000",
      longitude: "139.6503000",
      isFeatured: true,
    },
    {
      id: "city_paris",
      name: "Paris",
      slug: "paris",
      countryId: "cnt_fr",
      countryName: "France",
      description: "The City of Light, famous for its romantic atmosphere, iconic art, and gastronomy.",
      coverImage: "/images/cities/paris.jpg",
      latitude: "48.8566000",
      longitude: "2.3522000",
      isFeatured: true,
    },
    {
      id: "city_nyc",
      name: "New York City",
      slug: "new-york",
      countryId: "cnt_us",
      countryName: "United States",
      description: "The city that never sleeps, featuring Broadway, Central Park, and world-class culture.",
      coverImage: "/images/cities/nyc.jpg",
      latitude: "40.7128000",
      longitude: "-74.0060000",
      isFeatured: true,
    },
    {
      id: "city_rome",
      name: "Rome",
      slug: "rome",
      countryId: "cnt_it",
      countryName: "Italy",
      description: "The Eternal City, steeped in ancient history with the Colosseum and Vatican.",
      coverImage: "/images/cities/rome.jpg",
      latitude: "41.9028000",
      longitude: "12.4964000",
      isFeatured: true,
    },
    {
      id: "city_bali",
      name: "Bali",
      slug: "bali",
      countryId: "cnt_id",
      countryName: "Indonesia",
      description: "Tropical paradise with lush rice terraces, sacred temples, and stunning beaches.",
      coverImage: "/images/cities/bali.jpg",
      latitude: "-8.3405000",
      longitude: "115.0920000",
      isFeatured: true,
    },
  ];

  for (const city of seedCities) {
    await db.insert(cities).values(city).onConflictDoNothing();
  }

  // 3. Categories
  const categories = [
    { id: "cat_sightseeing", name: "Sightseeing", slug: "sightseeing", icon: "Camera" },
    { id: "cat_food", name: "Food & Dining", slug: "food-dining", icon: "Utensils" },
    { id: "cat_culture", name: "Culture & History", slug: "culture-history", icon: "Landmark" },
    { id: "cat_adventure", name: "Outdoor & Adventure", slug: "outdoor-adventure", icon: "Compass" },
    { id: "cat_shopping", name: "Shopping", slug: "shopping", icon: "ShoppingBag" },
  ];

  for (const cat of categories) {
    await db.insert(activityCategories).values(cat).onConflictDoNothing();
  }

  // 4. Sample Activities
  const seedActivities = [
    {
      id: "act_shibuya",
      cityId: "city_tokyo",
      categoryId: "cat_sightseeing",
      name: "Shibuya Crossing & Hachiko Statue",
      slug: "shibuya-crossing",
      description: "Experience the busiest pedestrian intersection in the world and meet Hachiko.",
      estimatedCost: "0.00",
      durationMinutes: "60",
      rating: "4.8",
      isFeatured: true,
    },
    {
      id: "act_eiffel",
      cityId: "city_paris",
      categoryId: "cat_sightseeing",
      name: "Eiffel Tower Summit Tour",
      slug: "eiffel-tower-summit",
      description: "Ascend the iconic Iron Lady for breathtaking panoramic views of Paris.",
      estimatedCost: "35.00",
      durationMinutes: "120",
      rating: "4.9",
      isFeatured: true,
    },
    {
      id: "act_colosseum",
      cityId: "city_rome",
      categoryId: "cat_culture",
      name: "Colosseum & Roman Forum Guided Tour",
      slug: "colosseum-guided-tour",
      description: "Step into the glory of ancient Rome with skip-the-line arena access.",
      estimatedCost: "45.00",
      durationMinutes: "180",
      rating: "4.9",
      isFeatured: true,
    },
  ];

  for (const act of seedActivities) {
    await db.insert(activities).values(act).onConflictDoNothing();
  }

  console.log("✅ Seed completed successfully!");
}
