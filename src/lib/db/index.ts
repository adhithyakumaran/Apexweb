import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/lib/db/schema";

function env(name: string) {
  const value = process.env[name];
  return value?.trim() || "";
}

export function getDatabaseUrl() {
  return (
    env("DATABASE_URI") ||
    env("DATABASE_URL") ||
    env("POSTGRES_URL") ||
    env("POSTGRES_PRISMA_URL") ||
    env("NEON_DATABASE_URL") ||
    ""
  );
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
