import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { PipelineLogsDashboard } from "@/components/admin/pipeline-logs-dashboard";
import { getPipelineLogs, type PipelineLogsPeriod } from "@/lib/monitoring/pipeline-logs";
import { seedActivityLogsFromArticles } from "@/lib/cms/activity-log";

export const metadata: Metadata = {
  title: "Pipeline Logs",
  robots: { index: false, follow: false },
};

type AdminLogsPageProps = {
  searchParams: Promise<{ period?: string; refresh?: string }>;
};

export default async function AdminLogsPage({ searchParams }: AdminLogsPageProps) {
  await seedActivityLogsFromArticles();

  const { period: rawPeriod, refresh } = await searchParams;
  const period: PipelineLogsPeriod = rawPeriod === "day" ? "day" : "week";
  const data = await getPipelineLogs(period, { fresh: refresh === "1" });

  return (
    <AdminShell
      title="Pipeline Logs"
      description="Terminal monitor for deploys, commits, Sentry crashes, performance, and CMS events."
    >
      <PipelineLogsDashboard data={data} />
    </AdminShell>
  );
}
