import "dotenv/config";
import { db } from "@/db";
import { countries, cities, activityCategories, activities } from "@/db/schema/catalog";
import { user } from "@/db/schema/auth";
import { userPreferences } from "@/db/schema/user";
import { trips, tripMembers, tripStops, tripDays, itineraryItems } from "@/db/schema/travel";
import { tripBudgets, expenses } from "@/db/schema/budget";
import { savedDestinations, tripShares } from "@/db/schema/social";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  console.log("🌱 Starting GlobeTrotter database seed...");

  // 1. Seed Countries (15 Countries)
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
    { name: "Netherlands", iso2: "NL", iso3: "NLD", currencyCode: "EUR", region: "Europe" },
    { name: "Switzerland", iso2: "CH", iso3: "CHE", currencyCode: "CHF", region: "Europe" },
    { name: "Thailand", iso2: "TH", iso3: "THA", currencyCode: "THB", region: "Asia" },
    { name: "Indonesia", iso2: "ID", iso3: "IDN", currencyCode: "IDR", region: "Asia" },
    { name: "Australia", iso2: "AU", iso3: "AUS", currencyCode: "AUD", region: "Oceania" },
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

  // 2. Seed Activity Categories (10 Categories)
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
    { name: "Relaxation", slug: "relaxation", icon: "sun" },
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

  // 3. Seed Cities (25+ Cities)
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
      countryIso2: "IN",
      name: "Goa",
      slug: "goa",
      description: "Tropical paradise famed for golden sand beaches, vibrant nightlife, Portuguese heritage, and seafood feasts.",
      latitude: "15.299300",
      longitude: "74.124000",
      timezone: "Asia/Kolkata",
      costIndex: 2,
      popularityScore: "95.00",
      imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
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
      popularityScore: "99.00",
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
    },
    {
      countryIso2: "FR",
      name: "Nice",
      slug: "nice",
      description: "Glamorous French Riviera coastal gem known for the Promenade des Anglais, Mediterranean beaches, and vibrant old town.",
      latitude: "43.710200",
      longitude: "7.262000",
      timezone: "Europe/Paris",
      costIndex: 4,
      popularityScore: "89.00",
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80",
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
      popularityScore: "98.50",
      imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80",
    },
    {
      countryIso2: "JP",
      name: "Kyoto",
      slug: "kyoto",
      description: "The imperial cultural heart of Japan boasting thousands of classical Buddhist temples, gardens, and traditional geisha districts.",
      latitude: "35.011600",
      longitude: "135.768100",
      timezone: "Asia/Tokyo",
      costIndex: 3,
      popularityScore: "96.00",
      imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80",
    },
    {
      countryIso2: "JP",
      name: "Osaka",
      slug: "osaka",
      description: "Japan's food capital famous for bustling street-food alleys, lively Dotonbori nightlife, and majestic Osaka Castle.",
      latitude: "34.693700",
      longitude: "135.502300",
      timezone: "Asia/Tokyo",
      costIndex: 3,
      popularityScore: "93.50",
      imageUrl: "https://images.unsplash.com/photo-1590559899731-a3f376ec6781?w=1200&q=80",
    },
    {
      countryIso2: "IT",
      name: "Rome",
      slug: "rome",
      description: "The Eternal City filled with nearly 3,000 years of globally influential art, architecture, and iconic ancient ruins.",
      latitude: "41.902800",
      longitude: "12.496400",
      timezone: "Europe/Rome",
      costIndex: 3,
      popularityScore: "98.00",
      imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80",
    },
    {
      countryIso2: "IT",
      name: "Florence",
      slug: "florence",
      description: "Cradle of the Renaissance, renowned for masterpieces of art and architecture including the Duomo and Uffizi Gallery.",
      latitude: "43.769600",
      longitude: "11.255800",
      timezone: "Europe/Rome",
      costIndex: 3,
      popularityScore: "94.50",
      imageUrl: "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?w=1200&q=80",
    },
    {
      countryIso2: "IT",
      name: "Venice",
      slug: "venice",
      description: "Floating city of canals, gondolas, Byzantine architecture, and enchanting historic bridges built across 118 small islands.",
      latitude: "45.440800",
      longitude: "12.315500",
      timezone: "Europe/Rome",
      costIndex: 4,
      popularityScore: "96.50",
      imageUrl: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=1200&q=80",
    },
    {
      countryIso2: "DE",
      name: "Berlin",
      slug: "berlin",
      description: "Germany's dynamic capital known for its exceptional artistic scene, rich modern history, and legendary nightlife.",
      latitude: "52.520000",
      longitude: "13.405000",
      timezone: "Europe/Berlin",
      costIndex: 3,
      popularityScore: "94.00",
      imageUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200&q=80",
    },
    {
      countryIso2: "DE",
      name: "Munich",
      slug: "munich",
      description: "Bavaria's capital celebrated for centuries-old architecture, world-renowned beer halls, and proximity to the Bavarian Alps.",
      latitude: "48.135100",
      longitude: "11.582000",
      timezone: "Europe/Berlin",
      costIndex: 4,
      popularityScore: "91.00",
      imageUrl: "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=1200&q=80",
    },
    {
      countryIso2: "ES",
      name: "Barcelona",
      slug: "barcelona",
      description: "The cosmopolitan capital of Catalonia famed for Gaudí's breathtaking architecture, Mediterranean beaches, and tapas culture.",
      latitude: "41.387900",
      longitude: "2.169920",
      timezone: "Europe/Madrid",
      costIndex: 3,
      popularityScore: "97.00",
      imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=80",
    },
    {
      countryIso2: "ES",
      name: "Madrid",
      slug: "madrid",
      description: "Spain's vibrant capital with elegant boulevards, world-class art museums, rich gastronomy, and spirited plaza life.",
      latitude: "40.416800",
      longitude: "-3.703800",
      timezone: "Europe/Madrid",
      costIndex: 3,
      popularityScore: "93.00",
      imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&q=80",
    },
    {
      countryIso2: "GB",
      name: "London",
      slug: "london",
      description: "A world capital of culture, commerce, and history featuring royal palaces, West End theaters, and iconic red double-deckers.",
      latitude: "51.507400",
      longitude: "-0.127800",
      timezone: "Europe/London",
      costIndex: 5,
      popularityScore: "99.00",
      imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
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
      countryIso2: "US",
      name: "San Francisco",
      slug: "san-francisco",
      description: "Famous for the Golden Gate Bridge, historic cable cars, steep rolling hills, and a trailblazing tech and food culture.",
      latitude: "37.774900",
      longitude: "-122.419400",
      timezone: "America/Los_Angeles",
      costIndex: 5,
      popularityScore: "94.00",
      imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=80",
    },
    {
      countryIso2: "SG",
      name: "Singapore",
      slug: "singapore",
      description: "A futuristic garden city offering gleaming skyscrapers, lush botanic wonderlands, and renowned hawker street food.",
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
      description: "Global city of ultra-luxury, avant-garde architecture, desert safaris, and legendary shopping malls.",
      latitude: "25.204800",
      longitude: "55.270800",
      timezone: "Asia/Dubai",
      costIndex: 4,
      popularityScore: "97.50",
      imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
    },
    {
      countryIso2: "AE",
      name: "Abu Dhabi",
      slug: "abu-dhabi",
      description: "The capital of the UAE featuring the magnificent Sheikh Zayed Grand Mosque, Louvre Abu Dhabi, and pristine beaches.",
      latitude: "24.453900",
      longitude: "54.377300",
      timezone: "Asia/Dubai",
      costIndex: 4,
      popularityScore: "90.50",
      imageUrl: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&q=80",
    },
    {
      countryIso2: "NL",
      name: "Amsterdam",
      slug: "amsterdam",
      description: "The picturesque capital of the Netherlands, famous for canal rings, cycling culture, museum quarter, and narrow gabled houses.",
      latitude: "52.367600",
      longitude: "4.904100",
      timezone: "Europe/Amsterdam",
      costIndex: 4,
      popularityScore: "96.50",
      imageUrl: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&q=80",
    },
    {
      countryIso2: "CH",
      name: "Zurich",
      slug: "zurich",
      description: "Switzerland's financial capital set on Lake Zurich with charming medieval alleys, alpine views, and high-end shopping.",
      latitude: "47.376900",
      longitude: "8.541700",
      timezone: "Europe/Zurich",
      costIndex: 5,
      popularityScore: "92.00",
      imageUrl: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1200&q=80",
    },
    {
      countryIso2: "CH",
      name: "Interlaken",
      slug: "interlaken",
      description: "The adventure sports capital of Europe nestled between sparkling lakes and towering alpine peaks of the Jungfrau region.",
      latitude: "46.686300",
      longitude: "7.863200",
      timezone: "Europe/Zurich",
      costIndex: 4,
      popularityScore: "94.00",
      imageUrl: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1200&q=80",
    },
    {
      countryIso2: "TH",
      name: "Bangkok",
      slug: "bangkok",
      description: "Thailand's bustling capital known for ornate shrines, vibrant street life, Chao Phraya river boats, and unforgettable cuisine.",
      latitude: "13.756300",
      longitude: "100.501800",
      timezone: "Asia/Bangkok",
      costIndex: 2,
      popularityScore: "97.00",
      imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80",
    },
    {
      countryIso2: "ID",
      name: "Bali",
      slug: "bali",
      description: "Island of the Gods known for forested volcanic mountains, iconic rice paddies, spiritual Hindu temples, and coral reefs.",
      latitude: "-8.409500",
      longitude: "115.188900",
      timezone: "Asia/Makassar",
      costIndex: 2,
      popularityScore: "98.50",
      imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
    },
    {
      countryIso2: "AU",
      name: "Sydney",
      slug: "sydney",
      description: "Iconic harbour city featuring the Sydney Opera House, Bondi Beach, coastal cliff walks, and sunny outdoor lifestyle.",
      latitude: "-33.868800",
      longitude: "151.209300",
      timezone: "Australia/Sydney",
      costIndex: 4,
      popularityScore: "96.00",
      imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80",
    },
    {
      countryIso2: "AU",
      name: "Melbourne",
      slug: "melbourne",
      description: "Australia's cultural capital celebrated for graffiti-covered laneways, artisan coffee shops, rooftop bars, and vibrant arts.",
      latitude: "-37.813600",
      longitude: "144.963100",
      timezone: "Australia/Melbourne",
      costIndex: 4,
      popularityScore: "93.00",
      imageUrl: "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=1200&q=80",
    },
  ];

  const cityMap = new Map<string, string>();

  for (const c of cityData) {
    const countryId = countryMap.get(c.countryIso2);
    if (!countryId) continue;

    const existing = await db
      .select({ id: cities.id })
      .from(cities)
      .where(eq(cities.slug, c.slug))
      .limit(1);

    if (existing[0]) {
      cityMap.set(c.slug, existing[0].id);
    } else {
      const inserted = await db
        .insert(cities)
        .values({
          countryId,
          name: c.name,
          slug: c.slug,
          description: c.description,
          latitude: c.latitude,
          longitude: c.longitude,
          timezone: c.timezone,
          costIndex: c.costIndex,
          popularityScore: c.popularityScore,
          imageUrl: c.imageUrl,
        })
        .returning();

      if (inserted[0]) {
        cityMap.set(c.slug, inserted[0].id);
      }
    }
  }

  // 4. Seed Activities (40+ Activities)
  console.log("🎟️  Seeding activities...");
  const activityData = [
    // Paris
    {
      citySlug: "paris",
      categorySlug: "sightseeing",
      name: "Eiffel Tower Summit Tour",
      slug: "eiffel-tower-summit",
      description: "Ascend to the very top of Gustave Eiffel's iconic iron monument for sweeping panoramic views of Paris.",
      imageUrl: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=1200&q=80",
      address: "Champ de Mars, 5 Av. Anatole France, 75007 Paris",
      latitude: "48.858400",
      longitude: "2.294500",
      estimatedCost: "35.00",
      currency: "EUR",
      durationMinutes: 150,
      popularityScore: "99.50",
      rating: "4.80",
    },
    {
      citySlug: "paris",
      categorySlug: "museum-art",
      name: "Louvre Museum Masterpieces",
      slug: "louvre-museum",
      description: "Explore the world's largest art museum, home to the Mona Lisa, Venus de Milo, and Winged Victory.",
      imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=80",
      address: "Rue de Rivoli, 75001 Paris",
      latitude: "48.860600",
      longitude: "2.337600",
      estimatedCost: "22.00",
      currency: "EUR",
      durationMinutes: 210,
      popularityScore: "99.00",
      rating: "4.85",
    },
    {
      citySlug: "paris",
      categorySlug: "sightseeing",
      name: "Seine River Twilight Cruise",
      slug: "seine-river-cruise",
      description: "Glide past illuminated Parisian landmarks including Notre-Dame and the Musée d'Orsay from a glass-canopied boat.",
      imageUrl: "https://images.unsplash.com/photo-1509299349698-dd22323b5963?w=1200&q=80",
      address: "Port de la Bourdonnais, 75007 Paris",
      latitude: "48.859000",
      longitude: "2.293000",
      estimatedCost: "18.00",
      currency: "EUR",
      durationMinutes: 75,
      popularityScore: "95.00",
      rating: "4.70",
    },
    {
      citySlug: "paris",
      categorySlug: "food-dining",
      name: "Montmartre Artisanal Food Tour",
      slug: "montmartre-food-tour",
      description: "Taste fresh croissants, artisan cheeses, cured charcuterie, and fine French wines in historic Montmartre.",
      imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80",
      address: "Place des Abbesses, 75018 Paris",
      latitude: "48.884500",
      longitude: "2.338500",
      estimatedCost: "65.00",
      currency: "EUR",
      durationMinutes: 180,
      popularityScore: "94.00",
      rating: "4.90",
    },

    // Tokyo
    {
      citySlug: "tokyo",
      categorySlug: "sightseeing",
      name: "Shibuya Crossing & Sky Observatory",
      slug: "shibuya-sky",
      description: "Experience the world's busiest pedestrian intersection followed by 360-degree open-air views from Shibuya Sky.",
      imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200&q=80",
      address: "2 Chome-24-12 Shibuya, Tokyo 150-0002",
      latitude: "35.658000",
      longitude: "139.701600",
      estimatedCost: "18.00",
      currency: "USD",
      durationMinutes: 90,
      popularityScore: "98.50",
      rating: "4.88",
    },
    {
      citySlug: "tokyo",
      categorySlug: "culture-heritage",
      name: "Senso-ji Temple & Asakusa Walking Tour",
      slug: "senso-ji-asakusa",
      description: "Step back into Edo-era Tokyo at the historic Senso-ji temple and browse traditional crafts along Nakamise Street.",
      imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80",
      address: "2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032",
      latitude: "35.714800",
      longitude: "139.796700",
      estimatedCost: "0.00",
      currency: "USD",
      durationMinutes: 120,
      popularityScore: "97.00",
      rating: "4.82",
    },
    {
      citySlug: "tokyo",
      categorySlug: "entertainment",
      name: "teamLab Planets Immersive Digital Art",
      slug: "teamlab-planets-tokyo",
      description: "Wade through water and become one with mesmerizing digital art installations in this world-famous sensory museum.",
      imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&q=80",
      address: "6 Chome-1-16 Toyosu, Koto City, Tokyo 135-0061",
      latitude: "35.649100",
      longitude: "139.789800",
      estimatedCost: "28.00",
      currency: "USD",
      durationMinutes: 120,
      popularityScore: "99.00",
      rating: "4.92",
    },
    {
      citySlug: "tokyo",
      categorySlug: "food-dining",
      name: "Tsukiji Outer Market Gourmet Tasting",
      slug: "tsukiji-food-tour",
      description: "Indulge in freshly torched wagyu skewers, sashimi bowls, tamagoyaki, and matcha desserts with a culinary guide.",
      imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=1200&q=80",
      address: "4 Chome-16-2 Tsukiji, Chuo City, Tokyo 104-0045",
      latitude: "35.665500",
      longitude: "139.770800",
      estimatedCost: "55.00",
      currency: "USD",
      durationMinutes: 150,
      popularityScore: "96.50",
      rating: "4.89",
    },

    // Rome
    {
      citySlug: "rome",
      categorySlug: "culture-heritage",
      name: "Colosseum, Roman Forum & Palatine Hill",
      slug: "colosseum-forum-tour",
      description: "Walk the arena floor of the Colosseum and wander among the ruins of ancient Roman temples and imperial palaces.",
      imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80",
      address: "Piazza del Colosseo, 1, 00184 Roma",
      latitude: "41.890200",
      longitude: "12.492200",
      estimatedCost: "32.00",
      currency: "EUR",
      durationMinutes: 180,
      popularityScore: "99.20",
      rating: "4.90",
    },
    {
      citySlug: "rome",
      categorySlug: "museum-art",
      name: "Vatican Museums & Sistine Chapel",
      slug: "vatican-sistine-chapel",
      description: "Marvel at Michelangelo's legendary Sistine Chapel ceiling and centuries of papal art treasures and classical sculptures.",
      imageUrl: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1200&q=80",
      address: "00120 Vatican City",
      latitude: "41.906700",
      longitude: "12.454700",
      estimatedCost: "29.00",
      currency: "EUR",
      durationMinutes: 200,
      popularityScore: "99.00",
      rating: "4.86",
    },

    // Dubai
    {
      citySlug: "dubai",
      categorySlug: "sightseeing",
      name: "Burj Khalifa Top Floor Observation",
      slug: "burj-khalifa-observation",
      description: "Ascend to level 124 & 125 of the world's tallest building for breathtaking views over the Arabian Gulf and Dubai desert.",
      imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
      address: "1 Sheikh Mohammed bin Rashid Blvd, Downtown Dubai",
      latitude: "25.197200",
      longitude: "55.274400",
      estimatedCost: "45.00",
      currency: "USD",
      durationMinutes: 90,
      popularityScore: "98.50",
      rating: "4.82",
    },
    {
      citySlug: "dubai",
      categorySlug: "adventure-sports",
      name: "Red Dunes Desert Safari & BBQ Dinner",
      slug: "dubai-desert-safari",
      description: "Experience exhilarating 4x4 dune bashing, sandboarding, camel rides, and a traditional Arabian camp dinner under the stars.",
      imageUrl: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=1200&q=80",
      address: "Lahbab Desert, Dubai",
      latitude: "24.966700",
      longitude: "55.600000",
      estimatedCost: "60.00",
      currency: "USD",
      durationMinutes: 360,
      popularityScore: "97.00",
      rating: "4.91",
    },

    // Amsterdam
    {
      citySlug: "amsterdam",
      categorySlug: "sightseeing",
      name: "Historic Canal Cruise with Audio Guide",
      slug: "amsterdam-canal-cruise",
      description: "Discover Amsterdam's UNESCO-listed canals, picturesque merchant mansions, and centuries-old bridges from the water.",
      imageUrl: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&q=80",
      address: "Prins Hendrikkade 25, 1012 TM Amsterdam",
      latitude: "52.377300",
      longitude: "4.900000",
      estimatedCost: "16.50",
      currency: "EUR",
      durationMinutes: 75,
      popularityScore: "96.00",
      rating: "4.75",
    },
    {
      citySlug: "amsterdam",
      categorySlug: "museum-art",
      name: "Van Gogh Museum",
      slug: "van-gogh-museum",
      description: "See the world's largest collection of paintings, drawings, and letters by Vincent van Gogh including Sunflowers and Almond Blossom.",
      imageUrl: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1200&q=80",
      address: "Museumplein 6, 1071 DJ Amsterdam",
      latitude: "52.358400",
      longitude: "4.881100",
      estimatedCost: "22.00",
      currency: "EUR",
      durationMinutes: 120,
      popularityScore: "97.50",
      rating: "4.88",
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

    // Bali
    {
      citySlug: "bali",
      categorySlug: "culture-heritage",
      name: "Ubud Sacred Monkey Forest & Rice Terraces",
      slug: "ubud-monkey-forest-rice-terraces",
      description: "Walk through lush ancient jungle sanctuaries with macaque monkeys and photograph the stunning emerald Tegalalang rice terraces.",
      imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
      address: "Jl. Monkey Forest, Ubud, Gianyar, Bali 80571",
      latitude: "-8.519400",
      longitude: "115.260600",
      estimatedCost: "15.00",
      currency: "USD",
      durationMinutes: 240,
      popularityScore: "96.50",
      rating: "4.84",
    },

    // Interlaken
    {
      citySlug: "interlaken",
      categorySlug: "adventure-sports",
      name: "Jungfraujoch - Top of Europe Excursion",
      slug: "jungfraujoch-top-of-europe",
      description: "Take the iconic cogwheel railway to the highest train station in Europe, standing above the Aletsch Glacier.",
      imageUrl: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1200&q=80",
      address: "Interlaken Ost Railway Station",
      latitude: "46.690500",
      longitude: "7.869000",
      estimatedCost: "175.00",
      currency: "CHF",
      durationMinutes: 360,
      popularityScore: "98.00",
      rating: "4.94",
    },
  ];

  const activityMap = new Map<string, string>();

  for (const act of activityData) {
    const cityId = cityMap.get(act.citySlug);
    const categoryId = categoryMap.get(act.categorySlug);

    if (!cityId || !categoryId) continue;

    const existing = await db
      .select({ id: activities.id })
      .from(activities)
      .where(eq(activities.slug, act.slug))
      .limit(1);

    if (existing[0]) {
      activityMap.set(act.slug, existing[0].id);
    } else {
      const inserted = await db
        .insert(activities)
        .values({
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
        })
        .returning();

      if (inserted[0]) {
        activityMap.set(act.slug, inserted[0].id);
      }
    }
  }

  // 5. Seed Development Users
  console.log("👤 Seeding development users...");
  const devUsers = [
    {
      id: "usr_dev_urvil_01",
      name: "Urvil Patel",
      email: "urvil@globetrotter.com",
      emailVerified: true,
      role: "employee" as const,
      status: "active" as const,
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80",
    },
    {
      id: "usr_dev_admin_01",
      name: "Admin User",
      email: "admin@globetrotter.com",
      emailVerified: true,
      role: "admin" as const,
      status: "active" as const,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    },
    {
      id: "usr_dev_darshan_01",
      name: "Darshan Shah",
      email: "darshan@globetrotter.com",
      emailVerified: true,
      role: "employee" as const,
      status: "active" as const,
      image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80",
    },
    {
      id: "usr_dev_sarah_01",
      name: "Sarah Jenkins",
      email: "sarah@globetrotter.com",
      emailVerified: true,
      role: "employee" as const,
      status: "active" as const,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    },
  ];

  for (const u of devUsers) {
    const existing = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, u.email))
      .limit(1);

    if (!existing[0]) {
      await db.insert(user).values(u);
      // Seed user preferences
      await db.insert(userPreferences).values({
        userId: u.id,
        language: "en",
        currency: "USD",
        timezone: "Asia/Kolkata",
        isProfilePublic: true,
      }).onConflictDoNothing();
    }
  }

  // 6. Seed Saved Destinations for Urvil
  console.log("⭐ Seeding saved destinations...");
  const savedCitySlugs = ["tokyo", "paris", "bali", "dubai", "interlaken", "rome"];
  for (const slug of savedCitySlugs) {
    const cityId = cityMap.get(slug);
    if (cityId) {
      await db
        .insert(savedDestinations)
        .values({
          userId: "usr_dev_urvil_01",
          cityId,
        })
        .onConflictDoNothing();
    }
  }

  // 7. Seed Development Trips
  console.log("✈️  Seeding development trips...");

  // Trip 1: Europe Grand Tour 2026 (Planned)
  const existingTrip1 = await db
    .select({ id: trips.id })
    .from(trips)
    .where(eq(trips.slug, "europe-grand-tour-2026"))
    .limit(1);

  let trip1Id = existingTrip1[0]?.id;

  if (!trip1Id) {
    const inserted = await db
      .insert(trips)
      .values({
        ownerId: "usr_dev_urvil_01",
        name: "Europe Grand Tour 2026",
        slug: "europe-grand-tour-2026",
        description: "10-day scenic European adventure exploring Paris, Amsterdam, and Berlin with world-class museums, culinary tours, and historic architecture.",
        coverImageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
        startDate: "2026-10-10",
        endDate: "2026-10-20",
        status: "planned",
        visibility: "public",
        currency: "EUR",
        budgetLimit: 3500,
      })
      .returning();

    trip1Id = inserted[0]?.id;
  }

  if (trip1Id) {
    // Members
    await db.insert(tripMembers).values([
      { tripId: trip1Id, userId: "usr_dev_darshan_01", role: "editor" },
      { tripId: trip1Id, userId: "usr_dev_sarah_01", role: "viewer" },
    ]).onConflictDoNothing();

    // Stops
    const parisId = cityMap.get("paris");
    const amsterdamId = cityMap.get("amsterdam");
    const berlinId = cityMap.get("berlin");

    let stop1Id: string | undefined;
    let stop2Id: string | undefined;
    let stop3Id: string | undefined;

    if (parisId) {
      const inserted = await db
        .insert(tripStops)
        .values({
          tripId: trip1Id,
          cityId: parisId,
          position: 0,
          arrivalDate: "2026-10-10",
          departureDate: "2026-10-13",
          notes: "Stay near Saint-Germain-des-Prés",
        })
        .onConflictDoNothing()
        .returning();
      stop1Id = inserted[0]?.id;
    }

    if (amsterdamId) {
      const inserted = await db
        .insert(tripStops)
        .values({
          tripId: trip1Id,
          cityId: amsterdamId,
          position: 1,
          arrivalDate: "2026-10-14",
          departureDate: "2026-10-17",
          notes: "Rent bikes for canal exploration",
        })
        .onConflictDoNothing()
        .returning();
      stop2Id = inserted[0]?.id;
    }

    if (berlinId) {
      const inserted = await db
        .insert(tripStops)
        .values({
          tripId: trip1Id,
          cityId: berlinId,
          position: 2,
          arrivalDate: "2026-10-18",
          departureDate: "2026-10-20",
          notes: "Explore historical museums and food scene",
        })
        .onConflictDoNothing()
        .returning();
      stop3Id = inserted[0]?.id;
    }

    // Days & Itinerary Items
    const day1Insert = await db
      .insert(tripDays)
      .values({
        tripId: trip1Id,
        tripStopId: stop1Id,
        date: "2026-10-10",
        dayNumber: 1,
        title: "Day 1 — Arrival in Paris & Eiffel Tower",
        notes: "Check into hotel by noon and start with lunch",
      })
      .onConflictDoNothing()
      .returning();

    const day1Id = day1Insert[0]?.id;
    if (day1Id) {
      const eiffelId = activityMap.get("eiffel-tower-summit");
      const seineId = activityMap.get("seine-river-cruise");

      await db.insert(itineraryItems).values([
        {
          tripId: trip1Id,
          tripDayId: day1Id,
          activityId: eiffelId,
          type: "activity",
          title: "Eiffel Tower Summit Tour",
          description: "Ascend to the very top for panoramic views of Paris",
          location: "Champ de Mars, Paris",
          startTime: "14:00",
          endTime: "16:30",
          estimatedCost: "35.00",
          currency: "EUR",
          position: 0,
        },
        {
          tripId: trip1Id,
          tripDayId: day1Id,
          activityId: seineId,
          type: "activity",
          title: "Seine River Twilight Cruise",
          description: "Evening boat tour past illuminated monuments",
          location: "Port de la Bourdonnais, Paris",
          startTime: "19:00",
          endTime: "20:30",
          estimatedCost: "18.00",
          currency: "EUR",
          position: 1,
        },
      ]).onConflictDoNothing();
    }

    const day2Insert = await db
      .insert(tripDays)
      .values({
        tripId: trip1Id,
        tripStopId: stop1Id,
        date: "2026-10-11",
        dayNumber: 2,
        title: "Day 2 — Art & Gourmet Dining",
        notes: "Wear comfortable walking shoes",
      })
      .onConflictDoNothing()
      .returning();

    const day2Id = day2Insert[0]?.id;
    if (day2Id) {
      const louvreId = activityMap.get("louvre-museum");
      const montmartreId = activityMap.get("montmartre-food-tour");

      await db.insert(itineraryItems).values([
        {
          tripId: trip1Id,
          tripDayId: day2Id,
          activityId: louvreId,
          type: "activity",
          title: "Louvre Museum Masterpieces",
          description: "Guided tour through the Mona Lisa and Greek antiquities",
          location: "Rue de Rivoli, Paris",
          startTime: "09:30",
          endTime: "13:00",
          estimatedCost: "22.00",
          currency: "EUR",
          position: 0,
        },
        {
          tripId: trip1Id,
          tripDayId: day2Id,
          activityId: montmartreId,
          type: "activity",
          title: "Montmartre Artisanal Food Tour",
          description: "Afternoon pastries, wine, and cheese in bohemian Paris",
          location: "Place des Abbesses, Paris",
          startTime: "15:00",
          endTime: "18:00",
          estimatedCost: "65.00",
          currency: "EUR",
          position: 1,
        },
      ]).onConflictDoNothing();
    }

    // Budget & Expenses
    await db
      .insert(tripBudgets)
      .values({
        tripId: trip1Id,
        totalBudget: "3500.00",
        currency: "EUR",
        transportBudget: "800.00",
        accommodationBudget: "1200.00",
        activityBudget: "600.00",
        foodBudget: "600.00",
        otherBudget: "300.00",
      })
      .onConflictDoNothing();

    await db
      .insert(expenses)
      .values([
        {
          tripId: trip1Id,
          category: "transport",
          title: "Eurostar Train to Amsterdam",
          amount: "140.00",
          currency: "EUR",
          expenseDate: "2026-10-14",
          isEstimated: false,
        },
        {
          tripId: trip1Id,
          category: "accommodation",
          title: "Hotel Saint-Germain Paris (3 Nights)",
          amount: "580.00",
          currency: "EUR",
          expenseDate: "2026-10-10",
          isEstimated: false,
        },
        {
          tripId: trip1Id,
          category: "activity",
          title: "Louvre & Eiffel Tower Advance Tickets",
          amount: "57.00",
          currency: "EUR",
          expenseDate: "2026-10-10",
          isEstimated: false,
        },
        {
          tripId: trip1Id,
          category: "food",
          title: "Dinner at Le Coupe-Chou",
          amount: "115.00",
          currency: "EUR",
          expenseDate: "2026-10-11",
          isEstimated: false,
        },
        {
          tripId: trip1Id,
          category: "transport",
          title: "Estimated Paris Metro 5-Day Passes",
          amount: "45.00",
          currency: "EUR",
          expenseDate: "2026-10-10",
          isEstimated: true,
        },
      ])
      .onConflictDoNothing();

    // Public share link
    await db
      .insert(tripShares)
      .values({
        tripId: trip1Id,
        shareToken: "europe-adventure-2026",
        isActive: true,
        allowCopy: true,
        createdBy: "usr_dev_urvil_01",
      })
      .onConflictDoNothing();
  }

  // Trip 2: Japan Sakura & Neon Explorer (Draft)
  await db
    .insert(trips)
    .values({
      ownerId: "usr_dev_urvil_01",
      name: "Japan Sakura & Neon Explorer",
      slug: "japan-sakura-explorer",
      description: "Cherry blossom season journey across Tokyo, Kyoto, and Osaka blending ancient traditions and modern anime culture.",
      coverImageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80",
      startDate: "2027-03-25",
      endDate: "2027-04-05",
      status: "draft",
      visibility: "private",
      currency: "USD",
      budgetLimit: 4200,
    })
    .onConflictDoNothing();

  // Trip 3: Dubai Luxury Weekend (Completed)
  await db
    .insert(trips)
    .values({
      ownerId: "usr_dev_urvil_01",
      name: "Dubai Luxury Weekend",
      slug: "dubai-luxury-weekend",
      description: "Quick 4-day escape enjoying Burj Khalifa views, private yachting, and desert dune adventures.",
      coverImageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
      startDate: "2026-01-15",
      endDate: "2026-01-19",
      status: "completed",
      visibility: "public",
      currency: "USD",
      budgetLimit: 2400,
    })
    .onConflictDoNothing();

  // Trip 4: Goa Coastal Retreat (Ongoing)
  await db
    .insert(trips)
    .values({
      ownerId: "usr_dev_urvil_01",
      name: "Goa Coastal Retreat",
      slug: "goa-coastal-retreat",
      description: "Relaxing beach vacation with sunset cruises, heritage villas, and Goan fish curries.",
      coverImageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
      startDate: "2026-08-20",
      endDate: "2026-08-26",
      status: "ongoing",
      visibility: "friends",
      currency: "INR",
      budgetLimit: 65000,
    })
    .onConflictDoNothing();

  console.log("✅ Seed completed successfully!");
}

// Execute if run directly
seedDatabase()
  .then(() => {
    console.log("🎉 Database seeding finished!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
