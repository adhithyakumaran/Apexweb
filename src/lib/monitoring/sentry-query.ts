import { unstable_cache } from "next/cache";
import {
  getSentryAuthToken,
  getSentryOrg,
  getSentryProject,
  isSentryApiConfigured,
} from "@/lib/monitoring/sentry-config";

export type SentryIssue = {
  id: string;
  shortId: string;
  title: string;
  culprit: string;
  level: string;
  count: number;
  userCount: number;
  firstSeen: string;
  lastSeen: string;
  permalink: string;
  status: string;
};

export type SentryEvent = {
  id: string;
  title: string;
  message: string;
  level: string;
  timestamp: string;
  platform: string;
  environment: string | null;
  release: string | null;
  culprit: string | null;
  permalink: string;
};

export type SentrySnapshot = {
  configured: boolean;
  issues: SentryIssue[];
  recentEvents: SentryEvent[];
  errors24h: number;
  unresolvedCount: number;
  lastSyncedAt: string | null;
  setupMessage?: string;
};

type SentryApiIssue = {
  id: string;
  shortId: string;
  title: string;
  culprit: string;
  level: string;
  count: string;
  userCount: number;
  firstSeen: string;
  lastSeen: string;
  permalink: string;
  status: string;
};

type SentryApiEvent = {
  id: string;
  title: string;
  message: string;
  level: string;
  dateCreated: string;
  platform: string;
  tags?: Array<{ key: string; value: string }>;
  release?: { version: string } | null;
  culprit?: string | null;
};

async function sentryFetch<T>(path: string): Promise<T> {
  const token = getSentryAuthToken();
  const response = await fetch(`https://sentry.io/api/0${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Sentry API ${response.status}: ${body.slice(0, 200)}`);
  }

  return response.json() as Promise<T>;
}

function mapIssue(issue: SentryApiIssue): SentryIssue {
  return {
    id: issue.id,
    shortId: issue.shortId,
    title: issue.title,
    culprit: issue.culprit,
    level: issue.level,
    count: Number(issue.count) || 0,
    userCount: issue.userCount ?? 0,
    firstSeen: issue.firstSeen,
    lastSeen: issue.lastSeen,
    permalink: issue.permalink,
    status: issue.status,
  };
}

function mapEvent(event: SentryApiEvent, org: string, project: string): SentryEvent {
  const envTag = event.tags?.find((tag) => tag.key === "environment")?.value ?? null;
  return {
    id: event.id,
    title: event.title,
    message: event.message,
    level: event.level,
    timestamp: event.dateCreated,
    platform: event.platform,
    environment: envTag,
    release: event.release?.version ?? null,
    culprit: event.culprit ?? null,
    permalink: `https://sentry.io/organizations/${org}/issues/?query=${encodeURIComponent(event.title)}&project=${project}`,
  };
}

async function fetchSentrySnapshotUncached(): Promise<SentrySnapshot> {
  if (!isSentryApiConfigured()) {
    return {
      configured: false,
      issues: [],
      recentEvents: [],
      errors24h: 0,
      unresolvedCount: 0,
      lastSyncedAt: null,
      setupMessage:
        "Add SENTRY_AUTH_TOKEN, SENTRY_ORG, and SENTRY_PROJECT to load crash reports from Sentry.",
    };
  }

  const org = getSentryOrg();
  const project = getSentryProject();
  const base = `/projects/${org}/${project}`;

  try {
    const [issues, events] = await Promise.all([
      sentryFetch<SentryApiIssue[]>(`${base}/issues/?statsPeriod=7d&query=is:unresolved&limit=25`),
      sentryFetch<SentryApiEvent[]>(`${base}/events/?statsPeriod=24h&limit=30`),
    ]);

    const mappedIssues = issues.map(mapIssue);
    const mappedEvents = events.map((event) => mapEvent(event, org, project));
    const errors24h = mappedEvents.filter((event) => event.level === "error" || event.level === "fatal").length;

    return {
      configured: true,
      issues: mappedIssues,
      recentEvents: mappedEvents,
      errors24h,
      unresolvedCount: mappedIssues.length,
      lastSyncedAt: new Date().toISOString(),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load Sentry data";
    return {
      configured: true,
      issues: [],
      recentEvents: [],
      errors24h: 0,
      unresolvedCount: 0,
      lastSyncedAt: new Date().toISOString(),
      setupMessage: message,
    };
  }
}

const getCachedSentrySnapshot = unstable_cache(
  fetchSentrySnapshotUncached,
  ["sentry-snapshot"],
  { revalidate: 15 * 60 }
);

export async function getSentrySnapshot(options?: { fresh?: boolean }): Promise<SentrySnapshot> {
  if (options?.fresh) {
    return fetchSentrySnapshotUncached();
  }
  return getCachedSentrySnapshot();
}
