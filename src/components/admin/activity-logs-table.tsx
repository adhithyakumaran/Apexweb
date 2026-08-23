"use client";

import { useMemo, useState } from "react";
import { activityActionLabels, type ActivityLogLevel } from "@/lib/cms/activity-log-shared";
import {
  AdminPanel,
  AdminPanelBody,
  AdminPanelHeader,
  AdminStatusPill,
} from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

export type ActivityLogView = {
  id: number;
  action: string;
  level: string;
  message: string;
  resourceType?: string | null;
  resourceId?: string | null;
  createdAt: string;
};

type ActivityLogsTableProps = {
  logs: ActivityLogView[];
};

const levelTone = {
  info: "neutral",
  success: "success",
  warning: "warning",
  error: "danger",
} as const;

const levelFilters: Array<ActivityLogLevel | "all"> = [
  "all",
  "info",
  "success",
  "warning",
  "error",
];

export function ActivityLogsTable({ logs }: ActivityLogsTableProps) {
  const [level, setLevel] = useState<ActivityLogLevel | "all">("all");
  const [action, setAction] = useState<string>("all");

  const actions = useMemo(() => {
    const unique = new Set(logs.map((log) => log.action));
    return ["all", ...Array.from(unique)];
  }, [logs]);

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (level !== "all" && log.level !== level) return false;
      if (action !== "all" && log.action !== action) return false;
      return true;
    });
  }, [logs, level, action]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {levelFilters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLevel(item)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
              level === item
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="action-filter" className="text-xs font-medium text-neutral-500">
          Action
        </label>
        <select
          id="action-filter"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-neutral-400"
        >
          {actions.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "All actions" : activityActionLabels[item] ?? item}
            </option>
          ))}
        </select>
        <span className="ml-auto text-xs text-neutral-500">
          Showing {filtered.length} of {logs.length}
        </span>
      </div>

      <AdminPanel>
        <AdminPanelHeader
          title="Activity log"
          description="Editor sign-ins, publishes, uploads, and content changes."
        />
        <AdminPanelBody className="p-0">
          {filtered.length === 0 ? (
            <p className="px-6 py-14 text-center text-sm text-neutral-500">
              No log entries match your filters.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-neutral-100 bg-neutral-50/80 text-[0.68rem] uppercase tracking-[0.14em] text-neutral-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Time</th>
                    <th className="px-4 py-3 font-semibold">Level</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                    <th className="px-5 py-3 font-semibold">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filtered.map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-50/70">
                      <td className="px-5 py-3.5 tabular-nums text-neutral-500">
                        {new Date(log.createdAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3.5">
                        <AdminStatusPill
                          tone={levelTone[log.level as ActivityLogLevel] ?? "neutral"}
                        >
                          {log.level}
                        </AdminStatusPill>
                      </td>
                      <td className="px-4 py-3.5 text-neutral-600">
                        {activityActionLabels[log.action] ?? log.action}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-neutral-900">{log.message}</p>
                        {log.resourceType && (
                          <p className="mt-0.5 font-mono text-xs text-neutral-400">
                            {log.resourceType}
                            {log.resourceId ? ` · ${log.resourceId}` : ""}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminPanelBody>
      </AdminPanel>
    </div>
  );
}
