import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ActivityLogsTable } from "@/components/admin/activity-logs-table";
import { AdminStatCard, AdminStatusStrip, AdminStatusPill } from "@/components/admin/admin-ui";
import {
  getActivityLogStats,
  listCmsActivityLogs,
  seedActivityLogsFromArticles,
} from "@/lib/cms/activity-log";
import { isDatabaseConfigured } from "@/lib/db";
import { AlertTriangle, CalendarDays, ScrollText, ShieldCheck } from "lucide-react";

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
    <AdminShell
      title="Activity logs"
      description="Audit trail for sign-ins, publishes, uploads, and content changes in Content Studio."
    >
      <AdminStatusStrip className="mb-6">
        <AdminStatusPill tone={isDatabaseConfigured() ? "success" : "warning"}>
          {isDatabaseConfigured() ? "Persistent logs" : "Local file logs"}
        </AdminStatusPill>
        <span className="ml-auto hidden text-xs text-[#9CA3AF] sm:inline">
          Retains the latest 500 events
        </span>
      </AdminStatusStrip>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total events" value={stats.total} icon={ScrollText} />
        <AdminStatCard
          label="Today"
          value={stats.today}
          hint="Events in the last 24h"
          icon={CalendarDays}
        />
        <AdminStatCard
          label="Sign-ins (7d)"
          value={stats.loginsWeek}
          hint={`${stats.publishesWeek} publishes`}
          icon={ShieldCheck}
        />
        <AdminStatCard
          label="Errors"
          value={stats.errors}
          hint={`${stats.errorsToday} today`}
          icon={AlertTriangle}
        />
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
