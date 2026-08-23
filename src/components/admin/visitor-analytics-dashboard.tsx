"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { VisitorAnalyticsData } from "@/lib/analytics/posthog-query";
import {
  AdminAlert,
  AdminPanel,
  AdminPanelBody,
  AdminPanelHeader,
  AdminStatCard,
  AdminStatusPill,
  AdminStatusStrip,
} from "@/components/admin/admin-ui";
import {
  ArrowDownRight,
  ArrowUpRight,
  Clock3,
  Globe2,
  MousePointerClick,
  Timer,
  Users,
} from "lucide-react";

type VisitorAnalyticsDashboardProps = {
  data: VisitorAnalyticsData;
};

const CHART_BLUE = "#3B82F6";
const CHART_GRID = "rgba(255,255,255,0.06)";
const CHART_AXIS = "#6b7280";

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
          <p className="px-5 py-10 text-center text-sm text-[#9CA3AF]">No data yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/[0.06] bg-[#25262c] text-[0.68rem] uppercase tracking-[0.14em] text-[#9CA3AF]">
              <tr>
                <th className="px-5 py-3 font-semibold">Page / source</th>
                <th className="px-4 py-3 text-right font-semibold">{valueLabel}</th>
                <th className="px-5 py-3 text-right font-semibold">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {rows.map((row) => (
                <tr key={row.label} className="transition-colors hover:bg-white/[0.03]">
                  <td className="max-w-[16rem] truncate px-5 py-3 font-medium text-white">
                    {row.label}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-[#d1d5db]">
                    {row.value.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-[#9CA3AF]">
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
  const { kpis, webVitals } = data;

  return (
    <div className="space-y-6">
      <AdminStatusStrip>
        <AdminStatusPill tone={data.configured.capture ? "success" : "warning"}>
          {data.configured.capture ? "PostHog tracking live" : "Tracking not configured"}
        </AdminStatusPill>
        <AdminStatusPill tone={data.configured.query ? "info" : "neutral"}>
          {data.configured.query ? "Dashboard API connected" : "Dashboard API pending"}
        </AdminStatusPill>
        <span className="text-xs text-[#9CA3AF]">{data.periodLabel}</span>
        {data.lastSyncedAt && (
          <span className="ml-auto hidden text-xs text-[#6b7280] sm:inline">
            Synced {new Date(data.lastSyncedAt).toLocaleString()} · {data.cacheNote}
          </span>
        )}
      </AdminStatusStrip>

      {data.setupMessage && <AdminAlert tone="info">{data.setupMessage}</AdminAlert>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Unique visitors"
          value={kpis.uniqueVisitors7d.toLocaleString()}
          hint={`${kpis.uniqueVisitors24h.toLocaleString()} in last 24h`}
          icon={Users}
        />
        <AdminStatCard
          label="Page views"
          value={kpis.pageviews7d.toLocaleString()}
          hint={`${kpis.pageviews24h.toLocaleString()} in last 24h`}
          icon={MousePointerClick}
        />
        <AdminStatCard
          label="Avg. session"
          value={formatDuration(kpis.avgSessionSeconds)}
          hint={`${kpis.pagesPerSession.toFixed(1)} pages / session`}
          icon={Timer}
        />
        <AdminStatCard
          label="Bounce rate"
          value={kpis.bounceRate > 0 ? `${kpis.bounceRate.toFixed(1)}%` : "—"}
          hint={`${kpis.sessions7d.toLocaleString()} sessions`}
          icon={ArrowDownRight}
          delta={
            kpis.bounceRate > 0
              ? { value: `${kpis.bounceRate.toFixed(1)}%`, positive: kpis.bounceRate < 50 }
              : undefined
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <AdminPanel className="lg:col-span-3">
          <AdminPanelHeader
            title="Traffic trend"
            description="Daily page views across the public website."
          />
          <AdminPanelBody>
            {data.trend.length === 0 ? (
              <p className="py-12 text-center text-sm text-[#9CA3AF]">
                Traffic trend will appear once visitors browse the site.
              </p>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.trend}>
                    <defs>
                      <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_BLUE} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={CHART_BLUE} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke={CHART_GRID} vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: CHART_AXIS }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: CHART_AXIS }} axisLine={false} tickLine={false} />
                    <Tooltip
                      content={({ active, payload, label }) =>
                        active && payload?.length ? (
                          <div className="rounded-lg border border-white/[0.08] bg-[#2C2D33] px-3 py-2 text-xs shadow-xl">
                            <p className="font-medium text-white">{label}</p>
                            <p className="text-[#9CA3AF]">{payload[0]?.value} page views</p>
                          </div>
                        ) : null
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="pageviews"
                      stroke={CHART_BLUE}
                      strokeWidth={2.5}
                      fill="url(#trafficFill)"
                      dot={{ r: 4, fill: CHART_BLUE, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader title="Core Web Vitals" description="Real user performance (7d)." />
          <AdminPanelBody className="space-y-3">
            <div className="rounded-lg border border-white/[0.06] bg-[#25262c] px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#9CA3AF]">LCP</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
                {formatMs(webVitals.lcpMs)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "FCP", value: formatMs(webVitals.fcpMs) },
                { label: "INP", value: formatMs(webVitals.inpMs) },
                { label: "CLS", value: webVitals.cls ? webVitals.cls.toFixed(3) : "—" },
                { label: "Samples", value: String(webVitals.samples) },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-white/[0.06] bg-[#25262c] px-3 py-2.5"
                >
                  <p className="text-[0.65rem] uppercase tracking-[0.12em] text-[#9CA3AF]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </AdminPanelBody>
        </AdminPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DataTable title="Top pages" description="Most visited routes." rows={data.topPages} />
        <DataTable title="Traffic sources" description="Where visitors came from." rows={data.topReferrers} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <DataTable title="Exit pages" rows={data.exitPages} valueLabel="Exits" />
        <DataTable title="Countries" rows={data.topCountries} />
        <AdminPanel>
          <AdminPanelHeader title="Devices & browsers" />
          <AdminPanelBody className="space-y-5">
            {[
              { title: "Devices", rows: data.devices },
              { title: "Browsers", rows: data.browsers },
            ].map((section) => (
              <div key={section.title}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#9CA3AF]">
                  {section.title}
                </p>
                <div className="space-y-2">
                  {section.rows.length === 0 ? (
                    <p className="text-sm text-[#6b7280]">No data yet.</p>
                  ) : (
                    section.rows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span className="capitalize text-white">{row.label}</span>
                        <span className="tabular-nums text-[#9CA3AF]">
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

      <AdminPanel>
        <AdminPanelHeader title="Engagement signals" description="Session depth and on-site behavior." />
        <AdminPanelBody>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Sessions", value: kpis.sessions7d.toLocaleString(), icon: Globe2 },
              {
                label: "Pages / session",
                value: kpis.pagesPerSession > 0 ? kpis.pagesPerSession.toFixed(1) : "—",
                icon: ArrowUpRight,
              },
              { label: "Avg. time", value: formatDuration(kpis.avgSessionSeconds), icon: Clock3 },
              {
                label: "Tracking",
                value: data.configured.capture ? "Active" : "Off",
                icon: MousePointerClick,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-lg border border-white/[0.06] bg-[#25262c] px-4 py-3"
                >
                  <div className="flex items-center gap-2 text-[#9CA3AF]">
                    <Icon className="size-4" />
                    <p className="text-xs font-medium uppercase tracking-[0.14em]">{item.label}</p>
                  </div>
                  <p className="mt-2 text-xl font-semibold tabular-nums text-white">{item.value}</p>
                </div>
              );
            })}
          </div>
        </AdminPanelBody>
      </AdminPanel>
    </div>
  );
}
