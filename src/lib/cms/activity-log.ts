import { promises as fs } from "fs";
import path from "path";
import { desc } from "drizzle-orm";
import { canUseLocalFileStore } from "@/lib/cms/storage";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { cmsActivityLogs, type CmsActivityLogRow } from "@/lib/db/schema";

import type { ActivityLogLevel } from "@/lib/cms/activity-log-shared";

export type { ActivityLogLevel } from "@/lib/cms/activity-log-shared";
export { activityActionLabels } from "@/lib/cms/activity-log-shared";

export type ActivityLogInput = {
  action: string;
  level?: ActivityLogLevel;
  message: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
};

export type ActivityLogFilters = {
  level?: ActivityLogLevel | "all";
  action?: string | "all";
  limit?: number;
};

const storePath = path.join(process.cwd(), "data", "cms-activity-logs.json");

type FileActivityLog = ActivityLogInput & {
  id: number;
  level: ActivityLogLevel;
  createdAt: string;
};

function isMissingTableError(error: unknown) {
  const code =
    (error as { code?: string })?.code ??
    (error as { cause?: { code?: string } })?.cause?.code;
  return code === "42P01";
}

async function readFileStore(): Promise<FileActivityLog[]> {
  if (!canUseLocalFileStore()) return [];

  try {
    const raw = await fs.readFile(storePath, "utf8");
    return JSON.parse(raw) as FileActivityLog[];
  } catch {
    try {
      await fs.mkdir(path.dirname(storePath), { recursive: true });
      await fs.writeFile(storePath, "[]");
    } catch {
      return [];
    }
    return [];
  }
}

async function writeFileStore(items: FileActivityLog[]) {
  if (!canUseLocalFileStore()) return;
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(items, null, 2));
}

export async function logCmsActivity(input: ActivityLogInput) {
  const payload = {
    action: input.action,
    level: input.level ?? "info",
    message: input.message,
    resourceType: input.resourceType ?? null,
    resourceId: input.resourceId ?? null,
    metadata: input.metadata ?? {},
    createdAt: new Date().toISOString(),
  };

  if (isDatabaseConfigured()) {
    const db = getDb();
    if (!db) return null;

    try {
      const [row] = await db.insert(cmsActivityLogs).values(payload).returning();
      return row;
    } catch (error) {
      if (isMissingTableError(error)) {
        console.warn("[cms] cms_activity_logs table missing — run db:push");
        return null;
      }
      console.error("[cms] Failed to write activity log:", error);
      return null;
    }
  }

  if (!canUseLocalFileStore()) return null;

  const items = await readFileStore();
  const nextId = items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  const row: FileActivityLog = {
    id: nextId,
    action: payload.action,
    level: payload.level as ActivityLogLevel,
    message: payload.message,
    resourceType: payload.resourceType ?? undefined,
    resourceId: payload.resourceId ?? undefined,
    metadata: payload.metadata,
    createdAt: payload.createdAt,
  };
  items.unshift(row);
  await writeFileStore(items.slice(0, 500));
  return row as unknown as CmsActivityLogRow;
}

export async function listCmsActivityLogs(filters: ActivityLogFilters = {}) {
  const limit = filters.limit ?? 100;

  if (isDatabaseConfigured()) {
    const db = getDb();
    if (!db) return [];

    try {
      const rows = await db
        .select()
        .from(cmsActivityLogs)
        .orderBy(desc(cmsActivityLogs.createdAt))
        .limit(Math.min(limit, 500));

      return rows.filter((row) => {
        if (filters.level && filters.level !== "all" && row.level !== filters.level) {
          return false;
        }
        if (filters.action && filters.action !== "all" && row.action !== filters.action) {
          return false;
        }
        return true;
      });
    } catch (error) {
      if (isMissingTableError(error)) return [];
      throw error;
    }
  }

  if (!canUseLocalFileStore()) return [];

  const items = await readFileStore();
  return items
    .filter((row) => {
      if (filters.level && filters.level !== "all" && row.level !== filters.level) return false;
      if (filters.action && filters.action !== "all" && row.action !== filters.action) return false;
      return true;
    })
    .slice(0, limit) as unknown as CmsActivityLogRow[];
}

export async function getActivityLogStats() {
  const logs = await listCmsActivityLogs({ limit: 500 });
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const today = logs.filter((log) => now - new Date(log.createdAt ?? 0).getTime() < dayMs);
  const week = logs.filter((log) => now - new Date(log.createdAt ?? 0).getTime() < 7 * dayMs);

  return {
    total: logs.length,
    today: today.length,
    week: week.length,
    errors: logs.filter((log) => log.level === "error").length,
    errorsToday: today.filter((log) => log.level === "error").length,
    loginsWeek: week.filter((log) => log.action === "auth.login").length,
    publishesWeek: week.filter((log) => log.action === "article.published").length,
  };
}

export async function seedActivityLogsFromArticles() {
  if (!isDatabaseConfigured()) return;

  const db = getDb();
  if (!db) return;

  try {
    const existing = await db.select({ id: cmsActivityLogs.id }).from(cmsActivityLogs).limit(1);
    if (existing.length > 0) return;

    const { cmsArticles } = await import("@/lib/db/schema");
    const articles = await db.select().from(cmsArticles).orderBy(desc(cmsArticles.updatedAt));

    if (articles.length === 0) return;

    const now = new Date().toISOString();
    for (const article of articles) {
      await db.insert(cmsActivityLogs).values({
        action: article.status === "published" ? "article.published" : "article.updated",
        level: article.status === "published" ? "success" : "info",
        message:
          article.status === "published"
            ? `Published "${article.title}"`
            : `Updated draft "${article.title}"`,
        resourceType: "article",
        resourceId: String(article.id),
        metadata: { slug: article.slug, title: article.title, seeded: true },
        createdAt: article.updatedAt ?? article.createdAt ?? now,
      });
    }
  } catch (error) {
    if (!isMissingTableError(error)) {
      console.error("[cms] Failed to seed activity logs:", error);
    }
  }
}
