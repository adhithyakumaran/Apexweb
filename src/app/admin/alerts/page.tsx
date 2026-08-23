import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { AlertsAdmin } from "@/components/admin/alerts-admin";
import { getAlertSettings, isResendConfigured, isTwilioConfigured } from "@/lib/alerts/settings";

export const metadata: Metadata = {
  title: "Alerts",
  robots: { index: false, follow: false },
};

export default async function AdminAlertsPage() {
  const settings = await getAlertSettings();

  return (
    <AdminShell
      title="Alerts"
      description="Email, Microsoft Teams, and SMS notifications plus weekly digest."
    >
      <AlertsAdmin
        settings={settings}
        resendConfigured={isResendConfigured()}
        twilioConfigured={isTwilioConfigured()}
      />
    </AdminShell>
  );
}
