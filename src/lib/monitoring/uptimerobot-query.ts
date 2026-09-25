/**
 * UptimeRobot API client for /admin/uptime.
 *
 * Fetches monitor status from the UptimeRobot REST API and maps
 * status codes (2=up, 8/9=down, 0=paused). Results are cached
 * to avoid hitting API rate limits on every page load.
 *
 * Requires UPTIMEROBOT_API_KEY. Status page URL is display-only.
 */
import { unstable_cache } from "next/cache";
import {
  getUptimeRobotApiKey,
  getUptimeRobotDashboardUrl,
  getUptimeRobotStatusPageUrl,
  isUptimeRobotApiConfigured,
} from "@/lib/monitoring/uptimerobot-config";

export type UptimeRobotMonitorStatus = "up" | "down" | "paused" | "unknown";

export type UptimeRobotMonitor = {
  id: number;
  name: string;
  url: string;
  status: UptimeRobotMonitorStatus;
  statusLabel: string;
  responseMs: number | null;
  uptimeRatio: number | null;
};

export type UptimeRobotSnapshot = {
  configured: boolean;
  dashboardUrl: string;
  statusPageUrl: string;
  monitors: UptimeRobotMonitor[];
  upCount: number;
  downCount: number;
  pausedCount: number;
  avgResponseMs: number | null;
  lastSyncedAt: string | null;
  setupMessage?: string;
};

type ApiMonitor = {
  id: number;
  friendly_name: string;
  url: string;
  status: number;
  average_response_time?: string;
  custom_uptime_ratio?: string;
};

type ApiResponse = {
  stat: string;
  error?: { message?: string };
  monitors?: ApiMonitor[];
};

function mapStatus(code: number): { status: UptimeRobotMonitorStatus; label: string } {
  switch (code) {
    case 2:
      return { status: "up", label: "Up" };
    case 8:
    case 9:
      return { status: "down", label: "Down" };
    case 0:
      return { status: "paused", label: "Paused" };
    default:
      return { status: "unknown", label: "Unknown" };
  }
}

async function fetchUptimeRobotUncached(): Promise<UptimeRobotSnapshot> {
  const dashboardUrl = getUptimeRobotDashboardUrl();
  const statusPageUrl = getUptimeRobotStatusPageUrl();

  if (!isUptimeRobotApiConfigured()) {
    return {
      configured: false,
      dashboardUrl,
      statusPageUrl,
      monitors: [],
      upCount: 0,
      downCount: 0,
      pausedCount: 0,
      avgResponseMs: null,
      lastSyncedAt: null,
      setupMessage:
        "Add UPTIMEROBOT_API_KEY in Vercel to load monitors here. You can still open your UptimeRobot dashboard and status page below.",
    };
  }

  try {
    const body = new URLSearchParams({
      api_key: getUptimeRobotApiKey(),
      format: "json",
      logs: "0",
      response_times: "1",
      custom_uptime_ratios: "1",
    });

    const response = await fetch("https://api.uptimerobot.com/v2/getMonitors", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Cache-Control": "no-cache" },
      body,
      next: { revalidate: 0 },
    });

    const data = (await response.json()) as ApiResponse;
    if (data.stat !== "ok") {
      throw new Error(data.error?.message ?? "UptimeRobot API error");
    }

    const monitors: UptimeRobotMonitor[] = (data.monitors ?? []).map((monitor) => {
      const mapped = mapStatus(monitor.status);
      return {
        id: monitor.id,
        name: monitor.friendly_name,
        url: monitor.url,
        status: mapped.status,
        statusLabel: mapped.label,
        responseMs: monitor.average_response_time ? Number(monitor.average_response_time) : null,
        uptimeRatio: monitor.custom_uptime_ratio ? Number(monitor.custom_uptime_ratio) : null,
      };
    });

    const responseSamples = monitors
      .map((m) => m.responseMs)
      .filter((ms): ms is number => ms != null && ms > 0);

    return {
      configured: true,
      dashboardUrl,
      statusPageUrl,
      monitors,
      upCount: monitors.filter((m) => m.status === "up").length,
      downCount: monitors.filter((m) => m.status === "down").length,
      pausedCount: monitors.filter((m) => m.status === "paused").length,
      avgResponseMs:
        responseSamples.length > 0
          ? Math.round(responseSamples.reduce((a, b) => a + b, 0) / responseSamples.length)
          : null,
      lastSyncedAt: new Date().toISOString(),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load UptimeRobot";
    return {
      configured: true,
      dashboardUrl,
      statusPageUrl,
      monitors: [],
      upCount: 0,
      downCount: 0,
      pausedCount: 0,
      avgResponseMs: null,
      lastSyncedAt: new Date().toISOString(),
      setupMessage: message,
    };
  }
}

const getCachedUptimeRobot = unstable_cache(
  fetchUptimeRobotUncached,
  ["uptimerobot-snapshot"],
  { revalidate: 5 * 60 }
);

export async function getUptimeRobotSnapshot(options?: { fresh?: boolean }): Promise<UptimeRobotSnapshot> {
  if (options?.fresh) return fetchUptimeRobotUncached();
  return getCachedUptimeRobot();
}
