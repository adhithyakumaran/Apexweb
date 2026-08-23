import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { UptimeAdmin } from "@/components/admin/uptime-admin";
import { getUptimeStats, listUptimeChecksWithLatest } from "@/lib/uptime/checks";

export const metadata: Metadata = {
  title: "Uptime Monitor",
  robots: { index: false, follow: false },
};

export default async function AdminUptimePage() {
  const [checks, stats] = await Promise.all([listUptimeChecksWithLatest(), getUptimeStats()]);

  return (
    <AdminShell
      title="Uptime Monitor"
      description="Synthetic checks across your site and APIs — runs every 5 minutes in production."
    >
      <UptimeAdmin checks={checks} stats={stats} />
    </AdminShell>
  );
}
