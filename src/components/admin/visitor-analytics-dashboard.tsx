"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { VisitorAnalyticsData } from "@/lib/analytics/posthog-query";
import {
  AdminPanel,
  AdminPanelBody,
  AdminPanelHeader,
  AdminStatusPill,
  AdminStatusStrip,
} from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";
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

function MetricCard({
  label,
  value,
  hint,
  tone = "sky",
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "sky" | "emerald" | "indigo" | "violet";
  icon: React.ComponentType<{ className?: string }>;
}) {
  const tones = {
    sky: "from-sky-500/10 to-sky-500/0 text-sky-700 border-sky-200/70",
    emerald: "from-emerald-500/10 to-emerald-500/0 text-emerald-700 border-emerald-200/70",
    indigo: "from-indigo-500/10 to-indigo-500/0 text-indigo-700 border-indigo-200/70",
    violet: "from-violet-500/10 to-violet-500/0 text-violet-700 border-violet-200/70",
  };

  return (
    <div
      className={cn(
        "rounded-xl border bg-gradient-to-br p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        tones[tone]
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] opacity-80">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-neutral-900">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-neutral-600">{hint}</p>}
        </div>
        <span className="flex size-10 items-center justify-center rounded-lg border border-white/60 bg-white/70 text-current">
          <Icon className="size-4" />
        </span>
      </div>
    </div>
  );
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
          <p className="px-5 py-10 text-center text-sm text-neutral-500">No data yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/80 text-[0.68rem] uppercase tracking-[0.14em] text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Page / source</th>
                <th className="px-4 py-3 text-right font-semibold">{valueLabel}</th>
                <th className="px-5 py-3 text-right font-semibold">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((row) => (
                <tr key={row.label} className="hover:bg-neutral-50/70">
                  <td className="max-w-[16rem] truncate px-5 py-3 font-medium text-neutral-900">
                    {row.label}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-neutral-700">
                    {row.value.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-neutral-500">
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
        <AdminStatusPill tone={data.configured.query ? "success" : "neutral"}>
          {data.configured.query ? "Dashboard API connected" : "Dashboard API pending"}
        </AdminStatusPill>
        <span className="text-xs text-neutral-500">{data.periodLabel}</span>
        {data.lastSyncedAt && (
          <span className="ml-auto hidden text-xs text-neutral-400 sm:inline">
            Synced {new Date(data.lastSyncedAt).toLocaleString()} · {data.cacheNote}
          </span>
        )}
      </AdminStatusStrip>

      {data.setupMessage && (
        <div className="rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {data.setupMessage}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Unique visitors"
          value={kpis.uniqueVisitors7d.toLocaleString()}
          hint={`${kpis.uniqueVisitors24h.toLocaleString()} in last 24h`}
          tone="sky"
          icon={Users}
        />
        <MetricCard
          label="Page views"
          value={kpis.pageviews7d.toLocaleString()}
          hint={`${kpis.pageviews24h.toLocaleString()} in last 24h`}
          tone="indigo"
          icon={MousePointerClick}
        />
        <MetricCard
          label="Avg. session"
          value={formatDuration(kpis.avgSessionSeconds)}
          hint={`${kpis.pagesPerSession.toFixed(1)} pages / session`}
          tone="emerald"
          icon={Timer}
        />
        <MetricCard
          label="Bounce rate"
          value={kpis.bounceRate > 0 ? `${kpis.bounceRate.toFixed(1)}%` : "—"}
          hint={`${kpis.sessions7d.toLocaleString()} sessions`}
          tone="violet"
          icon={ArrowDownRight}
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
              <p className="py-12 text-center text-sm text-neutral-500">
                Traffic trend will appear once visitors browse the site.
              </p>
            ) : (
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.trend}>
                    <defs>
                      <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.28} />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                    <Tooltip
                      content={({ active, payload, label }) =>
                        active && payload?.length ? (
                          <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs shadow-md">
                            <p className="font-medium text-neutral-900">{label}</p>
                            <p className="text-neutral-500">{payload[0]?.value} page views</p>
                          </div>
                        ) : null
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="pageviews"
                      stroke="#0284c7"
                      strokeWidth={2}
                      fill="url(#trafficFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader title="Core Web Vitals" description="Real user performance (7d)." />
          <AdminPanelBody className="space-y-4">
            <div className="rounded-lg border border-neutral-200/80 bg-neutral-50/60 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">LCP</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-neutral-900">
                {formatMs(webVitals.lcpMs)}
              </p>
              <p className="mt-1 text-xs text-neutral-500">Largest contentful paint</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-neutral-200/80 px-3 py-2.5">
                <p className="text-[0.65rem] uppercase tracking-[0.12em] text-neutral-500">FCP</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{formatMs(webVitals.fcpMs)}</p>
              </div>
              <div className="rounded-lg border border-neutral-200/80 px-3 py-2.5">
                <p className="text-[0.65rem] uppercase tracking-[0.12em] text-neutral-500">INP</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{formatMs(webVitals.inpMs)}</p>
              </div>
              <div className="rounded-lg border border-neutral-200/80 px-3 py-2.5">
                <p className="text-[0.65rem] uppercase tracking-[0.12em] text-neutral-500">CLS</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">
                  {webVitals.cls ? webVitals.cls.toFixed(3) : "—"}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-200/80 px-3 py-2.5">
                <p className="text-[0.65rem] uppercase tracking-[0.12em] text-neutral-500">Samples</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{webVitals.samples}</p>
              </div>
            </div>
          </AdminPanelBody>
        </AdminPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DataTable
          title="Top pages"
          description="Most visited routes on the public site."
          rows={data.topPages}
        />
        <DataTable
          title="Traffic sources"
          description="Where visitors came from."
          rows={data.topReferrers}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <DataTable title="Exit pages" description="Where sessions ended." rows={data.exitPages} valueLabel="Exits" />
        <DataTable title="Countries" description="Visitor geography." rows={data.topCountries} />
        <AdminPanel>
          <AdminPanelHeader title="Devices & browsers" />
          <AdminPanelBody className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Devices
              </p>
              <div className="space-y-2">
                {data.devices.length === 0 ? (
                  <p className="text-sm text-neutral-500">No device data yet.</p>
                ) : (
                  data.devices.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-3 text-sm">
                      <span className="capitalize text-neutral-800">{row.label}</span>
                      <span className="tabular-nums text-neutral-500">
                        {row.value.toLocaleString()} · {row.share}%
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Browsers
              </p>
              <div className="space-y-2">
                {data.browsers.length === 0 ? (
                  <p className="text-sm text-neutral-500">No browser data yet.</p>
                ) : (
                  data.browsers.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-neutral-800">{row.label}</span>
                      <span className="tabular-nums text-neutral-500">
                        {row.value.toLocaleString()} · {row.share}%
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </AdminPanelBody>
        </AdminPanel>
      </div>

      <AdminPanel>
        <AdminPanelHeader
          title="SEO & engagement signals"
          description="Derived from on-site behavior — not CMS content metrics."
        />
        <AdminPanelBody>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Sessions",
                value: kpis.sessions7d.toLocaleString(),
                icon: Globe2,
                hint: "Unique browsing sessions",
              },
              {
                label: "Pages / session",
                value: kpis.pagesPerSession > 0 ? kpis.pagesPerSession.toFixed(1) : "—",
                icon: ArrowUpRight,
                hint: "Depth of visit",
              },
              {
                label: "Avg. time on site",
                value: formatDuration(kpis.avgSessionSeconds),
                icon: Clock3,
                hint: "From session duration",
              },
              {
                label: "Tracked events",
                value: data.configured.capture ? "Autocapture on" : "Off",
                icon: MousePointerClick,
                hint: "Clicks, pageviews, page leave",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-lg border border-neutral-200/80 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
                >
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Icon className="size-4" />
                    <p className="text-xs font-medium uppercase tracking-[0.14em]">{item.label}</p>
                  </div>
                  <p className="mt-2 text-xl font-semibold tabular-nums text-neutral-900">{item.value}</p>
                  <p className="mt-1 text-xs text-neutral-500">{item.hint}</p>
                </div>
              );
            })}
          </div>
        </AdminPanelBody>
      </AdminPanel>
    </div>
  );
}
