import { execSync } from "node:child_process";

const databaseUrl = process.env.DATABASE_URI || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log("[db] No DATABASE_URI — skipping schema push");
  process.exit(0);
}

console.log("[db] Pushing CMS schema to Neon...");
execSync("npx drizzle-kit push", { stdio: "inherit" });
