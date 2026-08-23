import { unstable_cache } from "next/cache";
import { getVisitorAnalytics } from "@/lib/analytics/posthog-query";
import { isPostHogQueryConfigured } from "@/lib/analytics/posthog-config";
import { getActivityLogStats, listCmsActivityLogs } from "@/lib/cms/activity-log";
import type { CmsActivityLogRow } from "@/lib/db/schema";
import {
  type PipelineLogCategory,
  type PipelineLogEntry,
  type PipelineLogLevel,
  type PipelineLogsData,
  type PipelineLogsPeriod,
} from "@/lib/monitoring/pipeline-logs-shared";
import { isSentryApiConfigured, isSentryDsnConfigured } from "@/lib/monitoring/sentry-config";
import { getSentrySnapshot } from "@/lib/monitoring/sentry-query";
import { getSiteBaseUrl } from "@/lib/site-url";

export type {
  PipelineLogCategory,
  PipelineLogEntry,
  PipelineLogsData,
  PipelineLogsKpis,
  PipelineLogsPeriod,
} from "@/lib/monitoring/pipeline-logs-shared";

export {
  pipelineLogsToCsv,
  pipelineLogsToPrintHtml,
} from "@/lib/monitoring/pipeline-logs-shared";

type VercelDeployment = {
  uid: string;
  name: string;
  url: string;
  state: string;
  created: number;
  meta?: {
    githubCommitMessage?: string;
    githubCommitRef?: string;
    githubCommitSha?: string;
    githubCommitAuthorName?: string;
  };
};

type GitHubCommit = {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
  html_url: string;
  author: { login: string } | null;
};

function getVercelToken() {
  return process.env.VERCEL_TOKEN?.trim() ?? "";
}

function getVercelProjectId() {
  return process.env.VERCEL_PROJECT_ID?.trim() ?? "";
}

function getGithubToken() {
  return process.env.GITHUB_TOKEN?.trim() ?? "";
}

function getGithubRepo() {
  return process.env.GITHUB_REPO?.trim() ?? "";
}

function isVercelConfigured() {
  return Boolean(getVercelToken() && (getVercelProjectId() || process.env.VERCEL_URL));
}

function isGithubConfigured() {
  return Boolean(getGithubToken() && getGithubRepo());
}

function levelFromSentry(level: string): PipelineLogLevel {
  if (level === "fatal" || level === "error") return "error";
  if (level === "warning") return "warning";
  if (level === "info") return "info";
  return "debug";
}

function cmsLevelToPipeline(level: string): PipelineLogLevel {
  if (level === "error") return "error";
  if (level === "warning") return "warning";
  if (level === "success") return "success";
  return "info";
}

function cmsToEntry(log: CmsActivityLogRow): PipelineLogEntry {
  return {
    id: `cms-${log.id}`,
    timestamp: log.createdAt ?? new Date().toISOString(),
    category: "cms",
    level: cmsLevelToPipeline(log.level),
    source: "cms",
    title: log.action,
    message: log.message,
    meta: {
      resourceType: log.resourceType ?? null,
      resourceId: log.resourceId ?? null,
    },
  };
}

async function fetchVercelDeployments(): Promise<PipelineLogEntry[]> {
  if (!isVercelConfigured()) return [];

  const token = getVercelToken();
  const projectId = getVercelProjectId();
  const params = new URLSearchParams({ limit: "20" });
  if (projectId) params.set("projectId", projectId);

  try {
    const response = await fetch(`https://api.vercel.com/v6/deployments?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    });

    if (!response.ok) return [];

    const data = (await response.json()) as { deployments?: VercelDeployment[] };
    return (data.deployments ?? []).map((deploy) => {
      const state = deploy.state?.toLowerCase() ?? "unknown";
      const level: PipelineLogLevel =
        state === "ready" ? "success" : state === "error" || state === "canceled" ? "error" : "info";
      const commitMsg = deploy.meta?.githubCommitMessage?.split("\n")[0] ?? deploy.name;
      const ref = deploy.meta?.githubCommitRef ?? "main";
      const sha = deploy.meta?.githubCommitSha?.slice(0, 7) ?? "";

      return {
        id: `vercel-${deploy.uid}`,
        timestamp: new Date(deploy.created).toISOString(),
        category: "deploy" as const,
        level,
        source: "vercel",
        title: `Deploy ${state}`,
        message: `${commitMsg}${sha ? ` (${sha})` : ""} → ${deploy.url}`,
        meta: { branch: ref, state },
        link: `https://${deploy.url}`,
      };
    });
  } catch {
    return [];
  }
}

async function fetchGithubCommits(): Promise<PipelineLogEntry[]> {
  if (!isGithubConfigured()) return [];

  const [owner, repo] = getGithubRepo().split("/");
  if (!owner || !repo) return [];

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=20`,
      {
        headers: {
          Authorization: `Bearer ${getGithubToken()}`,
          Accept: "application/vnd.github+json",
        },
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) return [];

    const commits = (await response.json()) as GitHubCommit[];
    return commits.map((commit) => ({
      id: `github-${commit.sha}`,
      timestamp: commit.commit.author.date,
      category: "commit" as const,
      level: "info" as const,
      source: "github",
      title: "New commit",
      message: `${commit.commit.message.split("\n")[0]} — ${commit.author?.login ?? commit.commit.author.name}`,
      meta: { sha: commit.sha.slice(0, 7) },
      link: commit.html_url,
    }));
  } catch {
    return [];
  }
}

async function probeSitePerformance(): Promise<PipelineLogEntry[]> {
  const url = getSiteBaseUrl();
  const started = Date.now();

  try {
    const response = await fetch(url, {
      method: "HEAD",
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const elapsed = Date.now() - started;
    const ok = response.ok;
    const level: PipelineLogLevel = ok ? (elapsed > 2000 ? "warning" : "success") : "error";

    return [
      {
        id: `probe-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: "performance",
        level,
        source: "probe",
        title: ok ? "Health check" : "Health check failed",
        message: `${url} responded ${response.status} in ${elapsed}ms`,
        meta: { status: response.status, responseMs: elapsed },
      },
    ];
  } catch (error) {
    const elapsed = Date.now() - started;
    const message = error instanceof Error ? error.message : "Request failed";
    return [
      {
        id: `probe-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: "performance",
        level: "error",
        source: "probe",
        title: "Health check failed",
        message: `${url} — ${message} (${elapsed}ms)`,
        meta: { responseMs: elapsed },
      },
    ];
  }
}

function sentryIssuesToEntries(
  issues: Awaited<ReturnType<typeof getSentrySnapshot>>["issues"]
): PipelineLogEntry[] {
  return issues.map((issue) => ({
    id: `sentry-issue-${issue.id}`,
    timestamp: issue.lastSeen,
    category: "error",
    level: levelFromSentry(issue.level),
    source: "sentry",
    title: issue.shortId,
    message: `${issue.title} — ${issue.culprit} (${issue.count} events, ${issue.userCount} users)`,
    meta: { count: issue.count, users: issue.userCount },
    link: issue.permalink,
  }));
}

function sentryEventsToEntries(
  events: Awaited<ReturnType<typeof getSentrySnapshot>>["recentEvents"]
): PipelineLogEntry[] {
  return events.map((event) => ({
    id: `sentry-event-${event.id}`,
    timestamp: event.timestamp,
    category: "error",
    level: levelFromSentry(event.level),
    source: "sentry",
    title: event.title,
    message: event.message || event.culprit || event.title,
    meta: {
      platform: event.platform,
      environment: event.environment,
      release: event.release,
    },
    link: event.permalink,
  }));
}

function withinPeriod(timestamp: string, period: PipelineLogsPeriod) {
  const ms = Date.parse(timestamp);
  if (Number.isNaN(ms)) return false;
  const days = period === "day" ? 1 : 7;
  return ms >= Date.now() - days * 24 * 60 * 60 * 1000;
}

function countInPeriod(entries: PipelineLogEntry[], category: PipelineLogCategory, period: PipelineLogsPeriod) {
  return entries.filter((e) => e.category === category && withinPeriod(e.timestamp, period)).length;
}

async function fetchPipelineLogsUncached(period: PipelineLogsPeriod): Promise<PipelineLogsData> {
  const periodLabel = period === "day" ? "Last 24 hours" : "Last 7 days";
  const setupMessages: string[] = [];

  const [sentry, cmsLogs, cmsStats, vercelEntries, githubEntries, probeEntries, analytics] =
    await Promise.all([
      getSentrySnapshot(),
      listCmsActivityLogs({ limit: 100 }),
      getActivityLogStats(),
      fetchVercelDeployments(),
      fetchGithubCommits(),
      probeSitePerformance(),
      isPostHogQueryConfigured() ? getVisitorAnalytics("week") : null,
    ]);

  if (sentry.setupMessage) setupMessages.push(sentry.setupMessage);
  if (!isVercelConfigured()) {
    setupMessages.push("Add VERCEL_TOKEN (+ VERCEL_PROJECT_ID) to stream deployment events.");
  }
  if (!isGithubConfigured()) {
    setupMessages.push("Add GITHUB_TOKEN and GITHUB_REPO (owner/repo) to stream commit events.");
  }
  if (!isSentryDsnConfigured()) {
    setupMessages.push("Add SENTRY_DSN or NEXT_PUBLIC_SENTRY_DSN to capture client errors.");
  }

  const cmsEntries = cmsLogs.map(cmsToEntry);
  const sentryEntries = [...sentryEventsToEntries(sentry.recentEvents), ...sentryIssuesToEntries(sentry.issues)];

  const allEntries = [...vercelEntries, ...githubEntries, ...sentryEntries, ...probeEntries, ...cmsEntries]
    .filter((entry) => withinPeriod(entry.timestamp, period === "day" ? "day" : "week"))
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

  const weekEntries = [...vercelEntries, ...githubEntries, ...sentryEntries, ...probeEntries, ...cmsEntries];
  const responseMs = probeEntries[0]?.meta?.responseMs;
  const avgResponseMs = typeof responseMs === "number" ? responseMs : null;
  const uptimePercent = probeEntries[0]?.level === "success" || probeEntries[0]?.level === "warning" ? 100 : 0;

  return {
    period,
    periodLabel,
    kpis: {
      errors24h: sentry.errors24h,
      unresolvedErrors: sentry.unresolvedCount,
      deploysWeek: countInPeriod(weekEntries, "deploy", "week"),
      commitsWeek: countInPeriod(weekEntries, "commit", "week"),
      avgResponseMs,
      uptimePercent,
      cmsEventsToday: cmsStats.today,
      lcpMs: analytics?.webVitals.lcpMs ?? null,
    },
    entries: allEntries,
    configured: {
      sentry: isSentryApiConfigured(),
      sentryDsn: isSentryDsnConfigured(),
      vercel: isVercelConfigured(),
      github: isGithubConfigured(),
      posthog: isPostHogQueryConfigured(),
    },
    setupMessages,
    lastSyncedAt: new Date().toISOString(),
    cacheNote: "Sentry cached 15 min · Vercel/GitHub fetched on refresh.",
  };
}

const getCachedPipelineLogsDay = unstable_cache(
  () => fetchPipelineLogsUncached("day"),
  ["pipeline-logs-day"],
  { revalidate: 10 * 60 }
);

const getCachedPipelineLogsWeek = unstable_cache(
  () => fetchPipelineLogsUncached("week"),
  ["pipeline-logs-week"],
  { revalidate: 10 * 60 }
);

export async function getPipelineLogs(
  period: PipelineLogsPeriod = "week",
  options?: { fresh?: boolean }
): Promise<PipelineLogsData> {
  if (options?.fresh) {
    return fetchPipelineLogsUncached(period);
  }
  return period === "day" ? getCachedPipelineLogsDay() : getCachedPipelineLogsWeek();
}
