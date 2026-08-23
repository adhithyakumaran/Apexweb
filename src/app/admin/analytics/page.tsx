import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { VisitorAnalyticsDashboard } from "@/components/admin/visitor-analytics-dashboard";
import { getVisitorAnalytics, type AnalyticsPeriod } from "@/lib/analytics/posthog-query";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

type AdminAnalyticsPageProps = {
  searchParams: Promise<{ period?: string }>;
};

export default async function AdminAnalyticsPage({ searchParams }: AdminAnalyticsPageProps) {
  const { period: rawPeriod } = await searchParams;
  const period: AnalyticsPeriod = rawPeriod === "month" ? "month" : "week";
  const data = await getVisitorAnalytics(period);

  return (
    <AdminShell title="Analytics">
      <VisitorAnalyticsDashboard data={data} />
    </AdminShell>
  );
}
