import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { UptimeRobotPanel } from "@/components/admin/uptimerobot-panel";
import { getUptimeRobotSnapshot } from "@/lib/monitoring/uptimerobot-query";

export const metadata: Metadata = {
  title: "UptimeRobot",
  robots: { index: false, follow: false },
};

type AdminUptimePageProps = {
  searchParams: Promise<{ refresh?: string }>;
};

export default async function AdminUptimePage({ searchParams }: AdminUptimePageProps) {
  const { refresh } = await searchParams;
  const data = await getUptimeRobotSnapshot({ fresh: refresh === "1" });

  return (
    <AdminShell
      title="UptimeRobot"
      description="External uptime monitoring — dashboards, status page, and live monitor health."
    >
      <UptimeRobotPanel data={data} />
    </AdminShell>
  );
}
