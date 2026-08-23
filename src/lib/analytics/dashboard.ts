import { agents } from "@/config/agents";
import { mainNav } from "@/config/navigation";
import { coreServices, aiPlatforms, industryAgents } from "@/config/services";
import { getCmsStats, listCmsArticles } from "@/lib/cms/articles-repository";
import {
  getActivityLogStats,
  listCmsActivityLogs,
  seedActivityLogsFromArticles,
} from "@/lib/cms/activity-log";
import { getCmsTemplate, type CmsTemplateId } from "@/lib/cms/templates";
import { isR2Configured } from "@/lib/cms/r2";
import { isDatabaseConfigured } from "@/lib/db";

export type IntegrationStatus = {
  id: string;
  label: string;
  connected: boolean;
  hint: string;
};

export type AnalyticsDashboardData = {
  content: {
    totalArticles: number;
    published: number;
    drafts: number;
    featured: number;
    agents: number;
    pages: number;
    services: number;
  };
  templates: { label: string; count: number }[];
  categories: { label: string; count: number }[];
  publishingTimeline: { month: string; count: number }[];
  activityTimeline: { day: string; count: number }[];
  recentActivity: {
    id: number;
    action: string;
    level: string;
    message: string;
    createdAt: string;
  }[];
  activityStats: Awaited<ReturnType<typeof getActivityLogStats>>;
  integrations: IntegrationStatus[];
};

function monthKey(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Unknown";
  return parsed.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}

function dayKey(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Unknown";
  return parsed.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function isPostHogConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim());
}

function isSentryConfigured() {
  return Boolean(process.env.SENTRY_DSN?.trim() || process.env.NEXT_PUBLIC_SENTRY_DSN?.trim());
}

export async function getAnalyticsDashboardData(): Promise<AnalyticsDashboardData> {
  await seedActivityLogsFromArticles();

  const [stats, articles, activityStats, recentLogs] = await Promise.all([
    getCmsStats(),
    listCmsArticles(true),
    getActivityLogStats(),
    listCmsActivityLogs({ limit: 8 }),
  ]);

  const templateCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();
  const monthCounts = new Map<string, number>();

  for (const article of articles) {
    const template = getCmsTemplate(article.cmsTemplate as CmsTemplateId);
    const templateLabel = template?.label ?? article.cmsTemplate;
    templateCounts.set(templateLabel, (templateCounts.get(templateLabel) ?? 0) + 1);
    categoryCounts.set(article.category, (categoryCounts.get(article.category) ?? 0) + 1);

    if (article.status === "published") {
      const key = monthKey(article.publishedAt);
      monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1);
    }
  }

  const publishingTimeline = [...monthCounts.entries()]
    .map(([month, count]) => ({ month, count }))
    .slice(-6);

  const dayCounts = new Map<string, number>();
  const logs = await listCmsActivityLogs({ limit: 200 });
  for (const log of logs) {
    const key = dayKey(log.createdAt ?? new Date().toISOString());
    dayCounts.set(key, (dayCounts.get(key) ?? 0) + 1);
  }

  const activityTimeline = [...dayCounts.entries()]
    .map(([day, count]) => ({ day, count }))
    .slice(0, 7)
    .reverse();

  return {
    content: {
      totalArticles: stats.total,
      published: stats.published,
      drafts: stats.drafts,
      featured: articles.filter((article) => article.featured).length,
      agents: agents.length,
      pages: mainNav.length + 1,
      services: coreServices.length + aiPlatforms.length + industryAgents.length,
    },
    templates: [...templateCounts.entries()].map(([label, count]) => ({ label, count })),
    categories: [...categoryCounts.entries()].map(([label, count]) => ({ label, count })),
    publishingTimeline,
    activityTimeline,
    recentActivity: recentLogs.map((log) => ({
      id: log.id,
      action: log.action,
      level: log.level,
      message: log.message,
      createdAt: log.createdAt ?? new Date().toISOString(),
    })),
    activityStats,
    integrations: [
      {
        id: "neon",
        label: "Neon database",
        connected: isDatabaseConfigured(),
        hint: isDatabaseConfigured() ? "Connected" : "Set DATABASE_URI",
      },
      {
        id: "r2",
        label: "Cloudflare R2",
        connected: isR2Configured(),
        hint: isR2Configured() ? "Uploads ready" : "Set R2 credentials",
      },
      {
        id: "posthog",
        label: "PostHog analytics",
        connected: isPostHogConfigured(),
        hint: isPostHogConfigured() ? "Visitor analytics ready" : "Set NEXT_PUBLIC_POSTHOG_KEY",
      },
      {
        id: "sentry",
        label: "Sentry monitoring",
        connected: isSentryConfigured(),
        hint: isSentryConfigured() ? "Error tracking ready" : "Set SENTRY_DSN",
      },
    ],
  };
}
