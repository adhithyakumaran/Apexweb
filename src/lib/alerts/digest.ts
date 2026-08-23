import { getPipelineLogs } from "@/lib/monitoring/pipeline-logs";
import { getUptimeStats, listUptimeChecksWithLatest } from "@/lib/uptime/checks";
import { dispatchAlert } from "@/lib/alerts/dispatch";
import { getAlertSettings } from "@/lib/alerts/settings";
import { siteConfig } from "@/config/site";
import { getSiteBaseUrl } from "@/lib/site-url";

export async function buildWeeklyDigestContent() {
  const [stats, checks, pipeline] = await Promise.all([
    getUptimeStats(),
    listUptimeChecksWithLatest(),
    getPipelineLogs("week"),
  ]);

  const downChecks = checks.filter((c) => c.latest && !c.latest.ok);
  const lines = [
    `Weekly digest — ${siteConfig.name}`,
    `Period: last 7 days`,
    ``,
    `Uptime: ${stats.uptimePercent7d.toFixed(1)}% across ${stats.enabledChecks} endpoints`,
    `Currently up: ${stats.upNow}/${stats.enabledChecks}`,
    `Avg response: ${stats.avgResponseMs != null ? `${stats.avgResponseMs}ms` : "—"}`,
    ``,
    `Pipeline (7d):`,
    `  Errors (24h): ${pipeline.kpis.errors24h}`,
    `  Deploys: ${pipeline.kpis.deploysWeek}`,
    `  Commits: ${pipeline.kpis.commitsWeek}`,
    `  CMS events today: ${pipeline.kpis.cmsEventsToday}`,
    ``,
    `Endpoints:`,
    ...checks.map((c) => {
      const status = !c.latest ? "no data" : c.latest.ok ? `OK ${c.latest.responseMs}ms` : `DOWN ${c.latest.error ?? c.latest.statusCode}`;
      return `  • ${c.name}: ${status}`;
    }),
  ];

  if (downChecks.length > 0) {
    lines.push("", "⚠ Currently failing:", ...downChecks.map((c) => `  • ${c.name} — ${c.url}`));
  }

  lines.push("", `Dashboard: ${getSiteBaseUrl()}/admin/uptime`);

  return {
    subject: `${siteConfig.shortName} weekly digest — ${stats.uptimePercent7d.toFixed(0)}% uptime`,
    text: lines.join("\n"),
    html: lines.map((l) => `<p>${l.replace(/</g, "&lt;")}</p>`).join(""),
    stats,
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
    severity: digest.stats.downNow > 0 ? "warning" : "info",
    link: `${getSiteBaseUrl()}/admin/uptime`,
    channels: ["email"],
  });
}
