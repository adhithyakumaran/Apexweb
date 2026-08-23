"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AlertSettings } from "@/lib/alerts/shared";
import {
  AdminAlert,
  AdminPanel,
  AdminPanelBody,
  AdminPanelHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  AdminStatusDot,
  AdminStatusStrip,
} from "@/components/admin/admin-ui";
import { MessageSquare, Smartphone } from "lucide-react";

type AlertsAdminProps = {
  settings: AlertSettings;
  resendConfigured: boolean;
  twilioConfigured: boolean;
};

const digestDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export function AlertsAdmin({ settings: initial, resendConfigured, twilioConfigured }: AlertsAdminProps) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/cms/alerts/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          emailRecipients: settings.emailRecipients,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setSettings(data.settings);
      setMessage("Alert settings saved.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function sendTest() {
    setTesting(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/cms/alerts/test", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Test failed");
      setMessage("Test alert dispatched. Check email, Teams, and SMS.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Test failed");
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminStatusStrip>
        <AdminStatusDot tone={resendConfigured ? "success" : "warning"}>
          Email {resendConfigured ? "ready" : "needs Resend"}
        </AdminStatusDot>
        <AdminStatusDot tone={settings.teamsWebhookUrl ? "success" : "neutral"}>
          Teams webhook
        </AdminStatusDot>
        <AdminStatusDot tone={twilioConfigured ? "success" : "warning"}>
          SMS {twilioConfigured ? "ready" : "needs Twilio"}
        </AdminStatusDot>
      </AdminStatusStrip>

      {message && <AdminAlert tone="info">{message}</AdminAlert>}
      {error && <AdminAlert tone="danger">{error}</AdminAlert>}

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminPanel>
          <AdminPanelHeader title="Email" description="Instant alerts and weekly digest via Resend." />
          <AdminPanelBody className="space-y-4">
            <label className="flex items-center gap-2 text-[13px]">
              <input
                type="checkbox"
                checked={settings.emailEnabled}
                onChange={(e) => setSettings({ ...settings, emailEnabled: e.target.checked })}
              />
              Enable email alerts
            </label>
            <label className="block space-y-1">
              <span className="text-[13px] text-[#a1a1a1]">Recipients (comma-separated)</span>
              <input
                value={settings.emailRecipients.join(", ")}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    emailRecipients: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                placeholder="ops@company.com, you@company.com"
                className="w-full"
              />
            </label>
            <label className="flex items-center gap-2 text-[13px]">
              <input
                type="checkbox"
                checked={settings.digestEnabled}
                onChange={(e) => setSettings({ ...settings, digestEnabled: e.target.checked })}
              />
              Send weekly digest email
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1">
                <span className="text-[13px] text-[#a1a1a1]">Digest day (UTC)</span>
                <select
                  value={settings.digestDay}
                  onChange={(e) =>
                    setSettings({ ...settings, digestDay: e.target.value as AlertSettings["digestDay"] })
                  }
                >
                  {digestDays.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1">
                <span className="text-[13px] text-[#a1a1a1]">Hour (UTC)</span>
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={settings.digestHourUtc}
                  onChange={(e) =>
                    setSettings({ ...settings, digestHourUtc: Number(e.target.value) })
                  }
                />
              </label>
            </div>
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader title="Teams & SMS" description="Microsoft Teams incoming webhook and Twilio SMS." />
          <AdminPanelBody className="space-y-4">
            <label className="flex items-center gap-2 text-[13px]">
              <input
                type="checkbox"
                checked={settings.teamsEnabled}
                onChange={(e) => setSettings({ ...settings, teamsEnabled: e.target.checked })}
              />
              <MessageSquare className="size-3.5" /> Enable Teams alerts
            </label>
            <label className="block space-y-1">
              <span className="text-[13px] text-[#a1a1a1]">Teams webhook URL</span>
              <input
                value={settings.teamsWebhookUrl}
                onChange={(e) => setSettings({ ...settings, teamsWebhookUrl: e.target.value })}
                placeholder="https://outlook.office.com/webhook/..."
                className="w-full"
              />
            </label>
            <label className="flex items-center gap-2 text-[13px]">
              <input
                type="checkbox"
                checked={settings.smsEnabled}
                onChange={(e) => setSettings({ ...settings, smsEnabled: e.target.checked })}
              />
              <Smartphone className="size-3.5" /> Enable SMS alerts
            </label>
            <label className="block space-y-1">
              <span className="text-[13px] text-[#a1a1a1]">Phone (E.164, e.g. +919876543210)</span>
              <input
                value={settings.smsPhone}
                onChange={(e) => setSettings({ ...settings, smsPhone: e.target.value })}
                placeholder="+91..."
                className="w-full"
              />
            </label>
          </AdminPanelBody>
        </AdminPanel>
      </div>

      <AdminPanel>
        <AdminPanelHeader title="Trigger rules" description="When to fire instant alerts (digest is separate)." />
        <AdminPanelBody className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-[13px]">
            <input
              type="checkbox"
              checked={settings.alertOnUptimeFailure}
              onChange={(e) => setSettings({ ...settings, alertOnUptimeFailure: e.target.checked })}
            />
            Uptime check failures
          </label>
          <label className="flex items-center gap-2 text-[13px]">
            <input
              type="checkbox"
              checked={settings.alertOnError}
              onChange={(e) => setSettings({ ...settings, alertOnError: e.target.checked })}
            />
            Sentry / error spikes
          </label>
          <label className="flex items-center gap-2 text-[13px]">
            <input
              type="checkbox"
              checked={settings.alertOnDeploy}
              onChange={(e) => setSettings({ ...settings, alertOnDeploy: e.target.checked })}
            />
            New deployments
          </label>
        </AdminPanelBody>
      </AdminPanel>

      <div className="flex flex-wrap gap-2">
        <AdminPrimaryButton onClick={() => void save()} type="button">
          {saving ? "Saving…" : "Save settings"}
        </AdminPrimaryButton>
        <AdminSecondaryButton onClick={() => void sendTest()}>
          {testing ? "Sending…" : "Send test alert"}
        </AdminSecondaryButton>
      </div>
    </div>
  );
}
