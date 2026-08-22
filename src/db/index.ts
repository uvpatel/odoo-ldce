import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { schemaTables, schemaRelations } from "./schema/relations";
import * as schema from "./schema";

export const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({
  client: sql,
  schema: schemaTables,
  relations: schemaRelations,
});

export type DB = typeof db;
export * from "./schema";
