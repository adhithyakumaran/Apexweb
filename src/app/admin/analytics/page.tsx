import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import { getAnalyticsDashboardData } from "@/lib/analytics/dashboard";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

export default async function AdminAnalyticsPage() {
  const data = await getAnalyticsDashboardData();

  return (
    <AdminShell
      title="Analytics"
      description="Content performance, publishing trends, and CMS activity across your knowledge hub."
    >
      <AnalyticsDashboard data={data} />
    </AdminShell>
  );
}
