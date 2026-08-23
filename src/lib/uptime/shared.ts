export type UptimeCheckMethod = "GET" | "HEAD";

export type UptimeCheck = {
  id: number;
  name: string;
  url: string;
  method: UptimeCheckMethod;
  expectedStatus: number;
  timeoutMs: number;
  enabled: boolean;
};

export type UptimeCheckResult = {
  id: number;
  checkId: number;
  ok: boolean;
  statusCode: number | null;
  responseMs: number;
  error: string | null;
  checkedAt: string;
};

export const DEFAULT_UPTIME_CHECKS: Omit<UptimeCheck, "id">[] = [
  { name: "Homepage", url: "/", method: "GET", expectedStatus: 200, timeoutMs: 10000, enabled: true },
  { name: "Agents hub", url: "/agents", method: "GET", expectedStatus: 200, timeoutMs: 10000, enabled: true },
  { name: "Contact page", url: "/contact", method: "GET", expectedStatus: 200, timeoutMs: 10000, enabled: true },
  { name: "Articles", url: "/articles", method: "GET", expectedStatus: 200, timeoutMs: 10000, enabled: true },
  { name: "Search API", url: "/api/search?q=qa", method: "GET", expectedStatus: 200, timeoutMs: 8000, enabled: true },
];

export type UptimeStats = {
  totalChecks: number;
  enabledChecks: number;
  upNow: number;
  downNow: number;
  uptimePercent7d: number;
  avgResponseMs: number | null;
  lastRunAt: string | null;
};
