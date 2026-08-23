"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsDashboardData } from "@/lib/analytics/dashboard";
import {
  AdminPanel,
  AdminPanelBody,
  AdminPanelHeader,
  AdminStatCard,
  AdminStatusPill,
  AdminStatusStrip,
} from "@/components/admin/admin-ui";
import { activityActionLabels } from "@/lib/cms/activity-log-shared";
import {
  Activity,
  BarChart3,
  FileText,
  Layers,
  Radio,
  Users,
} from "lucide-react";

const chartColors = ["#f97316", "#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#64748b"];

type AnalyticsDashboardProps = {
  data: AnalyticsDashboardData;
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-neutral-900">{label}</p>
      <p className="mt-0.5 text-neutral-500">{payload[0]?.value}</p>
    </div>
  );
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const statusData = [
    { name: "Published", value: data.content.published },
    { name: "Drafts", value: data.content.drafts },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6">
      <AdminStatusStrip>
        {data.integrations.map((integration) => (
          <AdminStatusPill
            key={integration.id}
            tone={integration.connected ? "success" : "neutral"}
          >
            {integration.label}
          </AdminStatusPill>
        ))}
      </AdminStatusStrip>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Published articles"
          value={data.content.published}
          hint={`${data.content.drafts} drafts`}
          icon={Radio}
        />
        <AdminStatCard
          label="CMS events (7d)"
          value={data.activityStats.week}
          hint={`${data.activityStats.publishesWeek} publishes`}
          icon={Activity}
        />
        <AdminStatCard
          label="Site agents"
          value={data.content.agents}
          hint="Live agent profiles"
          icon={Users}
        />
        <AdminStatCard
          label="Content items"
          value={data.content.totalArticles + data.content.services}
          hint="Articles + services"
          icon={Layers}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminPanel>
          <AdminPanelHeader
            title="Publishing activity"
            description="Published articles by month from your CMS."
          />
          <AdminPanelBody>
            {data.publishingTimeline.length === 0 ? (
              <p className="py-10 text-center text-sm text-neutral-500">
                Publish articles to see trends here.
              </p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.publishingTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader
            title="CMS activity"
            description="Editor actions logged over the last week."
          />
          <AdminPanelBody>
            {data.activityTimeline.length === 0 ? (
              <p className="py-10 text-center text-sm text-neutral-500">
                Activity will appear as you use the CMS.
              </p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.activityTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <Tooltip content={<ChartTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#0ea5e9"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#0ea5e9" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </AdminPanelBody>
        </AdminPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <AdminPanel>
          <AdminPanelHeader title="Article status" />
          <AdminPanelBody>
            {statusData.length === 0 ? (
              <p className="py-8 text-center text-sm text-neutral-500">No articles yet.</p>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={3}
                    >
                      {statusData.map((_, index) => (
                        <Cell key={index} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="mt-2 flex justify-center gap-4 text-xs text-neutral-500">
              {statusData.map((item, index) => (
                <span key={item.name} className="inline-flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: chartColors[index % chartColors.length] }}
                  />
                  {item.name} ({item.value})
                </span>
              ))}
            </div>
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel className="xl:col-span-2">
          <AdminPanelHeader
            title="Templates in use"
            description="Distribution of article layouts across your content library."
          />
          <AdminPanelBody>
            {data.templates.length === 0 ? (
              <p className="py-8 text-center text-sm text-neutral-500">No templates in use yet.</p>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.templates} layout="vertical" margin={{ left: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={120}
                      tick={{ fontSize: 11 }}
                      stroke="#94a3b8"
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </AdminPanelBody>
        </AdminPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <AdminPanel className="xl:col-span-2">
          <AdminPanelHeader
            title="Recent CMS activity"
            description="Latest editorial actions from the activity log."
          />
          <AdminPanelBody className="p-0">
            {data.recentActivity.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-neutral-500">
                No activity logged yet.
              </p>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {data.recentActivity.map((entry) => (
                  <li key={entry.id} className="flex items-start gap-3 px-5 py-3.5">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                      <FileText className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-neutral-900">{entry.message}</p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {activityActionLabels[entry.action] ?? entry.action} ·{" "}
                        {new Date(entry.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <AdminStatusPill
                      tone={
                        entry.level === "error"
                          ? "danger"
                          : entry.level === "success"
                            ? "success"
                            : entry.level === "warning"
                              ? "warning"
                              : "neutral"
                      }
                    >
                      {entry.level}
                    </AdminStatusPill>
                  </li>
                ))}
              </ul>
            )}
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader
            title="External analytics"
            description="Connect visitor analytics and error monitoring when ready."
          />
          <AdminPanelBody className="space-y-4">
            {data.integrations.slice(2).map((integration) => (
              <div
                key={integration.id}
                className="rounded-lg border border-neutral-200 bg-neutral-50/60 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-neutral-900">{integration.label}</p>
                  <AdminStatusPill tone={integration.connected ? "success" : "neutral"}>
                    {integration.connected ? "Connected" : "Not set"}
                  </AdminStatusPill>
                </div>
                <p className="mt-1 text-xs text-neutral-500">{integration.hint}</p>
              </div>
            ))}
            <div className="rounded-lg border border-dashed border-neutral-200 px-4 py-3 text-xs leading-relaxed text-neutral-500">
              <BarChart3 className="mb-2 size-4 text-brand-orange" />
              CMS analytics above are live today. Add PostHog or Sentry env vars to unlock
              visitor traffic and production error dashboards.
            </div>
          </AdminPanelBody>
        </AdminPanel>
      </div>
    </div>
  );
}
