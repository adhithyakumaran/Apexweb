import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { GoogleAnalyticsPanel } from "@/components/admin/google-analytics-panel";
import { getGoogleAnalyticsUrl, isGoogleAnalyticsConfigured } from "@/lib/monitoring";

export const metadata: Metadata = {
  title: "Google Analytics",
  robots: { index: false, follow: false },
};

export default function GoogleAnalyticsPage() {
  const url = getGoogleAnalyticsUrl();
  const configured = isGoogleAnalyticsConfigured();

  return (
    <AdminShell
      title="Google Analytics"
      description="External GA4 reporting — link your dashboard when ready."
    >
      <GoogleAnalyticsPanel url={url} configured={configured} />
    </AdminShell>
  );
}
