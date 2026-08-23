"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { UptimeCheckMethod } from "@/lib/uptime/shared";
import type { UptimeCheckWithLatest } from "@/lib/uptime/checks";
import type { UptimeStats } from "@/lib/uptime/shared";
import {
  AdminAlert,
  AdminPanel,
  AdminPanelBody,
  AdminPanelHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  AdminStatCard,
  AdminStatusDot,
  AdminStatusStrip,
} from "@/components/admin/admin-ui";
import { adminClasses } from "@/components/admin/admin-theme";
import { Play, Plus, RefreshCw, Trash2 } from "lucide-react";

type UptimeAdminProps = {
  checks: UptimeCheckWithLatest[];
  stats: UptimeStats;
};

const emptyForm = {
  name: "",
  url: "/",
  method: "GET" as UptimeCheckMethod,
  expectedStatus: 200,
  timeoutMs: 10000,
  enabled: true,
};

export function UptimeAdmin({ checks: initialChecks, stats: initialStats }: UptimeAdminProps) {
  const router = useRouter();
  const [checks, setChecks] = useState(initialChecks);
  const [stats, setStats] = useState(initialStats);
  const [form, setForm] = useState(emptyForm);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function runAll() {
    setRunning(true);
    setError("");
    try {
      const response = await fetch("/api/cms/uptime/run", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Run failed");
      setChecks(data.checks);
      setStats(data.stats);
      setMessage(`Ran ${data.results?.length ?? 0} checks.`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Run failed");
    } finally {
      setRunning(false);
    }
  }

  async function addCheck() {
    setError("");
    try {
      const response = await fetch("/api/cms/uptime/checks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Create failed");
      setForm(emptyForm);
      setMessage("Check added.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    }
  }

  async function removeCheck(id: number) {
    await fetch(`/api/cms/uptime/checks/${id}`, { method: "DELETE" });
    setChecks((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <AdminStatusStrip>
        <AdminStatusDot tone={stats.downNow === 0 ? "success" : "danger"}>
          {stats.downNow === 0 ? "All endpoints up" : `${stats.downNow} down`}
        </AdminStatusDot>
        {stats.lastRunAt && (
          <span className="ml-auto text-[13px] text-[#666]">
            Last run {new Date(stats.lastRunAt).toLocaleString()}
          </span>
        )}
      </AdminStatusStrip>

      {message && <AdminAlert tone="info">{message}</AdminAlert>}
      {error && <AdminAlert tone="danger">{error}</AdminAlert>}

      <div className="grid gap-px overflow-hidden rounded-md border border-[#333] sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Uptime (7d)" value={`${stats.uptimePercent7d.toFixed(1)}%`} className="rounded-none border-0 border-r border-[#333]" />
        <AdminStatCard label="Up now" value={`${stats.upNow}/${stats.enabledChecks}`} className="rounded-none border-0 border-r border-[#333]" />
        <AdminStatCard label="Avg response" value={stats.avgResponseMs != null ? `${stats.avgResponseMs}ms` : "—"} className="rounded-none border-0 border-r border-[#333]" />
        <AdminStatCard label="Checks" value={stats.totalChecks} hint={`${stats.enabledChecks} enabled`} className="rounded-none border-0" />
      </div>

      <div className="flex flex-wrap gap-2">
        <AdminPrimaryButton onClick={() => void runAll()}>
          <Play className="size-3.5" />
          {running ? "Running…" : "Run all checks"}
        </AdminPrimaryButton>
        <AdminSecondaryButton onClick={() => router.refresh()}>
          <RefreshCw className="size-3.5" />
          Refresh
        </AdminSecondaryButton>
      </div>

      <AdminPanel>
        <AdminPanelHeader title="Monitored endpoints" description="HTTP checks against your site and APIs. Vercel Hobby runs the cron once daily; use Run all checks anytime." />
        <AdminPanelBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[13px]">
              <thead className={adminClasses.tableHead}>
                <tr>
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="px-3 py-2.5 font-medium">URL</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-3 py-2.5 font-medium">Response</th>
                  <th className="px-4 py-2.5 font-medium" />
                </tr>
              </thead>
              <tbody>
                {checks.map((check) => (
                  <tr key={check.id} className={adminClasses.tableRow}>
                    <td className="px-4 py-2.5 text-[#ededed]">{check.name}</td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-[#666]">{check.url}</td>
                    <td className="px-3 py-2.5">
                      <AdminStatusDot
                        tone={!check.latest ? "neutral" : check.latest.ok ? "success" : "danger"}
                      >
                        {!check.latest
                          ? "pending"
                          : check.latest.ok
                            ? `${check.latest.statusCode}`
                            : check.latest.error ?? "fail"}
                      </AdminStatusDot>
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-[#a1a1a1]">
                      {check.latest ? `${check.latest.responseMs}ms` : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => void removeCheck(check.id)}
                        className="text-[#666] hover:text-red-400"
                        aria-label="Delete check"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminPanelBody>
      </AdminPanel>

      <AdminPanel>
        <AdminPanelHeader title="Add endpoint" description="Paths are relative to your production URL (NEXT_PUBLIC_SITE_URL)." />
        <AdminPanelBody className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="space-y-1">
            <span className="text-[13px] text-[#a1a1a1]">Name</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Checkout API" />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-[13px] text-[#a1a1a1]">URL path or full URL</span>
            <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="/api/health" />
          </label>
          <label className="space-y-1">
            <span className="text-[13px] text-[#a1a1a1]">Method</span>
            <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value as UptimeCheckMethod })}>
              <option value="GET">GET</option>
              <option value="HEAD">HEAD</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-[13px] text-[#a1a1a1]">Expected status</span>
            <input type="number" value={form.expectedStatus} onChange={(e) => setForm({ ...form, expectedStatus: Number(e.target.value) })} />
          </label>
          <label className="space-y-1">
            <span className="text-[13px] text-[#a1a1a1]">Timeout (ms)</span>
            <input type="number" value={form.timeoutMs} onChange={(e) => setForm({ ...form, timeoutMs: Number(e.target.value) })} />
          </label>
          <div className="flex items-end sm:col-span-2 lg:col-span-3">
            <AdminPrimaryButton onClick={() => void addCheck()} type="button">
              <Plus className="size-3.5" />
              Add check
            </AdminPrimaryButton>
          </div>
        </AdminPanelBody>
      </AdminPanel>
    </div>
  );
}
