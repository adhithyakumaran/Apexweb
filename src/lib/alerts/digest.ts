import { getPipelineLogs } from "@/lib/monitoring/pipeline-logs";
import { getUptimeRobotSnapshot } from "@/lib/monitoring/uptimerobot-query";
import { dispatchAlert } from "@/lib/alerts/dispatch";
import { getAlertSettings } from "@/lib/alerts/settings";
import { siteConfig } from "@/config/site";
import { getSiteBaseUrl } from "@/lib/site-url";

export async function buildWeeklyDigestContent() {
  const [uptime, pipeline] = await Promise.all([
    getUptimeRobotSnapshot(),
    getPipelineLogs("week"),
  ]);

  const lines = [
    `Weekly digest — ${siteConfig.name}`,
    `Period: last 7 days`,
    ``,
    `UptimeRobot:`,
    `  Monitors up: ${uptime.upCount}`,
    `  Monitors down: ${uptime.downCount}`,
    `  Avg response: ${uptime.avgResponseMs != null ? `${uptime.avgResponseMs}ms` : "—"}`,
    ``,
    ...uptime.monitors.map((m) => `  • ${m.name}: ${m.statusLabel}${m.uptimeRatio != null ? ` (${m.uptimeRatio}%)` : ""}`),
    ``,
    `Pipeline (7d):`,
    `  Errors (24h): ${pipeline.kpis.errors24h}`,
    `  Deploys: ${pipeline.kpis.deploysWeek}`,
    `  Commits: ${pipeline.kpis.commitsWeek}`,
    `  CMS events today: ${pipeline.kpis.cmsEventsToday}`,
    ``,
    `Dashboard: ${getSiteBaseUrl()}/admin/uptime`,
  ];

  if (uptime.downCount > 0) {
    lines.push(
      "",
      "⚠ Monitors down:",
      ...uptime.monitors.filter((m) => m.status === "down").map((m) => `  • ${m.name} — ${m.url}`)
    );
  }

  const uptimeLabel = uptime.monitors.length
    ? `${Math.round((uptime.upCount / uptime.monitors.length) * 100)}% up`
    : "no monitors";

  return {
    subject: `${siteConfig.shortName} weekly digest — ${uptimeLabel}`,
    text: lines.join("\n"),
    html: lines.map((l) => `<p>${l.replace(/</g, "&lt;")}</p>`).join(""),
    downCount: uptime.downCount,
  };
}

export async function sendWeeklyDigest() {
  const settings = await getAlertSettings();
  if (!settings.digestEnabled) {
    return { skipped: true, reason: "Digest disabled in CMS" };
  }

  const digest = await buildWeeklyDigestContent();

  return dispatchAlert({
    title: digest.subject,
    message: digest.text,
    severity: digest.downCount > 0 ? "warning" : "info",
    link: `${getSiteBaseUrl()}/admin/uptime`,
    channels: ["email"],
  });
}
