"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UptimeRobotSnapshot } from "@/lib/monitoring/uptimerobot-query";
import {
  AdminAlert,
  AdminPanel,
  AdminPanelBody,
  AdminPanelHeader,
  AdminSecondaryButton,
  AdminStatCard,
  AdminStatusDot,
  AdminStatusStrip,
} from "@/components/admin/admin-ui";
import { adminClasses } from "@/components/admin/admin-theme";
import { cn } from "@/lib/utils";
import { ExternalLink, RefreshCw } from "lucide-react";

type UptimeRobotPanelProps = {
  data: UptimeRobotSnapshot;
};

const statusTone = {
  up: "success",
  down: "danger",
  paused: "warning",
  unknown: "neutral",
} as const;

export function UptimeRobotPanel({ data }: UptimeRobotPanelProps) {
  const router = useRouter();
  const [embedOpen, setEmbedOpen] = useState(Boolean(data.statusPageUrl));

  function refresh() {
    router.push("/admin/uptime?refresh=1");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <AdminStatusStrip>
        <AdminStatusDot tone={data.configured ? "success" : "warning"}>
          UptimeRobot {data.configured ? "API connected" : "API key not set"}
        </AdminStatusDot>
        <AdminStatusDot tone={data.downCount === 0 ? "success" : "danger"}>
          {data.downCount === 0 ? "All monitors up" : `${data.downCount} down`}
        </AdminStatusDot>
        {data.lastSyncedAt && (
          <span className="ml-auto text-[13px] text-[#666]">
            Synced {new Date(data.lastSyncedAt).toLocaleTimeString()}
          </span>
        )}
      </AdminStatusStrip>

      {data.setupMessage && <AdminAlert tone="info">{data.setupMessage}</AdminAlert>}

      {!data.configured && (
        <AdminAlert tone="info">
          <p>
            Set <code className="text-[#ededed]">UPTIMEROBOT_API_KEY</code> in Vercel (Main API key
            from UptimeRobot → My Settings → API). Optional:{" "}
            <code className="text-[#ededed]">NEXT_PUBLIC_UPTIMEROBOT_STATUS_PAGE_URL</code> for your
            public status page embed.
          </p>
        </AdminAlert>
      )}

      <div className="grid gap-px overflow-hidden rounded-md border border-[#333] sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Monitors up" value={data.upCount} className="rounded-none border-0 border-r border-[#333]" />
        <AdminStatCard label="Down" value={data.downCount} className="rounded-none border-0 border-r border-[#333]" />
        <AdminStatCard label="Paused" value={data.pausedCount} className="rounded-none border-0 border-r border-[#333]" />
        <AdminStatCard
          label="Avg response"
          value={data.avgResponseMs != null ? `${data.avgResponseMs}ms` : "—"}
          className="rounded-none border-0"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={data.dashboardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(adminClasses.primaryBtn, "inline-flex items-center gap-2")}
        >
          <ExternalLink className="size-3.5" />
          Open UptimeRobot
        </a>
        {data.statusPageUrl && (
          <a
            href={data.statusPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(adminClasses.secondaryBtn, "inline-flex items-center gap-2")}
          >
            <ExternalLink className="size-3.5" />
            Status page
          </a>
        )}
        <AdminSecondaryButton onClick={refresh}>
          <RefreshCw className="size-3.5" />
          Refresh
        </AdminSecondaryButton>
      </div>

      <AdminPanel>
        <AdminPanelHeader title="Monitors" description="Live data from UptimeRobot API (cached 5 min)." />
        <AdminPanelBody className="p-0">
          {data.monitors.length === 0 ? (
            <p className="px-4 py-12 text-center text-[13px] text-[#666]">
              No monitors loaded. Add the API key or create monitors in UptimeRobot.
            </p>
          ) : (
            <table className="w-full min-w-[720px] text-left text-[13px]">
              <thead className={adminClasses.tableHead}>
                <tr>
                  <th className="px-4 py-2.5 font-medium">Monitor</th>
                  <th className="px-3 py-2.5 font-medium">URL</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-3 py-2.5 text-right font-medium">Response</th>
                  <th className="px-4 py-2.5 text-right font-medium">Uptime %</th>
                </tr>
              </thead>
              <tbody>
                {data.monitors.map((monitor) => (
                  <tr key={monitor.id} className={adminClasses.tableRow}>
                    <td className="px-4 py-2.5 text-[#ededed]">{monitor.name}</td>
                    <td className="max-w-[200px] truncate px-3 py-2.5 font-mono text-[11px] text-[#666]">
                      {monitor.url}
                    </td>
                    <td className="px-3 py-2.5">
                      <AdminStatusDot tone={statusTone[monitor.status]}>
                        {monitor.statusLabel}
                      </AdminStatusDot>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-[#a1a1a1]">
                      {monitor.responseMs != null ? `${monitor.responseMs}ms` : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-[#a1a1a1]">
                      {monitor.uptimeRatio != null ? `${monitor.uptimeRatio}%` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminPanelBody>
      </AdminPanel>

      {data.statusPageUrl && (
        <AdminPanel>
          <AdminPanelHeader
            title="Public status page"
            description="Your UptimeRobot status page — share with clients or embed."
            action={
              <AdminSecondaryButton onClick={() => setEmbedOpen((v) => !v)}>
                {embedOpen ? "Hide embed" : "Show embed"}
              </AdminSecondaryButton>
            }
          />
          <AdminPanelBody>
            {embedOpen ? (
              <div className="overflow-hidden rounded border border-[#333] bg-[#0a0a0a]">
                <iframe
                  title="UptimeRobot status"
                  src={data.statusPageUrl}
                  className="h-[min(60vh,560px)] w-full"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              </div>
            ) : (
              <p className="text-[13px] text-[#666]">Embed hidden.</p>
            )}
          </AdminPanelBody>
        </AdminPanel>
      )}
    </div>
  );
}
