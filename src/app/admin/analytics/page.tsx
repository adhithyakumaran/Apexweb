import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { VisitorAnalyticsDashboard } from "@/components/admin/visitor-analytics-dashboard";
import { getVisitorAnalytics } from "@/lib/analytics/posthog-query";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

export default async function AdminAnalyticsPage() {
  const data = await getVisitorAnalytics();

  return (
    <AdminShell
      title="Website analytics"
      description="Visitor behavior, traffic sources, engagement, and real-user performance from PostHog."
    >
      <VisitorAnalyticsDashboard data={data} />
    </AdminShell>
  );
}
