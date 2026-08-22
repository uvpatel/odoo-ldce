import "dotenv/config";
import { db } from "@/db";
import { countries, cities, activityCategories, activities } from "@/db/schema/catalog";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  console.log("🌱 Starting GlobeTrotter database seed...");

  // 1. Seed Countries
  console.log("📍 Seeding countries...");
  const countryData = [
    { name: "India", iso2: "IN", iso3: "IND", currencyCode: "INR", region: "Asia" },
    { name: "France", iso2: "FR", iso3: "FRA", currencyCode: "EUR", region: "Europe" },
    { name: "Japan", iso2: "JP", iso3: "JPN", currencyCode: "JPY", region: "Asia" },
    { name: "United States", iso2: "US", iso3: "USA", currencyCode: "USD", region: "North America" },
    { name: "United Kingdom", iso2: "GB", iso3: "GBR", currencyCode: "GBP", region: "Europe" },
    { name: "Italy", iso2: "IT", iso3: "ITA", currencyCode: "EUR", region: "Europe" },
    { name: "Germany", iso2: "DE", iso3: "DEU", currencyCode: "EUR", region: "Europe" },
    { name: "Spain", iso2: "ES", iso3: "ESP", currencyCode: "EUR", region: "Europe" },
    { name: "Singapore", iso2: "SG", iso3: "SGP", currencyCode: "SGD", region: "Asia" },
    { name: "United Arab Emirates", iso2: "AE", iso3: "ARE", currencyCode: "AED", region: "Middle East" },
  ];

  const countryMap = new Map<string, string>();

  for (const c of countryData) {
    const existing = await db
      .select({ id: countries.id })
      .from(countries)
      .where(eq(countries.iso2, c.iso2))
      .limit(1);

    if (existing[0]) {
      countryMap.set(c.iso2, existing[0].id);
    } else {
      const inserted = await db.insert(countries).values(c).returning();
      if (inserted[0]) {
        countryMap.set(c.iso2, inserted[0].id);
      }
    }
  }

  // 2. Seed Activity Categories
  console.log("🏷️  Seeding activity categories...");
  const categoryData = [
    { name: "Sightseeing", slug: "sightseeing", icon: "landmark" },
    { name: "Food & Dining", slug: "food-dining", icon: "utensils" },
    { name: "Adventure & Sports", slug: "adventure-sports", icon: "compass" },
    { name: "Museum & Art", slug: "museum-art", icon: "palette" },
    { name: "Shopping", slug: "shopping", icon: "shopping-bag" },
    { name: "Nightlife", slug: "nightlife", icon: "moon" },
    { name: "Nature & Parks", slug: "nature-parks", icon: "trees" },
    { name: "Culture & Heritage", slug: "culture-heritage", icon: "castle" },
    { name: "Entertainment", slug: "entertainment", icon: "ticket" },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoryData) {
    const existing = await db
      .select({ id: activityCategories.id })
      .from(activityCategories)
      .where(eq(activityCategories.slug, cat.slug))
      .limit(1);

    if (existing[0]) {
      categoryMap.set(cat.slug, existing[0].id);
    } else {
      const inserted = await db.insert(activityCategories).values(cat).returning();
      if (inserted[0]) {
        categoryMap.set(cat.slug, inserted[0].id);
      }
    }
  }

  // 3. Seed Cities
  console.log("🏙️  Seeding cities...");
  const cityData = [
    {
      countryIso2: "IN",
      name: "Ahmedabad",
      slug: "ahmedabad",
      description: "India's first UNESCO World Heritage City, famous for architectural marvels, vibrant textile markets, and historic ashrams.",
      latitude: "23.022500",
      longitude: "72.571400",
      timezone: "Asia/Kolkata",
      costIndex: 2,
      popularityScore: "88.50",
      imageUrl: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=1200&q=80",
    },
    {
      countryIso2: "IN",
      name: "Mumbai",
      slug: "mumbai",
      description: "The vibrant financial hub of India, home to Bollywood, iconic colonial architecture, and seaside promenades.",
      latitude: "19.076000",
      longitude: "72.877700",
      timezone: "Asia/Kolkata",
      costIndex: 3,
      popularityScore: "94.00",
      imageUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80",
    },
    {
      countryIso2: "IN",
      name: "Delhi",
      slug: "delhi",
      description: "India's capital territory blending centuries of Mughal heritage with contemporary metropolitan energy.",
      latitude: "28.613900",
      longitude: "77.209000",
      timezone: "Asia/Kolkata",
      costIndex: 3,
      popularityScore: "92.00",
      imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80",
    },
    {
      countryIso2: "FR",
      name: "Paris",
      slug: "paris",
      description: "The City of Light, globally renowned for world-class art, haute cuisine, romantic boulevards, and landmark monuments.",
      latitude: "48.856600",
      longitude: "2.352200",
      timezone: "Europe/Paris",
      costIndex: 4,
      popularityScore: "98.50",
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
    },
    {
      countryIso2: "JP",
      name: "Tokyo",
      slug: "tokyo",
      description: "A dazzling metropolis where ultramodern neon skyscrapers stand alongside centuries-old historic temples.",
      latitude: "35.676200",
      longitude: "139.650300",
      timezone: "Asia/Tokyo",
      costIndex: 4,
      popularityScore: "97.50",
      imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80",
    },
    {
      countryIso2: "US",
      name: "New York",
      slug: "new-york",
      description: "The bustling cultural and financial epicenter featuring Broadway, iconic skylines, and world-class museums.",
      latitude: "40.712800",
      longitude: "-74.006000",
      timezone: "America/New_York",
      costIndex: 5,
      popularityScore: "99.00",
      imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80",
    },
    {
      countryIso2: "GB",
      name: "London",
      slug: "london",
      description: "Historic global capital packed with iconic landmarks, Royal palaces, West End theaters, and rich culture.",
      latitude: "51.507400",
      longitude: "-0.127800",
      timezone: "Europe/London",
      costIndex: 5,
      popularityScore: "98.00",
      imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
    },
    {
      countryIso2: "IT",
      name: "Rome",
      slug: "rome",
      description: "The Eternal City, showcasing monumental ancient Roman ruins, Vatican treasures, and charming piazzas.",
      latitude: "41.902800",
      longitude: "12.496400",
      timezone: "Europe/Rome",
      costIndex: 3,
      popularityScore: "95.00",
      imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80",
    },
    {
      countryIso2: "DE",
      name: "Berlin",
      slug: "berlin",
      description: "Germany's vibrant capital, known for art scenes, modern history, sprawling parks, and nightlife.",
      latitude: "52.520000",
      longitude: "13.405000",
      timezone: "Europe/Berlin",
      costIndex: 3,
      popularityScore: "91.00",
      imageUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200&q=80",
    },
    {
      countryIso2: "ES",
      name: "Barcelona",
      slug: "barcelona",
      description: "Cosmopolitan Mediterranean city famous for Gaudí architecture, golden beaches, and culinary delights.",
      latitude: "41.385100",
      longitude: "2.173400",
      timezone: "Europe/Madrid",
      costIndex: 3,
      popularityScore: "94.50",
      imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&q=80",
    },
    {
      countryIso2: "SG",
      name: "Singapore",
      slug: "singapore",
      description: "A garden city-state celebrated for futuristic architecture, multicultural street food, and lush rainforests.",
      latitude: "1.352100",
      longitude: "103.819800",
      timezone: "Asia/Singapore",
      costIndex: 4,
      popularityScore: "96.00",
      imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80",
    },
    {
      countryIso2: "AE",
      name: "Dubai",
      slug: "dubai",
      description: "A luxury oasis known for ultramodern skyscrapers, desert adventures, luxury shopping, and marina views.",
      latitude: "25.204800",
      longitude: "55.270800",
      timezone: "Asia/Dubai",
      costIndex: 4,
      popularityScore: "96.50",
      imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
    },
  ];

  const cityMap = new Map<string, string>();

  for (const city of cityData) {
    const countryId = countryMap.get(city.countryIso2);
    if (!countryId) continue;

    const existing = await db
      .select({ id: cities.id })
      .from(cities)
      .where(eq(cities.slug, city.slug))
      .limit(1);

    if (existing[0]) {
      cityMap.set(city.slug, existing[0].id);
    } else {
      const inserted = await db
        .insert(cities)
        .values({
          countryId,
          name: city.name,
          slug: city.slug,
          description: city.description,
          latitude: city.latitude,
          longitude: city.longitude,
          timezone: city.timezone,
          costIndex: city.costIndex,
          popularityScore: city.popularityScore,
          imageUrl: city.imageUrl,
        })
        .returning();

      if (inserted[0]) {
        cityMap.set(city.slug, inserted[0].id);
      }
    }
  }

  // 4. Seed Activities
  console.log("🎡 Seeding activities...");
  const activityData = [
    // Paris
    {
      citySlug: "paris",
      categorySlug: "sightseeing",
      name: "Eiffel Tower Summit Tour",
      slug: "eiffel-tower-summit",
      description: "Ascend to the top of Paris's iconic iron lady for panoramic 360-degree city views.",
      imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=1200&q=80",
      address: "Champ de Mars, 5 Av. Anatole France, 75007 Paris",
      latitude: "48.858400",
      longitude: "2.294500",
      estimatedCost: "35.00",
      currency: "EUR",
      durationMinutes: 120,
      popularityScore: "99.00",
      rating: "4.80",
    },
    {
      citySlug: "paris",
      categorySlug: "museum-art",
      name: "Louvre Museum Masterpieces Tour",
      slug: "louvre-museum-tour",
      description: "Explore the world's greatest art museum including the Mona Lisa, Venus de Milo, and Winged Victory.",
      imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=80",
      address: "Rue de Rivoli, 75001 Paris",
      latitude: "48.860600",
      longitude: "2.337600",
      estimatedCost: "22.00",
      currency: "EUR",
      durationMinutes: 180,
      popularityScore: "98.50",
      rating: "4.75",
    },
    {
      citySlug: "paris",
      categorySlug: "food-dining",
      name: "Seine River Dinner Cruise",
      slug: "seine-river-dinner-cruise",
      description: "Enjoy a gourmet 3-course French dinner while cruising past illuminated Parisian monuments.",
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
      address: "Port de la Bourdonnais, 75007 Paris",
      latitude: "48.859000",
      longitude: "2.295000",
      estimatedCost: "85.00",
      currency: "EUR",
      durationMinutes: 150,
      popularityScore: "94.00",
      rating: "4.70",
    },
    // Tokyo
    {
      citySlug: "tokyo",
      categorySlug: "sightseeing",
      name: "Tokyo Skytree Observation Deck",
      slug: "tokyo-skytree-deck",
      description: "Take in breathtaking views of Mount Fuji and Tokyo's sprawling cityscape from 450 meters high.",
      imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200&q=80",
      address: "1 Chome-1-2 Oshiage, Sumida City, Tokyo 131-0045",
      latitude: "35.710000",
      longitude: "139.810700",
      estimatedCost: "25.00",
      currency: "USD",
      durationMinutes: 90,
      popularityScore: "97.00",
      rating: "4.80",
    },
    {
      citySlug: "tokyo",
      categorySlug: "culture-heritage",
      name: "Senso-ji Temple & Asakusa Walking Tour",
      slug: "sensoji-temple-asakusa",
      description: "Discover Tokyo's oldest and most significant Buddhist temple and browse traditional Nakamise market stalls.",
      imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80",
      address: "2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032",
      latitude: "35.714800",
      longitude: "139.796700",
      estimatedCost: "0.00",
      currency: "USD",
      durationMinutes: 120,
      popularityScore: "96.50",
      rating: "4.85",
    },
    {
      citySlug: "tokyo",
      categorySlug: "food-dining",
      name: "Tsukiji Outer Market Street Food Tasting",
      slug: "tsukiji-food-tasting",
      description: "Sample fresh sashimi, tamagoyaki, wagyu skewers, and matcha sweets in Tokyo's culinary heaven.",
      imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&q=80",
      address: "4 Chome Tsukiji, Chuo City, Tokyo 104-0045",
      latitude: "35.665500",
      longitude: "139.770800",
      estimatedCost: "40.00",
      currency: "USD",
      durationMinutes: 120,
      popularityScore: "95.00",
      rating: "4.75",
    },
    // New York
    {
      citySlug: "new-york",
      categorySlug: "sightseeing",
      name: "Statue of Liberty & Ellis Island Tour",
      slug: "statue-of-liberty-ellis-island",
      description: "Cruise past Manhattan skyline to Liberty Island and explore the American immigration museum.",
      imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=1200&q=80",
      address: "Battery Park, New York, NY 10004",
      latitude: "40.689200",
      longitude: "-74.044500",
      estimatedCost: "30.00",
      currency: "USD",
      durationMinutes: 240,
      popularityScore: "98.00",
      rating: "4.80",
    },
    {
      citySlug: "new-york",
      categorySlug: "nature-parks",
      name: "Central Park Guided Bike Tour",
      slug: "central-park-bike-tour",
      description: "Ride past Strawberry Fields, Bethesda Terrace, Bow Bridge, and Belvedere Castle with an expert guide.",
      imageUrl: "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=1200&q=80",
      address: "59th St & 5th Ave, New York, NY 10019",
      latitude: "40.764400",
      longitude: "-73.973000",
      estimatedCost: "45.00",
      currency: "USD",
      durationMinutes: 120,
      popularityScore: "94.00",
      rating: "4.70",
    },
    // Ahmedabad
    {
      citySlug: "ahmedabad",
      categorySlug: "culture-heritage",
      name: "Sabarmati Ashram Heritage Visit",
      slug: "sabarmati-ashram-visit",
      description: "Experience the historic headquarters of Mahatma Gandhi and the pivotal center of the Indian independence movement.",
      imageUrl: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=1200&q=80",
      address: "Gandhi Smarak Sangrahalaya, Ashram Rd, Ahmedabad 380027",
      latitude: "23.060500",
      longitude: "72.580100",
      estimatedCost: "0.00",
      currency: "INR",
      durationMinutes: 90,
      popularityScore: "92.00",
      rating: "4.85",
    },
    {
      citySlug: "ahmedabad",
      categorySlug: "culture-heritage",
      name: "Adalaj Stepwell Architectural Tour",
      slug: "adalaj-stepwell-tour",
      description: "Marvel at intricate 15th-century Indo-Islamic subterranean architecture, five stories of carved sandstone columns.",
      imageUrl: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&q=80",
      address: "Adalaj, Gandhinagar Highway, Gujarat 382421",
      latitude: "23.166700",
      longitude: "72.580000",
      estimatedCost: "5.00",
      currency: "USD",
      durationMinutes: 75,
      popularityScore: "90.00",
      rating: "4.80",
    },
    {
      citySlug: "ahmedabad",
      categorySlug: "food-dining",
      name: "Manek Chowk Midnight Street Food Trail",
      slug: "manek-chowk-food-trail",
      description: "Taste iconic Gujarati street food including chocolate pineapple sandwiches, pav bhaji, kulfi, and maska bun.",
      imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&q=80",
      address: "Manek Chowk Rd, Danapidth, Khadia, Ahmedabad 380001",
      latitude: "23.024500",
      longitude: "72.588000",
      estimatedCost: "10.00",
      currency: "USD",
      durationMinutes: 90,
      popularityScore: "91.00",
      rating: "4.75",
    },
    // Rome
    {
      citySlug: "rome",
      categorySlug: "culture-heritage",
      name: "Colosseum & Ancient Roman Forum Tour",
      slug: "colosseum-roman-forum",
      description: "Walk inside the world's most famous amphitheater and explore the ancient political center of the Roman Empire.",
      imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80",
      address: "Piazza del Colosseo, 1, 00184 Roma RM",
      latitude: "41.890200",
      longitude: "12.492200",
      estimatedCost: "28.00",
      currency: "EUR",
      durationMinutes: 180,
      popularityScore: "98.50",
      rating: "4.90",
    },
    // Dubai
    {
      citySlug: "dubai",
      categorySlug: "sightseeing",
      name: "Burj Khalifa Observation Deck",
      slug: "burj-khalifa-at-the-top",
      description: "Stand atop the world's tallest building on levels 124 and 125 for unmatched vistas of Dubai's skyline and desert.",
      imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
      address: "1 Sheikh Mohammed bin Rashid Blvd, Downtown Dubai",
      latitude: "25.197200",
      longitude: "55.274400",
      estimatedCost: "48.00",
      currency: "USD",
      durationMinutes: 90,
      popularityScore: "97.00",
      rating: "4.80",
    },
    {
      citySlug: "dubai",
      categorySlug: "adventure-sports",
      name: "Desert Safari with Dune Bashing & BBQ",
      slug: "desert-safari-bbq",
      description: "Experience 4x4 dune bashing, camel rides, sandboarding, and an authentic Arabian desert camp with live shows.",
      imageUrl: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=1200&q=80",
      address: "Lahbab Desert, Dubai",
      latitude: "24.960000",
      longitude: "55.600000",
      estimatedCost: "65.00",
      currency: "USD",
      durationMinutes: 360,
      popularityScore: "96.00",
      rating: "4.85",
    },
    // Singapore
    {
      citySlug: "singapore",
      categorySlug: "nature-parks",
      name: "Gardens by the Bay & Cloud Forest",
      slug: "gardens-by-the-bay",
      description: "Explore the futuristic Supertree Grove, the world's tallest indoor waterfall, and vibrant mist-filled domes.",
      imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80",
      address: "18 Marina Gardens Dr, Singapore 018953",
      latitude: "1.281600",
      longitude: "103.863600",
      estimatedCost: "28.00",
      currency: "SGD",
      durationMinutes: 150,
      popularityScore: "97.50",
      rating: "4.85",
    },
  ];

  for (const act of activityData) {
    const cityId = cityMap.get(act.citySlug);
    const categoryId = categoryMap.get(act.categorySlug);

    if (!cityId || !categoryId) continue;

    const existing = await db
      .select({ id: activities.id })
      .from(activities)
      .where(eq(activities.slug, act.slug))
      .limit(1);

    if (!existing[0]) {
      await db.insert(activities).values({
        cityId,
        categoryId,
        name: act.name,
        slug: act.slug,
        description: act.description,
        imageUrl: act.imageUrl,
        address: act.address,
        latitude: act.latitude,
        longitude: act.longitude,
        estimatedCost: act.estimatedCost,
        currency: act.currency,
        durationMinutes: act.durationMinutes,
        popularityScore: act.popularityScore,
        rating: act.rating,
      });
    }
  }

  console.log("✅ Seed completed successfully!");
}

if (import.meta.url === `file://${process.argv[1]}` || !process.argv[1].includes("seed")) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seed failed:", err);
      process.exit(1);
    });
}
