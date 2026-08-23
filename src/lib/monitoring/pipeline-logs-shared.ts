export type PipelineLogCategory = "deploy" | "commit" | "error" | "performance" | "cms" | "system";
export type PipelineLogLevel = "info" | "success" | "warning" | "error" | "debug";
export type PipelineLogsPeriod = "day" | "week";

export type PipelineLogEntry = {
  id: string;
  timestamp: string;
  category: PipelineLogCategory;
  level: PipelineLogLevel;
  source: string;
  title: string;
  message: string;
  meta?: Record<string, string | number | null>;
  link?: string;
};

export type PipelineLogsKpis = {
  errors24h: number;
  unresolvedErrors: number;
  deploysWeek: number;
  commitsWeek: number;
  avgResponseMs: number | null;
  uptimePercent: number | null;
  cmsEventsToday: number;
  lcpMs: number | null;
};

export type PipelineLogsData = {
  period: PipelineLogsPeriod;
  periodLabel: string;
  kpis: PipelineLogsKpis;
  entries: PipelineLogEntry[];
  configured: {
    sentry: boolean;
    sentryDsn: boolean;
    vercel: boolean;
    github: boolean;
    posthog: boolean;
  };
  setupMessages: string[];
  lastSyncedAt: string | null;
  cacheNote: string;
};

export function pipelineLogsToCsv(data: PipelineLogsData): string {
  const lines = [
    "Apexweb Pipeline Logs Report",
    `Period,${data.periodLabel}`,
    `Generated,${new Date().toISOString()}`,
    "",
    "KPI,Value",
    `Errors (24h),${data.kpis.errors24h}`,
    `Unresolved Sentry issues,${data.kpis.unresolvedErrors}`,
    `Deploys (7d),${data.kpis.deploysWeek}`,
    `Commits (7d),${data.kpis.commitsWeek}`,
    `Avg response (ms),${data.kpis.avgResponseMs ?? ""}`,
    `Uptime (%),${data.kpis.uptimePercent ?? ""}`,
    `CMS events today,${data.kpis.cmsEventsToday}`,
    `LCP (ms),${data.kpis.lcpMs ?? ""}`,
    "",
    "Timestamp,Level,Category,Source,Title,Message",
    ...data.entries.map((entry) =>
      [
        entry.timestamp,
        entry.level,
        entry.category,
        entry.source,
        `"${entry.title.replace(/"/g, '""')}"`,
        `"${entry.message.replace(/"/g, '""')}"`,
      ].join(",")
    ),
  ];
  return lines.join("\n");
}

export function pipelineLogsToPrintHtml(data: PipelineLogsData): string {
  const rows = data.entries
    .map(
      (entry) =>
        `<tr><td>${new Date(entry.timestamp).toLocaleString()}</td><td>${entry.level}</td><td>${entry.category}</td><td>${entry.source}</td><td>${entry.title}</td><td>${entry.message}</td></tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Pipeline Logs Report</title>
<style>
  body { font-family: ui-monospace, monospace; padding: 40px; color: #111; font-size: 12px; }
  h1 { font-family: system-ui, sans-serif; font-size: 20px; }
  p { font-family: system-ui, sans-serif; color: #666; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #eee; vertical-align: top; }
  th { color: #666; }
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; font-family: system-ui, sans-serif; }
  .kpi { border: 1px solid #eee; padding: 12px; border-radius: 4px; }
  .kpi label { font-size: 11px; color: #666; text-transform: uppercase; }
  .kpi value { display: block; font-size: 20px; font-weight: 600; margin-top: 4px; }
</style></head><body>
  <h1>Pipeline Logs</h1>
  <p>${data.periodLabel} · Generated ${new Date().toLocaleString()}</p>
  <div class="kpis">
    <div class="kpi"><label>Errors 24h</label><value>${data.kpis.errors24h}</value></div>
    <div class="kpi"><label>Unresolved</label><value>${data.kpis.unresolvedErrors}</value></div>
    <div class="kpi"><label>Deploys 7d</label><value>${data.kpis.deploysWeek}</value></div>
    <div class="kpi"><label>Response</label><value>${data.kpis.avgResponseMs != null ? `${data.kpis.avgResponseMs}ms` : "—"}</value></div>
  </div>
  <table>
    <tr><th>Time</th><th>Level</th><th>Category</th><th>Source</th><th>Title</th><th>Message</th></tr>
    ${rows}
  </table>
</body></html>`;
}
