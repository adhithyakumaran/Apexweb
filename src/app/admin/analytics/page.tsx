import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { VisitorAnalyticsDashboard } from "@/components/admin/visitor-analytics-dashboard";
import { getVisitorAnalytics, type AnalyticsPeriod } from "@/lib/analytics/posthog-query";

export const metadata: Metadata = {
  title: "PostHog Analytics",
  robots: { index: false, follow: false },
};

type AdminAnalyticsPageProps = {
  searchParams: Promise<{ period?: string; refresh?: string }>;
};

export default async function AdminAnalyticsPage({ searchParams }: AdminAnalyticsPageProps) {
  const { period: rawPeriod, refresh } = await searchParams;
  const period: AnalyticsPeriod = rawPeriod === "month" ? "month" : "week";
  const data = await getVisitorAnalytics(period, { fresh: refresh === "1" });

  return (
    <AdminShell
      title="PostHog Analytics"
      description="Visitor traffic, sessions, and web vitals from PostHog."
    >
      <VisitorAnalyticsDashboard data={data} />
    </AdminShell>
  );
}
