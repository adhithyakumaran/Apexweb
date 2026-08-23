import { promises as fs } from "fs";
import path from "path";
import { desc, eq } from "drizzle-orm";
import { canUseLocalFileStore } from "@/lib/cms/storage";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { cmsUptimeChecks, cmsUptimeResults } from "@/lib/db/schema";
import { getSiteBaseUrl } from "@/lib/site-url";
import {
  DEFAULT_UPTIME_CHECKS,
  type UptimeCheck,
  type UptimeCheckMethod,
  type UptimeCheckResult,
  type UptimeStats,
} from "@/lib/uptime/shared";

const storePath = path.join(process.cwd(), "data", "cms-uptime.json");

type FileStore = {
  checks: UptimeCheck[];
  results: UptimeCheckResult[];
  nextCheckId: number;
  nextResultId: number;
};

function isMissingTableError(error: unknown) {
  const code =
    (error as { code?: string })?.code ??
    (error as { cause?: { code?: string } })?.cause?.code;
  return code === "42P01";
}

function resolveUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = getSiteBaseUrl();
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}

function defaultFileStore(): FileStore {
  return {
    checks: DEFAULT_UPTIME_CHECKS.map((check, index) => ({ ...check, id: index + 1 })),
    results: [],
    nextCheckId: DEFAULT_UPTIME_CHECKS.length + 1,
    nextResultId: 1,
  };
}

async function readFileStore(): Promise<FileStore> {
  if (!canUseLocalFileStore()) return defaultFileStore();

  try {
    const raw = await fs.readFile(storePath, "utf8");
    const parsed = JSON.parse(raw) as FileStore;
    if (!parsed.checks?.length) return defaultFileStore();
    return parsed;
  } catch {
    const initial = defaultFileStore();
    await writeFileStore(initial);
    return initial;
  }
}

async function writeFileStore(store: FileStore) {
  if (!canUseLocalFileStore()) return;
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(store, null, 2));
}

export type UptimeCheckWithLatest = UptimeCheck & {
  latest: UptimeCheckResult | null;
};

export async function listUptimeChecks(): Promise<UptimeCheck[]> {
  if (!isDatabaseConfigured()) {
    const store = await readFileStore();
    return store.checks;
  }

  const db = getDb();
  if (!db) return (await readFileStore()).checks;

  try {
    const rows = await db.select().from(cmsUptimeChecks).orderBy(cmsUptimeChecks.id);
    if (!rows.length) {
      const seeded = await seedDefaultChecks();
      return seeded;
    }
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      url: row.url,
      method: row.method as UptimeCheckMethod,
      expectedStatus: row.expectedStatus,
      timeoutMs: row.timeoutMs,
      enabled: row.enabled,
    }));
  } catch (error) {
    if (isMissingTableError(error)) return (await readFileStore()).checks;
    throw error;
  }
}

async function seedDefaultChecks(): Promise<UptimeCheck[]> {
  const checks: UptimeCheck[] = [];

  if (!isDatabaseConfigured()) {
    const store = defaultFileStore();
    await writeFileStore(store);
    return store.checks;
  }

  const db = getDb();
  if (!db) return defaultFileStore().checks;

  for (const check of DEFAULT_UPTIME_CHECKS) {
    const [row] = await db
      .insert(cmsUptimeChecks)
      .values({
        name: check.name,
        url: check.url,
        method: check.method,
        expectedStatus: check.expectedStatus,
        timeoutMs: check.timeoutMs,
        enabled: check.enabled,
      })
      .returning();
    checks.push({
      id: row.id,
      name: row.name,
      url: row.url,
      method: row.method as UptimeCheckMethod,
      expectedStatus: row.expectedStatus,
      timeoutMs: row.timeoutMs,
      enabled: row.enabled,
    });
  }
  return checks;
}

export async function listUptimeChecksWithLatest(): Promise<UptimeCheckWithLatest[]> {
  const checks = await listUptimeChecks();
  const results = await listRecentResults(200);
  const latestByCheck = new Map<number, UptimeCheckResult>();

  for (const result of results) {
    if (!latestByCheck.has(result.checkId)) {
      latestByCheck.set(result.checkId, result);
    }
  }

  return checks.map((check) => ({
    ...check,
    latest: latestByCheck.get(check.id) ?? null,
  }));
}

export async function listRecentResults(limit = 100): Promise<UptimeCheckResult[]> {
  if (!isDatabaseConfigured()) {
    const store = await readFileStore();
    return store.results.slice(0, limit);
  }

  const db = getDb();
  if (!db) return (await readFileStore()).results.slice(0, limit);

  try {
    const rows = await db
      .select()
      .from(cmsUptimeResults)
      .orderBy(desc(cmsUptimeResults.checkedAt))
      .limit(limit);

    return rows.map((row) => ({
      id: row.id,
      checkId: row.checkId,
      ok: row.ok,
      statusCode: row.statusCode,
      responseMs: row.responseMs,
      error: row.error,
      checkedAt: row.checkedAt ?? new Date().toISOString(),
    }));
  } catch (error) {
    if (isMissingTableError(error)) return (await readFileStore()).results.slice(0, limit);
    throw error;
  }
}

export async function saveUptimeCheck(
  input: Omit<UptimeCheck, "id"> & { id?: number }
): Promise<UptimeCheck> {
  if (!isDatabaseConfigured()) {
    const store = await readFileStore();
    if (input.id) {
      const index = store.checks.findIndex((c) => c.id === input.id);
      const updated = { ...input, id: input.id } as UptimeCheck;
      if (index >= 0) store.checks[index] = updated;
      await writeFileStore(store);
      return updated;
    }
    const created = { ...input, id: store.nextCheckId++ } as UptimeCheck;
    store.checks.push(created);
    await writeFileStore(store);
    return created;
  }

  const db = getDb();
  if (!db) throw new Error("Database unavailable");

  if (input.id) {
    const [row] = await db
      .update(cmsUptimeChecks)
      .set({
        name: input.name,
        url: input.url,
        method: input.method,
        expectedStatus: input.expectedStatus,
        timeoutMs: input.timeoutMs,
        enabled: input.enabled,
      })
      .where(eq(cmsUptimeChecks.id, input.id))
      .returning();
    return {
      id: row.id,
      name: row.name,
      url: row.url,
      method: row.method as UptimeCheckMethod,
      expectedStatus: row.expectedStatus,
      timeoutMs: row.timeoutMs,
      enabled: row.enabled,
    };
  }

  const [row] = await db
    .insert(cmsUptimeChecks)
    .values({
      name: input.name,
      url: input.url,
      method: input.method,
      expectedStatus: input.expectedStatus,
      timeoutMs: input.timeoutMs,
      enabled: input.enabled,
    })
    .returning();

  return {
    id: row.id,
    name: row.name,
    url: row.url,
    method: row.method as UptimeCheckMethod,
    expectedStatus: row.expectedStatus,
    timeoutMs: row.timeoutMs,
    enabled: row.enabled,
  };
}

export async function deleteUptimeCheck(id: number) {
  if (!isDatabaseConfigured()) {
    const store = await readFileStore();
    store.checks = store.checks.filter((c) => c.id !== id);
    store.results = store.results.filter((r) => r.checkId !== id);
    await writeFileStore(store);
    return;
  }

  const db = getDb();
  if (!db) return;
  await db.delete(cmsUptimeResults).where(eq(cmsUptimeResults.checkId, id));
  await db.delete(cmsUptimeChecks).where(eq(cmsUptimeChecks.id, id));
}

async function recordResult(result: Omit<UptimeCheckResult, "id">): Promise<UptimeCheckResult> {
  if (!isDatabaseConfigured()) {
    const store = await readFileStore();
    const row: UptimeCheckResult = { ...result, id: store.nextResultId++ };
    store.results.unshift(row);
    store.results = store.results.slice(0, 500);
    await writeFileStore(store);
    return row;
  }

  const db = getDb();
  if (!db) throw new Error("Database unavailable");

  const [row] = await db
    .insert(cmsUptimeResults)
    .values({
      checkId: result.checkId,
      ok: result.ok,
      statusCode: result.statusCode,
      responseMs: result.responseMs,
      error: result.error,
      checkedAt: result.checkedAt,
    })
    .returning();

  return {
    id: row.id,
    checkId: row.checkId,
    ok: row.ok,
    statusCode: row.statusCode,
    responseMs: row.responseMs,
    error: row.error,
    checkedAt: row.checkedAt ?? result.checkedAt,
  };
}

export async function runUptimeCheck(check: UptimeCheck): Promise<UptimeCheckResult> {
  const url = resolveUrl(check.url);
  const started = Date.now();

  try {
    const response = await fetch(url, {
      method: check.method,
      cache: "no-store",
      signal: AbortSignal.timeout(check.timeoutMs),
      headers: check.method === "GET" ? { Accept: "text/html,application/json" } : undefined,
    });

    const responseMs = Date.now() - started;
    const ok = response.status === check.expectedStatus;

    return recordResult({
      checkId: check.id,
      ok,
      statusCode: response.status,
      responseMs,
      error: ok ? null : `Expected ${check.expectedStatus}, got ${response.status}`,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    const responseMs = Date.now() - started;
    const message = error instanceof Error ? error.message : "Check failed";
    return recordResult({
      checkId: check.id,
      ok: false,
      statusCode: null,
      responseMs,
      error: message,
      checkedAt: new Date().toISOString(),
    });
  }
}

export async function runAllUptimeChecks() {
  const checks = (await listUptimeChecks()).filter((c) => c.enabled);
  const results = await Promise.all(checks.map((check) => runUptimeCheck(check)));
  return results;
}

export async function getUptimeStats(): Promise<UptimeStats> {
  const checks = await listUptimeChecksWithLatest();
  const enabled = checks.filter((c) => c.enabled);
  const upNow = enabled.filter((c) => c.latest?.ok).length;
  const downNow = enabled.filter((c) => c.latest && !c.latest.ok).length;

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = (await listRecentResults(500)).filter(
    (r) => Date.parse(r.checkedAt) >= weekAgo
  );

  const uptimePercent7d =
    recent.length > 0 ? (recent.filter((r) => r.ok).length / recent.length) * 100 : 100;

  const responseSamples = recent.filter((r) => r.ok).map((r) => r.responseMs);
  const avgResponseMs =
    responseSamples.length > 0
      ? Math.round(responseSamples.reduce((a, b) => a + b, 0) / responseSamples.length)
      : null;

  const lastRunAt = recent[0]?.checkedAt ?? null;

  return {
    totalChecks: checks.length,
    enabledChecks: enabled.length,
    upNow,
    downNow,
    uptimePercent7d,
    avgResponseMs,
    lastRunAt,
  };
}
