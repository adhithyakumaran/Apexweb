import { unstable_cache } from "next/cache";
import {
  getPostHogHost,
  getPostHogPersonalApiKey,
  getPostHogProjectId,
  isPostHogCaptureConfigured,
  isPostHogQueryConfigured,
} from "@/lib/analytics/posthog-config";

export type VisitorKpis = {
  pageviews7d: number;
  pageviews24h: number;
  uniqueVisitors7d: number;
  uniqueVisitors24h: number;
  sessions7d: number;
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

const EMPTY_KPIS: VisitorKpis = {
  pageviews7d: 0,
  pageviews24h: 0,
  uniqueVisitors7d: 0,
  uniqueVisitors24h: 0,
  sessions7d: 0,
  avgSessionSeconds: 0,
  pagesPerSession: 0,
  bounceRate: 0,
};

const ANALYTICS_QUERY = `
SELECT row_type, label, toFloat64(value) AS value
FROM (
  SELECT 'kpi' AS row_type, 'pageviews_7d' AS label, count() AS value
  FROM events
  WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 7 DAY

  UNION ALL
  SELECT 'kpi', 'pageviews_24h', count()
  FROM events
  WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 1 DAY

  UNION ALL
  SELECT 'kpi', 'visitors_7d', uniqExact(distinct_id)
  FROM events
  WHERE timestamp >= now() - INTERVAL 7 DAY

  UNION ALL
  SELECT 'kpi', 'visitors_24h', uniqExact(distinct_id)
  FROM events
  WHERE timestamp >= now() - INTERVAL 1 DAY

  UNION ALL
  SELECT 'kpi', 'sessions_7d', uniqExact(properties.$session_id)
  FROM events
  WHERE timestamp >= now() - INTERVAL 7 DAY AND properties.$session_id IS NOT NULL

  UNION ALL
  SELECT 'kpi', 'avg_session_seconds',
    ifNull(avgIf(toFloat(properties.$session_duration), event = '$pageleave' AND toFloat(properties.$session_duration) > 0), 0)
  FROM events
  WHERE timestamp >= now() - INTERVAL 7 DAY

  UNION ALL
  SELECT 'kpi', 'bounce_rate',
    ifNull(avgIf(if(toFloat(properties.$session_duration) < 10, 1, 0), event = '$pageleave'), 0) * 100
  FROM events
  WHERE timestamp >= now() - INTERVAL 7 DAY

  UNION ALL
  SELECT 'trend', toString(day), views FROM (
    SELECT toDate(timestamp) AS day, count() AS views
    FROM events
    WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 7 DAY
    GROUP BY day
  )

  UNION ALL
  SELECT 'page', label, value FROM (
    SELECT ifNull(nullIf(properties.$pathname, ''), '/') AS label, count() AS value
    FROM events
    WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 7 DAY
    GROUP BY label
    ORDER BY value DESC
    LIMIT 8
  )

  UNION ALL
  SELECT 'referrer', label, value FROM (
    SELECT ifNull(nullIf(properties.$referring_domain, ''), 'Direct') AS label, count() AS value
    FROM events
    WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 7 DAY
    GROUP BY label
    ORDER BY value DESC
    LIMIT 8
  )

  UNION ALL
  SELECT 'country', label, value FROM (
    SELECT ifNull(nullIf(properties.$geoip_country_code, ''), 'Unknown') AS label, count() AS value
    FROM events
    WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 7 DAY
    GROUP BY label
    ORDER BY value DESC
    LIMIT 8
  )

  UNION ALL
  SELECT 'device', label, value FROM (
    SELECT ifNull(nullIf(properties.$device_type, ''), 'Unknown') AS label, count() AS value
    FROM events
    WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 7 DAY
    GROUP BY label
    ORDER BY value DESC
    LIMIT 5
  )

  UNION ALL
  SELECT 'browser', label, value FROM (
    SELECT ifNull(nullIf(properties.$browser, ''), 'Unknown') AS label, count() AS value
    FROM events
    WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 7 DAY
    GROUP BY label
    ORDER BY value DESC
    LIMIT 5
  )

  UNION ALL
  SELECT 'exit', label, value FROM (
    SELECT ifNull(nullIf(properties.$pathname, ''), '/') AS label, count() AS value
    FROM events
    WHERE event = '$pageleave' AND timestamp >= now() - INTERVAL 7 DAY
    GROUP BY label
    ORDER BY value DESC
    LIMIT 8
  )

  UNION ALL
  SELECT 'vital', 'lcp_ms',
    ifNull(avgIf(toFloat(properties.$web_vitals_LCP_value), event = '$web_vitals'), 0)
  FROM events
  WHERE timestamp >= now() - INTERVAL 7 DAY

  UNION ALL
  SELECT 'vital', 'fcp_ms',
    ifNull(avgIf(toFloat(properties.$web_vitals_FCP_value), event = '$web_vitals'), 0)
  FROM events
  WHERE timestamp >= now() - INTERVAL 7 DAY

  UNION ALL
  SELECT 'vital', 'cls',
    ifNull(avgIf(toFloat(properties.$web_vitals_CLS_value), event = '$web_vitals'), 0)
  FROM events
  WHERE timestamp >= now() - INTERVAL 7 DAY

  UNION ALL
  SELECT 'vital', 'inp_ms',
    ifNull(avgIf(toFloat(properties.$web_vitals_INP_value), event = '$web_vitals'), 0)
  FROM events
  WHERE timestamp >= now() - INTERVAL 7 DAY

  UNION ALL
  SELECT 'vital', 'samples', count()
  FROM events
  WHERE event = '$web_vitals' AND timestamp >= now() - INTERVAL 7 DAY
)
`;

async function runHogQLQuery(): Promise<HogQLResponse> {
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
        query: ANALYTICS_QUERY,
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

function parseHogQLResults(results: unknown[][]): Omit<VisitorAnalyticsData, "configured" | "periodLabel" | "cacheNote" | "setupMessage"> {
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
        if (label === "pageviews_7d") kpis.pageviews7d = value;
        if (label === "pageviews_24h") kpis.pageviews24h = value;
        if (label === "visitors_7d") kpis.uniqueVisitors7d = value;
        if (label === "visitors_24h") kpis.uniqueVisitors24h = value;
        if (label === "sessions_7d") kpis.sessions7d = value;
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
    kpis.sessions7d > 0 ? Math.round((kpis.pageviews7d / kpis.sessions7d) * 10) / 10 : 0;

  const trend: TrendPoint[] = [...trendMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, pageviews]) => ({
      day: new Date(day).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
      pageviews,
    }));

  const pageTotal = pages.reduce((sum, row) => sum + row.value, 0);

  return {
    kpis,
    trend,
    topPages: toRanked(pages, pageTotal),
    topReferrers: toRanked(referrers, kpis.pageviews7d),
    topCountries: toRanked(countries, kpis.pageviews7d),
    devices: toRanked(devices, kpis.pageviews7d),
    browsers: toRanked(browsers, kpis.pageviews7d),
    exitPages: toRanked(exits, exits.reduce((sum, row) => sum + row.value, 0)),
    webVitals: vitals,
    lastSyncedAt: new Date().toISOString(),
  };
}

function emptyAnalytics(setupMessage?: string): VisitorAnalyticsData {
  return {
    configured: {
      capture: isPostHogCaptureConfigured(),
      query: isPostHogQueryConfigured(),
    },
    periodLabel: "Last 7 days",
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

async function fetchVisitorAnalyticsUncached(): Promise<VisitorAnalyticsData> {
  const base = emptyAnalytics();

  if (!base.configured.capture) {
    return emptyAnalytics("Add NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN and NEXT_PUBLIC_POSTHOG_HOST to start tracking visitors.");
  }

  if (!base.configured.query) {
    return emptyAnalytics(
      "Tracking is active. Add POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID in Vercel to load the dashboard (1 API query, cached 45 min)."
    );
  }

  try {
    const response = await runHogQLQuery();
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

const getCachedVisitorAnalytics = unstable_cache(
  fetchVisitorAnalyticsUncached,
  ["visitor-analytics-posthog"],
  { revalidate: 45 * 60 }
);

export async function getVisitorAnalytics(): Promise<VisitorAnalyticsData> {
  return getCachedVisitorAnalytics();
}
