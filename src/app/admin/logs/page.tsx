import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ActivityLogsTable } from "@/components/admin/activity-logs-table";
import { AdminStatCard, AdminStatusDot, AdminStatusStrip } from "@/components/admin/admin-ui";
import {
  getActivityLogStats,
  listCmsActivityLogs,
  seedActivityLogsFromArticles,
} from "@/lib/cms/activity-log";
import { isDatabaseConfigured } from "@/lib/db";

export const metadata: Metadata = {
  title: "Logs",
  robots: { index: false, follow: false },
};

export default async function AdminLogsPage() {
  await seedActivityLogsFromArticles();

  const [logs, stats] = await Promise.all([
    listCmsActivityLogs({ limit: 200 }),
    getActivityLogStats(),
  ]);

  return (
    <AdminShell title="Logs">
      <AdminStatusStrip className="mb-6">
        <AdminStatusDot tone={isDatabaseConfigured() ? "success" : "warning"}>
          {isDatabaseConfigured() ? "Persistent logs" : "Local file logs"}
        </AdminStatusDot>
        <span className="ml-auto hidden text-[13px] text-[#666] sm:inline">
          Latest 500 events
        </span>
      </AdminStatusStrip>

      <div className="mb-6 grid gap-px overflow-hidden rounded-md border border-[#333] sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total events" value={stats.total} className="rounded-none border-0 border-r border-[#333]" />
        <AdminStatCard label="Today" value={stats.today} hint="Last 24h" className="rounded-none border-0 border-r border-[#333]" />
        <AdminStatCard label="Sign-ins (7d)" value={stats.loginsWeek} hint={`${stats.publishesWeek} publishes`} className="rounded-none border-0 border-r border-[#333]" />
        <AdminStatCard label="Errors" value={stats.errors} hint={`${stats.errorsToday} today`} className="rounded-none border-0" />
      </div>

      <ActivityLogsTable
        logs={logs.map((log) => ({
          id: log.id,
          action: log.action,
          level: log.level,
          message: log.message,
          resourceType: log.resourceType,
          resourceId: log.resourceId,
          createdAt: log.createdAt ?? new Date().toISOString(),
        }))}
      />
    </AdminShell>
  );
}
