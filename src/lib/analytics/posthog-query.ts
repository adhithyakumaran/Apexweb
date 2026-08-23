import { unstable_cache } from "next/cache";
import {
  getPostHogHost,
  getPostHogPersonalApiKey,
  getPostHogProjectId,
  isPostHogCaptureConfigured,
  isPostHogQueryConfigured,
} from "@/lib/analytics/posthog-config";

export type AnalyticsPeriod = "week" | "month";

export type VisitorKpis = {
  pageviewsPeriod: number;
  pageviews24h: number;
  uniqueVisitorsPeriod: number;
  uniqueVisitors24h: number;
  sessionsPeriod: number;
  avgSessionSeconds: number;
  pagesPerSession: number;
  bounceRate: number;
};

export type RankedRow = {
  label: string;
  value: number;
  share: number;
};

export type TrendPoint = {
  day: string;
  pageviews: number;
};

export type WebVitals = {
  lcpMs: number | null;
  fcpMs: number | null;
  cls: number | null;
  inpMs: number | null;
  samples: number;
};

export type VisitorAnalyticsData = {
  period: AnalyticsPeriod;
  configured: {
    capture: boolean;
    query: boolean;
  };
  periodLabel: string;
  kpis: VisitorKpis;
  trend: TrendPoint[];
  topPages: RankedRow[];
  topReferrers: RankedRow[];
  topCountries: RankedRow[];
  devices: RankedRow[];
  browsers: RankedRow[];
  exitPages: RankedRow[];
  webVitals: WebVitals;
  lastSyncedAt: string | null;
  cacheNote: string;
  setupMessage?: string;
};

type HogQLResponse = {
  results?: unknown[][];
  columns?: string[];
  error?: string;
};

const PERIOD_DAYS: Record<AnalyticsPeriod, number> = {
  week: 7,
  month: 30,
};

const PERIOD_LABELS: Record<AnalyticsPeriod, string> = {
  week: "Last 7 days",
  month: "Last 30 days",
};

const EMPTY_KPIS: VisitorKpis = {
  pageviewsPeriod: 0,
  pageviews24h: 0,
  uniqueVisitorsPeriod: 0,
  uniqueVisitors24h: 0,
  sessionsPeriod: 0,
  avgSessionSeconds: 0,
  pagesPerSession: 0,
  bounceRate: 0,
};

function buildAnalyticsQuery(days: number) {
  return `
SELECT row_type, label, toFloat(value) AS value
FROM (
  SELECT 'kpi' AS row_type, 'pageviews_period' AS label, count() AS value
  FROM events
  WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${days} DAY

  UNION ALL
  SELECT 'kpi', 'pageviews_24h', count()
  FROM events
  WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 1 DAY

  UNION ALL
  SELECT 'kpi', 'visitors_period', uniqExact(distinct_id)
  FROM events
  WHERE timestamp >= now() - INTERVAL ${days} DAY

  UNION ALL
  SELECT 'kpi', 'visitors_24h', uniqExact(distinct_id)
  FROM events
  WHERE timestamp >= now() - INTERVAL 1 DAY

  UNION ALL
  SELECT 'kpi', 'sessions_period', uniqExact(properties.$session_id)
  FROM events
  WHERE timestamp >= now() - INTERVAL ${days} DAY AND properties.$session_id IS NOT NULL

  UNION ALL
  SELECT 'kpi', 'avg_session_seconds',
    ifNull(avgIf(toFloat(properties.$session_duration), event = '$pageleave' AND toFloat(properties.$session_duration) > 0), 0)
  FROM events
  WHERE timestamp >= now() - INTERVAL ${days} DAY

  UNION ALL
  SELECT 'kpi', 'bounce_rate',
    ifNull(avgIf(if(toFloat(properties.$session_duration) < 10, 1, 0), event = '$pageleave'), 0) * 100
  FROM events
  WHERE timestamp >= now() - INTERVAL ${days} DAY

  UNION ALL
  SELECT 'trend', toString(day), views FROM (
    SELECT toDate(timestamp) AS day, count() AS views
    FROM events
    WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${days} DAY
    GROUP BY day
  )

  UNION ALL
  SELECT 'page', label, value FROM (
    SELECT ifNull(nullIf(properties.$pathname, ''), '/') AS label, count() AS value
    FROM events
    WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${days} DAY
    GROUP BY label
    ORDER BY value DESC
    LIMIT 8
  )

  UNION ALL
  SELECT 'referrer', label, value FROM (
    SELECT ifNull(nullIf(properties.$referring_domain, ''), 'Direct') AS label, count() AS value
    FROM events
    WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${days} DAY
    GROUP BY label
    ORDER BY value DESC
    LIMIT 8
  )

  UNION ALL
  SELECT 'country', label, value FROM (
    SELECT ifNull(nullIf(properties.$geoip_country_code, ''), 'Unknown') AS label, count() AS value
    FROM events
    WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${days} DAY
    GROUP BY label
    ORDER BY value DESC
    LIMIT 8
  )

  UNION ALL
  SELECT 'device', label, value FROM (
    SELECT ifNull(nullIf(properties.$device_type, ''), 'Unknown') AS label, count() AS value
    FROM events
    WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${days} DAY
    GROUP BY label
    ORDER BY value DESC
    LIMIT 5
  )

  UNION ALL
  SELECT 'browser', label, value FROM (
    SELECT ifNull(nullIf(properties.$browser, ''), 'Unknown') AS label, count() AS value
    FROM events
    WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${days} DAY
    GROUP BY label
    ORDER BY value DESC
    LIMIT 5
  )

  UNION ALL
  SELECT 'exit', label, value FROM (
    SELECT ifNull(nullIf(properties.$pathname, ''), '/') AS label, count() AS value
    FROM events
    WHERE event = '$pageleave' AND timestamp >= now() - INTERVAL ${days} DAY
    GROUP BY label
    ORDER BY value DESC
    LIMIT 8
  )

  UNION ALL
  SELECT 'vital', 'lcp_ms',
    ifNull(avgIf(toFloat(properties.$web_vitals_LCP_value), event = '$web_vitals'), 0)
  FROM events
  WHERE timestamp >= now() - INTERVAL ${days} DAY

  UNION ALL
  SELECT 'vital', 'fcp_ms',
    ifNull(avgIf(toFloat(properties.$web_vitals_FCP_value), event = '$web_vitals'), 0)
  FROM events
  WHERE timestamp >= now() - INTERVAL ${days} DAY

  UNION ALL
  SELECT 'vital', 'cls',
    ifNull(avgIf(toFloat(properties.$web_vitals_CLS_value), event = '$web_vitals'), 0)
  FROM events
  WHERE timestamp >= now() - INTERVAL ${days} DAY

  UNION ALL
  SELECT 'vital', 'inp_ms',
    ifNull(avgIf(toFloat(properties.$web_vitals_INP_value), event = '$web_vitals'), 0)
  FROM events
  WHERE timestamp >= now() - INTERVAL ${days} DAY

  UNION ALL
  SELECT 'vital', 'samples', count()
  FROM events
  WHERE event = '$web_vitals' AND timestamp >= now() - INTERVAL ${days} DAY
)
`;
}

async function runHogQLQuery(days: number): Promise<HogQLResponse> {
  const apiKey = getPostHogPersonalApiKey();
  const projectId = getPostHogProjectId();
  const host = getPostHogHost().replace(/\/$/, "");

  const response = await fetch(`${host}/api/projects/${projectId}/query/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query: {
        kind: "HogQLQuery",
        query: buildAnalyticsQuery(days),
      },
      refresh: "force_cache",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PostHog query failed (${response.status}): ${text.slice(0, 240)}`);
  }

  return (await response.json()) as HogQLResponse;
}

function toRanked(rows: { label: string; value: number }[], total: number): RankedRow[] {
  return rows
    .filter((row) => row.value > 0)
    .map((row) => ({
      label: row.label,
      value: row.value,
      share: total > 0 ? Math.round((row.value / total) * 1000) / 10 : 0,
    }));
}

function parseHogQLResults(
  results: unknown[][]
): Omit<VisitorAnalyticsData, "configured" | "periodLabel" | "cacheNote" | "setupMessage" | "period"> {
  const kpis = { ...EMPTY_KPIS };
  const trendMap = new Map<string, number>();
  const pages: { label: string; value: number }[] = [];
  const referrers: { label: string; value: number }[] = [];
  const countries: { label: string; value: number }[] = [];
  const devices: { label: string; value: number }[] = [];
  const browsers: { label: string; value: number }[] = [];
  const exits: { label: string; value: number }[] = [];
  const vitals: WebVitals = {
    lcpMs: null,
    fcpMs: null,
    cls: null,
    inpMs: null,
    samples: 0,
  };

  for (const row of results) {
    const rowType = String(row[0] ?? "");
    const label = String(row[1] ?? "");
    const value = Number(row[2] ?? 0);

    switch (rowType) {
      case "kpi":
        if (label === "pageviews_period") kpis.pageviewsPeriod = value;
        if (label === "pageviews_24h") kpis.pageviews24h = value;
        if (label === "visitors_period") kpis.uniqueVisitorsPeriod = value;
        if (label === "visitors_24h") kpis.uniqueVisitors24h = value;
        if (label === "sessions_period") kpis.sessionsPeriod = value;
        if (label === "avg_session_seconds") kpis.avgSessionSeconds = value;
        if (label === "bounce_rate") kpis.bounceRate = value;
        break;
      case "trend":
        trendMap.set(label, value);
        break;
      case "page":
        pages.push({ label, value });
        break;
      case "referrer":
        referrers.push({ label, value });
        break;
      case "country":
        countries.push({ label, value });
        break;
      case "device":
        devices.push({ label, value });
        break;
      case "browser":
        browsers.push({ label, value });
        break;
      case "exit":
        exits.push({ label, value });
        break;
      case "vital":
        if (label === "lcp_ms" && value > 0) vitals.lcpMs = value;
        if (label === "fcp_ms" && value > 0) vitals.fcpMs = value;
        if (label === "cls" && value > 0) vitals.cls = value;
        if (label === "inp_ms" && value > 0) vitals.inpMs = value;
        if (label === "samples") vitals.samples = value;
        break;
      default:
        break;
    }
  }

  kpis.pagesPerSession =
    kpis.sessionsPeriod > 0
      ? Math.round((kpis.pageviewsPeriod / kpis.sessionsPeriod) * 10) / 10
      : 0;

  const trend: TrendPoint[] = [...trendMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, pageviews]) => ({
      day: new Date(day).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      pageviews,
    }));

  const pageTotal = pages.reduce((sum, row) => sum + row.value, 0);

  return {
    kpis,
    trend,
    topPages: toRanked(pages, pageTotal),
    topReferrers: toRanked(referrers, kpis.pageviewsPeriod),
    topCountries: toRanked(countries, kpis.pageviewsPeriod),
    devices: toRanked(devices, kpis.pageviewsPeriod),
    browsers: toRanked(browsers, kpis.pageviewsPeriod),
    exitPages: toRanked(exits, exits.reduce((sum, row) => sum + row.value, 0)),
    webVitals: vitals,
    lastSyncedAt: new Date().toISOString(),
  };
}

function emptyAnalytics(period: AnalyticsPeriod, setupMessage?: string): VisitorAnalyticsData {
  return {
    period,
    configured: {
      capture: isPostHogCaptureConfigured(),
      query: isPostHogQueryConfigured(),
    },
    periodLabel: PERIOD_LABELS[period],
    kpis: EMPTY_KPIS,
    trend: [],
    topPages: [],
    topReferrers: [],
    topCountries: [],
    devices: [],
    browsers: [],
    exitPages: [],
    webVitals: { lcpMs: null, fcpMs: null, cls: null, inpMs: null, samples: 0 },
    lastSyncedAt: null,
    cacheNote: "Uses one PostHog query per sync (cached 45 min).",
    setupMessage,
  };
}

async function fetchVisitorAnalyticsUncached(period: AnalyticsPeriod): Promise<VisitorAnalyticsData> {
  const base = emptyAnalytics(period);

  if (!base.configured.capture) {
    return emptyAnalytics(
      period,
      "Add NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN and NEXT_PUBLIC_POSTHOG_HOST to start tracking visitors."
    );
  }

  if (!base.configured.query) {
    return emptyAnalytics(
      period,
      "Tracking is active. Add POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID in Vercel to load the dashboard (1 API query, cached 45 min)."
    );
  }

  try {
    const response = await runHogQLQuery(PERIOD_DAYS[period]);
    if (!response.results?.length) {
      return {
        ...base,
        setupMessage: "PostHog is connected. Data will appear after visitors browse the public site.",
        lastSyncedAt: new Date().toISOString(),
      };
    }

    const parsed = parseHogQLResults(response.results);
    return {
      ...base,
      ...parsed,
      setupMessage: undefined,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load PostHog analytics";
    return {
      ...base,
      setupMessage: message,
      lastSyncedAt: new Date().toISOString(),
    };
  }
}

const getCachedVisitorAnalyticsWeek = unstable_cache(
  () => fetchVisitorAnalyticsUncached("week"),
  ["visitor-analytics-posthog-week"],
  { revalidate: 45 * 60 }
);

const getCachedVisitorAnalyticsMonth = unstable_cache(
  () => fetchVisitorAnalyticsUncached("month"),
  ["visitor-analytics-posthog-month"],
  { revalidate: 45 * 60 }
);

export async function getVisitorAnalytics(period: AnalyticsPeriod = "week"): Promise<VisitorAnalyticsData> {
  return period === "month" ? getCachedVisitorAnalyticsMonth() : getCachedVisitorAnalyticsWeek();
}

export function analyticsToCsv(data: VisitorAnalyticsData): string {
  const lines: string[] = [
    `Apexweb Analytics Report`,
    `Period,${data.periodLabel}`,
    `Generated,${new Date().toISOString()}`,
    "",
    "KPI,Value",
    `Unique visitors,${data.kpis.uniqueVisitorsPeriod}`,
    `Page views,${data.kpis.pageviewsPeriod}`,
    `Sessions,${data.kpis.sessionsPeriod}`,
    `Avg session (seconds),${Math.round(data.kpis.avgSessionSeconds)}`,
    `Pages per session,${data.kpis.pagesPerSession}`,
    `Bounce rate (%),${data.kpis.bounceRate.toFixed(1)}`,
    "",
    "Date,Page views",
    ...data.trend.map((row) => `${row.day},${row.pageviews}`),
    "",
    "Top pages,Views,Share %",
    ...data.topPages.map((row) => `"${row.label}",${row.value},${row.share}`),
    "",
    "Traffic sources,Views,Share %",
    ...data.topReferrers.map((row) => `"${row.label}",${row.value},${row.share}`),
    "",
    "Countries,Views,Share %",
    ...data.topCountries.map((row) => `"${row.label}",${row.value},${row.share}`),
    "",
    "Devices,Views,Share %",
    ...data.devices.map((row) => `"${row.label}",${row.value},${row.share}`),
    "",
    "Browsers,Views,Share %",
    ...data.browsers.map((row) => `"${row.label}",${row.value},${row.share}`),
    "",
    "Web vital,Value",
    `LCP (ms),${data.webVitals.lcpMs ?? ""}`,
    `FCP (ms),${data.webVitals.fcpMs ?? ""}`,
    `CLS,${data.webVitals.cls ?? ""}`,
    `INP (ms),${data.webVitals.inpMs ?? ""}`,
    `Samples,${data.webVitals.samples}`,
  ];
  return lines.join("\n");
}

export function analyticsToPrintHtml(data: VisitorAnalyticsData): string {
  const section = (title: string, rows: RankedRow[]) => `
    <h2>${title}</h2>
    <table>
      <tr><th>Label</th><th>Views</th><th>Share</th></tr>
      ${rows.map((r) => `<tr><td>${r.label}</td><td>${r.value}</td><td>${r.share}%</td></tr>`).join("")}
    </table>`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Analytics Report</title>
<style>
  body { font-family: system-ui, sans-serif; padding: 40px; color: #111; }
  h1 { font-size: 20px; margin-bottom: 4px; }
  p { color: #666; font-size: 13px; }
  h2 { font-size: 14px; margin: 24px 0 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #eee; }
  th { color: #666; font-weight: 500; }
  .kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0; }
  .kpi { border: 1px solid #eee; padding: 12px; border-radius: 4px; }
  .kpi label { font-size: 11px; color: #666; text-transform: uppercase; }
  .kpi value { display: block; font-size: 22px; font-weight: 600; margin-top: 4px; }
</style></head><body>
  <h1>Website Analytics</h1>
  <p>${data.periodLabel} · Generated ${new Date().toLocaleString()}</p>
  <div class="kpis">
    <div class="kpi"><label>Unique visitors</label><value>${data.kpis.uniqueVisitorsPeriod.toLocaleString()}</value></div>
    <div class="kpi"><label>Page views</label><value>${data.kpis.pageviewsPeriod.toLocaleString()}</value></div>
    <div class="kpi"><label>Sessions</label><value>${data.kpis.sessionsPeriod.toLocaleString()}</value></div>
    <div class="kpi"><label>Avg session</label><value>${Math.round(data.kpis.avgSessionSeconds)}s</value></div>
    <div class="kpi"><label>Pages / session</label><value>${data.kpis.pagesPerSession}</value></div>
    <div class="kpi"><label>Bounce rate</label><value>${data.kpis.bounceRate.toFixed(1)}%</value></div>
  </div>
  ${section("Top pages", data.topPages)}
  ${section("Traffic sources", data.topReferrers)}
  ${section("Countries", data.topCountries)}
</body></html>`;
}
