"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  analyticsToCsv,
  analyticsToPrintHtml,
  type AnalyticsPeriod,
  type VisitorAnalyticsData,
} from "@/lib/analytics/posthog-query";
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
import { adminClasses } from "@/components/admin/admin-theme";
import { Download, FileSpreadsheet, Printer, RefreshCw } from "lucide-react";

type VisitorAnalyticsDashboardProps = {
  data: VisitorAnalyticsData;
};

const CHART_LINE = "#ededed";
const CHART_GRID = "#333";
const CHART_AXIS = "#666";

function formatDuration(seconds: number) {
  if (!seconds || seconds <= 0) return "—";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.round(seconds % 60);
  return `${minutes}m ${remainder}s`;
}

function formatMs(ms: number | null) {
  if (!ms || ms <= 0) return "—";
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

function DataTable({
  title,
  description,
  rows,
  valueLabel = "Views",
}: {
  title: string;
  description?: string;
  rows: { label: string; value: number; share: number }[];
  valueLabel?: string;
}) {
  return (
    <AdminPanel>
      <AdminPanelHeader title={title} description={description} />
      <AdminPanelBody className="p-0">
        {rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-[13px] text-[#666]">No data yet.</p>
        ) : (
          <table className="w-full table-fixed text-left text-[13px]">
            <thead className={adminClasses.tableHead}>
              <tr>
                <th className="w-[55%] px-4 py-2.5 font-medium">Page / source</th>
                <th className="w-[22%] px-3 py-2.5 text-right font-medium">{valueLabel}</th>
                <th className="w-[23%] px-4 py-2.5 text-right font-medium">Share</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className={adminClasses.tableRow}>
                  <td className="truncate px-4 py-2.5 text-[#ededed]">{row.label}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-[#a1a1a1]">
                    {row.value.toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-[#666]">
                    {row.share}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminPanelBody>
    </AdminPanel>
  );
}

export function VisitorAnalyticsDashboard({ data }: VisitorAnalyticsDashboardProps) {
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const { kpis, webVitals, period } = data;

  function setPeriod(next: AnalyticsPeriod) {
    router.push(`/admin/analytics?period=${next}`);
  }

  function refreshData() {
    router.push(`/admin/analytics?period=${period}&refresh=1`);
    router.refresh();
  }

  function exportCsv() {
    setExporting(true);
    try {
      const csv = analyticsToCsv(data);
      downloadFile(csv, `analytics-${period}-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
    } finally {
      setExporting(false);
    }
  }

  function exportPdf() {
    setExporting(true);
    try {
      const html = analyticsToPrintHtml(data);
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminFilterBar>
        <div className="flex gap-1">
          {(["week", "month"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPeriod(item)}
              className={
                period === item
                  ? "rounded bg-[#ededed] px-2.5 py-1 text-[13px] text-black"
                  : "rounded px-2.5 py-1 text-[13px] text-[#a1a1a1] hover:bg-[#111] hover:text-white"
              }
            >
              {item === "week" ? "Last 7 days" : "Last 30 days"}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <AdminSecondaryButton onClick={refreshData}>
            <RefreshCw className="size-3.5" />
            Refresh
          </AdminSecondaryButton>
          <AdminSecondaryButton onClick={exportCsv} className={exporting ? "opacity-60" : ""}>
            <FileSpreadsheet className="size-3.5" />
            Export CSV
          </AdminSecondaryButton>
          <AdminSecondaryButton onClick={exportPdf} className={exporting ? "opacity-60" : ""}>
            <Printer className="size-3.5" />
            Export PDF
          </AdminSecondaryButton>
          <a href={`/api/cms/analytics/export?period=${period}&format=csv`} className="hidden">
            <Download className="size-3.5" />
          </a>
        </div>
      </AdminFilterBar>

      <AdminStatusStrip>
        <AdminStatusDot tone={data.configured.capture ? "success" : "warning"}>
          {data.configured.capture ? "Tracking live" : "Tracking off"}
        </AdminStatusDot>
        <AdminStatusDot tone={data.configured.query ? "info" : "neutral"}>
          {data.configured.query ? "API connected" : "API pending"}
        </AdminStatusDot>
        <span className="text-[13px] text-[#666]">{data.periodLabel}</span>
        {data.lastSyncedAt && (
          <span className="ml-auto hidden text-[13px] text-[#666] sm:inline">
            Synced {new Date(data.lastSyncedAt).toLocaleString()} · {data.cacheNote}
          </span>
        )}
      </AdminStatusStrip>

      {data.setupMessage && <AdminAlert tone="info">{data.setupMessage}</AdminAlert>}

      <div className="grid gap-px overflow-hidden rounded-md border border-[#333] sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Unique visitors"
          value={kpis.uniqueVisitorsPeriod.toLocaleString()}
          hint={`${kpis.uniqueVisitors24h.toLocaleString()} in 24h`}
          className="rounded-none border-0 border-r border-[#333]"
        />
        <AdminStatCard
          label="Page views"
          value={kpis.pageviewsPeriod.toLocaleString()}
          hint={`${kpis.pageviews24h.toLocaleString()} in 24h`}
          className="rounded-none border-0 border-r border-[#333]"
        />
        <AdminStatCard
          label="Avg. session"
          value={formatDuration(kpis.avgSessionSeconds)}
          hint={`${kpis.pagesPerSession.toFixed(1)} pages / session`}
          className="rounded-none border-0 border-r border-[#333]"
        />
        <AdminStatCard
          label="Bounce rate"
          value={kpis.bounceRate > 0 ? `${kpis.bounceRate.toFixed(1)}%` : "—"}
          hint={`${kpis.sessionsPeriod.toLocaleString()} sessions`}
          className="rounded-none border-0"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <AdminPanel className="lg:col-span-3">
          <AdminPanelHeader title="Traffic" description="Daily page views." />
          <AdminPanelBody>
            {data.trend.length === 0 ? (
              <p className="py-12 text-center text-[13px] text-[#666]">
                Traffic data will appear once visitors browse the site.
              </p>
            ) : (
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.trend}>
                    <CartesianGrid stroke={CHART_GRID} vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11, fill: CHART_AXIS }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: CHART_AXIS }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) =>
                        active && payload?.length ? (
                          <div className="rounded border border-[#333] bg-black px-3 py-2 text-[12px]">
                            <p className="text-[#ededed]">{label}</p>
                            <p className="text-[#666]">{payload[0]?.value} page views</p>
                          </div>
                        ) : null
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="pageviews"
                      stroke={CHART_LINE}
                      strokeWidth={1.5}
                      fill="transparent"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader title="Web Vitals" description="Real user performance." />
          <AdminPanelBody className="space-y-2">
            <div className="border-b border-[#333] pb-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#666]">LCP</p>
              <p className="mt-1 text-xl font-medium tabular-nums text-[#ededed]">
                {formatMs(webVitals.lcpMs)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "FCP", value: formatMs(webVitals.fcpMs) },
                { label: "INP", value: formatMs(webVitals.inpMs) },
                { label: "CLS", value: webVitals.cls ? webVitals.cls.toFixed(3) : "—" },
                { label: "Samples", value: String(webVitals.samples) },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[#666]">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-[15px] font-medium tabular-nums text-[#ededed]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </AdminPanelBody>
        </AdminPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <DataTable title="Top pages" description="Most visited routes." rows={data.topPages} />
        <DataTable title="Traffic sources" description="Referrers." rows={data.topReferrers} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <DataTable title="Exit pages" rows={data.exitPages} valueLabel="Exits" />
        <DataTable title="Countries" rows={data.topCountries} />
        <AdminPanel>
          <AdminPanelHeader title="Devices & browsers" />
          <AdminPanelBody className="space-y-4">
            {[
              { title: "Devices", rows: data.devices },
              { title: "Browsers", rows: data.browsers },
            ].map((section) => (
              <div key={section.title}>
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[#666]">
                  {section.title}
                </p>
                <div className="space-y-1.5">
                  {section.rows.length === 0 ? (
                    <p className="text-[13px] text-[#666]">No data yet.</p>
                  ) : (
                    section.rows.map((row) => (
                      <div
                        key={row.label}
                        className="grid grid-cols-[1fr_auto] gap-4 text-[13px]"
                      >
                        <span className="truncate capitalize text-[#ededed]">{row.label}</span>
                        <span className="shrink-0 tabular-nums text-[#666]">
                          {row.value.toLocaleString()} · {row.share}%
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </AdminPanelBody>
        </AdminPanel>
      </div>
    </div>
  );
}
