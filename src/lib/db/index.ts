import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/lib/db/schema";

export function getDatabaseUrl() {
  return process.env.DATABASE_URI || process.env.DATABASE_URL || "";
}

export function isDatabaseConfigured() {
  return Boolean(getDatabaseUrl());
}

export function getDb() {
  const url = getDatabaseUrl();
  if (!url) return null;
  const sql = neon(url);
  return drizzle(sql, { schema });
}
