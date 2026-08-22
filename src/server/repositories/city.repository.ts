import { db } from "@/db";
import { cities, countries } from "@/db/schema/catalog";
import { eq, ilike, and, gte, lte, desc, asc, sql } from "drizzle-orm";
import type { CitySearchInput } from "@/lib/validation";

export class CityRepository {
  static async findCities(filters: CitySearchInput) {
    const {
      page = 1,
      limit = 20,
      search,
      countryId,
      region,
      minCost,
      maxCost,
      sortBy = "popularity",
      sortOrder = "desc",
    } = filters;

    const offset = (page - 1) * limit;
    const conditions = [];

    if (search) {
      conditions.push(
        sql`(${cities.name} ILIKE ${`%${search}%`} OR ${cities.description} ILIKE ${`%${search}%`})`
      );
    }

    if (countryId) {
      conditions.push(eq(cities.countryId, countryId));
    }

    if (region) {
      conditions.push(eq(countries.region, region));
    }

    if (minCost !== undefined) {
      conditions.push(gte(cities.costIndex, minCost));
    }

    if (maxCost !== undefined) {
      conditions.push(lte(cities.costIndex, maxCost));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderByClause;
    if (sortBy === "name") {
      orderByClause = sortOrder === "asc" ? asc(cities.name) : desc(cities.name);
    } else if (sortBy === "cost") {
      orderByClause = sortOrder === "asc" ? asc(cities.costIndex) : desc(cities.costIndex);
    } else {
      orderByClause = sortOrder === "asc" ? asc(cities.popularityScore) : desc(cities.popularityScore);
    }

    const [items, totalResult] = await Promise.all([
      db
        .select({
          id: cities.id,
          name: cities.name,
          slug: cities.slug,
          description: cities.description,
          latitude: cities.latitude,
          longitude: cities.longitude,
          timezone: cities.timezone,
          costIndex: cities.costIndex,
          popularityScore: cities.popularityScore,
          imageUrl: cities.imageUrl,
          createdAt: cities.createdAt,
          updatedAt: cities.updatedAt,
          country: {
            id: countries.id,
            name: countries.name,
            iso2: countries.iso2,
            iso3: countries.iso3,
            currencyCode: countries.currencyCode,
            region: countries.region,
          },
        })
        .from(cities)
        .innerJoin(countries, eq(cities.countryId, countries.id))
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(cities)
        .innerJoin(countries, eq(cities.countryId, countries.id))
        .where(whereClause),
    ]);

    const total = totalResult[0]?.count ?? 0;

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async findCityById(id: string) {
    const results = await db
      .select({
        city: cities,
        country: countries,
      })
      .from(cities)
      .innerJoin(countries, eq(cities.countryId, countries.id))
      .where(eq(cities.id, id))
      .limit(1);

    if (!results[0]) return null;
    return {
      ...results[0].city,
      country: results[0].country,
    };
  }

  static async findCityBySlug(slug: string) {
    const results = await db
      .select({
        city: cities,
        country: countries,
      })
      .from(cities)
      .innerJoin(countries, eq(cities.countryId, countries.id))
      .where(eq(cities.slug, slug))
      .limit(1);

    if (!results[0]) return null;
    return {
      ...results[0].city,
      country: results[0].country,
    };
  }

  static async findPopularCities(limitCount = 10) {
    return db
      .select({
        id: cities.id,
        name: cities.name,
        slug: cities.slug,
        description: cities.description,
        latitude: cities.latitude,
        longitude: cities.longitude,
        timezone: cities.timezone,
        costIndex: cities.costIndex,
        popularityScore: cities.popularityScore,
        imageUrl: cities.imageUrl,
        country: {
          id: countries.id,
          name: countries.name,
          iso2: countries.iso2,
          region: countries.region,
        },
      })
      .from(cities)
      .innerJoin(countries, eq(cities.countryId, countries.id))
      .orderBy(desc(cities.popularityScore))
      .limit(limitCount);
  }

  static async findCountries() {
    return db.select().from(countries).orderBy(asc(countries.name));
  }

  static async findCountryById(id: string) {
    const results = await db.select().from(countries).where(eq(countries.id, id)).limit(1);
    return results[0] ?? null;
  }
}

export const cityRepository = CityRepository;
