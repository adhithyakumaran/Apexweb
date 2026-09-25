"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  pipelineLogsToCsv,
  pipelineLogsToPrintHtml,
  type PipelineLogCategory,
  type PipelineLogEntry,
  type PipelineLogsData,
  type PipelineLogsPeriod,
} from "@/lib/monitoring/pipeline-logs-shared";
import {
  AdminAlert,
  AdminFilterBar,
  AdminPanel,
  AdminPanelBody,
  AdminPanelHeader,
  AdminSecondaryButton,
  AdminStatCard,
  AdminStatusDot,
  AdminStatusStrip,
} from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";
import { Download, FileSpreadsheet, Printer, RefreshCw } from "lucide-react";

type PipelineLogsDashboardProps = {
  data: PipelineLogsData;
};

const CATEGORY_FILTERS: Array<PipelineLogCategory | "all"> = [
  "all",
  "deploy",
  "commit",
  "error",
  "performance",
  "cms",
  "system",
];

const levelColors: Record<string, string> = {
  success: "text-[#50e3c2]",
  info: "text-[#79b8ff]",
  warning: "text-[#f5a623]",
  error: "text-[#ff6b6b]",
  debug: "text-[#666]",
};

const categoryLabels: Record<PipelineLogCategory, string> = {
  deploy: "deploy",
  commit: "commit",
  error: "crash",
  performance: "perf",
  cms: "cms",
  system: "sys",
};

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatMs(ms: number | null) {
  if (ms == null || ms <= 0) return "—";
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms)}ms`;
}

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function TerminalLine({ entry }: { entry: PipelineLogEntry }) {
  const level = entry.level;
  const prefix = `[${formatTimestamp(entry.timestamp)}]`;
  const tag = `${entry.source}/${categoryLabels[entry.category]}`;

  return (
    <div className="group flex gap-3 px-4 py-1.5 hover:bg-[#0d0d0d]">
      <span className="shrink-0 tabular-nums text-[#444]">{prefix}</span>
      <span className={cn("shrink-0 uppercase", levelColors[level] ?? "text-[#666]")}>
        {level.padEnd(7)}
      </span>
      <span className="shrink-0 text-[#555]">[{tag}]</span>
      <div className="min-w-0 flex-1">
        <span className="text-[#ededed]">{entry.title}</span>
        <span className="text-[#888]"> — </span>
        {entry.link ? (
          <a
            href={entry.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#79b8ff] underline-offset-2 hover:underline"
          >
            {entry.message}
          </a>
        ) : (
          <span className="text-[#a1a1a1]">{entry.message}</span>
        )}
      </div>
    </div>
  );
}

export function PipelineLogsDashboard({ data }: PipelineLogsDashboardProps) {
  const router = useRouter();
  const terminalRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<PipelineLogCategory | "all">("all");
  const [exporting, setExporting] = useState(false);
  const { kpis, period, configured } = data;

  const filtered = useMemo(() => {
    if (category === "all") return data.entries;
    return data.entries.filter((entry) => entry.category === category);
  }, [data.entries, category]);

  function setPeriod(next: PipelineLogsPeriod) {
    router.push(`/admin/logs?period=${next}`);
  }

  function refreshData() {
    router.push(`/admin/logs?period=${period}&refresh=1`);
    router.refresh();
  }

  function exportCsv() {
    setExporting(true);
    try {
      const stamp = new Date().toISOString().slice(0, 10);
      downloadFile(pipelineLogsToCsv(data), `pipeline-logs-${period}-${stamp}.csv`, "text/csv");
    } finally {
      setExporting(false);
    }
  }

  function exportPdf() {
    setExporting(true);
    try {
      const html = pipelineLogsToPrintHtml(data);
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(html);
        win.document.close();
        win.print();
      }
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminStatusStrip>
        <AdminStatusDot tone={configured.sentry ? "success" : "warning"}>
          Sentry {configured.sentry ? "connected" : "not linked"}
        </AdminStatusDot>
        <AdminStatusDot tone={configured.vercel ? "success" : "neutral"}>
          Vercel {configured.vercel ? "deploys" : "off"}
        </AdminStatusDot>
        <AdminStatusDot tone={configured.github ? "success" : "neutral"}>
          GitHub {configured.github ? "commits" : "off"}
        </AdminStatusDot>
        <AdminStatusDot tone={configured.posthog ? "success" : "neutral"}>
          PostHog vitals {configured.posthog ? "on" : "off"}
        </AdminStatusDot>
        {data.lastSyncedAt && (
          <span className="ml-auto hidden text-[13px] text-[#666] sm:inline">
            Synced {new Date(data.lastSyncedAt).toLocaleTimeString()}
          </span>
        )}
      </AdminStatusStrip>

      {data.setupMessages.length > 0 && (
        <AdminAlert tone="info">
          <ul className="list-inside list-disc space-y-1">
            {data.setupMessages.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </AdminAlert>
      )}

      <div className="grid gap-px overflow-hidden rounded-md border border-[#333] sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Errors (24h)"
          value={kpis.errors24h}
          hint={`${kpis.unresolvedErrors} unresolved`}
          className="rounded-none border-0 border-r border-[#333]"
        />
        <AdminStatCard
          label="Deploys (7d)"
          value={kpis.deploysWeek}
          hint={`${kpis.commitsWeek} commits`}
          className="rounded-none border-0 border-r border-[#333]"
        />
        <AdminStatCard
          label="Response time"
          value={formatMs(kpis.avgResponseMs)}
          hint={kpis.uptimePercent != null ? `${kpis.uptimePercent}% uptime` : "Live probe"}
          className="rounded-none border-0 border-r border-[#333]"
        />
        <AdminStatCard
          label="LCP"
          value={formatMs(kpis.lcpMs)}
          hint={`${kpis.cmsEventsToday} CMS events today`}
          className="rounded-none border-0"
        />
      </div>

      <AdminFilterBar>
        <div className="flex flex-wrap gap-1">
          {(["day", "week"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPeriod(item)}
              className={cn(
                "rounded px-2.5 py-1 text-[13px] capitalize transition-colors",
                period === item
                  ? "bg-[#ededed] text-black"
                  : "text-[#a1a1a1] hover:bg-[#111] hover:text-white"
              )}
            >
              {item === "day" ? "24h" : "7 days"}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {CATEGORY_FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                "rounded px-2.5 py-1 text-[13px] capitalize transition-colors",
                category === item
                  ? "bg-[#111] text-white"
                  : "text-[#666] hover:bg-[#111] hover:text-[#a1a1a1]"
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <AdminSecondaryButton onClick={refreshData}>
            <RefreshCw className="size-3.5" />
            Refresh
          </AdminSecondaryButton>
          <AdminSecondaryButton onClick={exporting ? undefined : exportCsv}>
            <FileSpreadsheet className="size-3.5" />
            CSV
          </AdminSecondaryButton>
          <AdminSecondaryButton onClick={exporting ? undefined : exportPdf}>
            <Printer className="size-3.5" />
            PDF
          </AdminSecondaryButton>
          <AdminSecondaryButton
            onClick={() =>
              window.open(`/api/cms/logs/export?period=${period}&format=csv`, "_blank")
            }
          >
            <Download className="size-3.5" />
            Server export
          </AdminSecondaryButton>
        </div>
      </AdminFilterBar>

      <AdminPanel className="overflow-hidden border-[#222] bg-[#050505]">
        <AdminPanelHeader
          title="Pipeline stream"
          description={`${data.periodLabel} · ${filtered.length} events · ${data.cacheNote}`}
          className="border-[#222] bg-[#0a0a0a]"
        />
        <AdminPanelBody className="p-0">
          <div className="border-b border-[#1a1a1a] bg-[#0a0a0a] px-4 py-2 font-mono text-[12px] text-[#50e3c2]">
            <span className="text-[#666]">apexweb@pipeline</span>
            <span className="text-[#444]">:</span>
            <span className="text-[#79b8ff]">~/monitor</span>
            <span className="text-[#ededed]"> $ tail -f pipeline.log</span>
            <span className="ml-1 inline-block h-3.5 w-2 animate-pulse bg-[#50e3c2]" />
          </div>

          <div
            ref={terminalRef}
            className="max-h-[min(70vh,640px)] overflow-y-auto py-2 font-mono text-[12px] leading-relaxed"
          >
            {filtered.length === 0 ? (
              <p className="px-4 py-12 text-center text-[#666]">
                No pipeline events in this window. Push a commit, deploy, or trigger an error to
                populate the stream.
              </p>
            ) : (
              filtered.map((entry) => <TerminalLine key={entry.id} entry={entry} />)
            )}
          </div>

          <div className="border-t border-[#1a1a1a] px-4 py-2 font-mono text-[11px] text-[#444]">
            {filtered.length} lines · filter={category} · sources: sentry, vercel, github, cms,
            probe
          </div>
        </AdminPanelBody>
      </AdminPanel>
    </div>
  );
}
