"use client";

import { useMemo, useState } from "react";
import { activityActionLabels, type ActivityLogLevel } from "@/lib/cms/activity-log-shared";
import {
  AdminFilterBar,
  AdminFilterSelect,
  AdminPanel,
  AdminPanelBody,
  AdminPanelHeader,
  AdminStatusDot,
} from "@/components/admin/admin-ui";
import { adminClasses } from "@/components/admin/admin-theme";
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
  info: "info",
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
      <AdminFilterBar>
        <div className="flex flex-wrap gap-1">
          {levelFilters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setLevel(item)}
              className={cn(
                "rounded px-2.5 py-1 text-[13px] capitalize transition-colors",
                level === item
                  ? "bg-[#ededed] text-black"
                  : "text-[#a1a1a1] hover:bg-[#111] hover:text-white"
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <AdminFilterSelect
          label="Action filter"
          value={action}
          onChange={setAction}
          options={actions.map((item) => ({
            value: item,
            label: item === "all" ? "All actions" : (activityActionLabels[item] ?? item),
          }))}
        />
        <span className="ml-auto text-[13px] text-[#666]">
          {filtered.length} of {logs.length}
        </span>
      </AdminFilterBar>

      <AdminPanel>
        <AdminPanelHeader title="Events" description="Sign-ins, publishes, uploads, and content changes." />
        <AdminPanelBody className="p-0">
          {filtered.length === 0 ? (
            <p className="px-4 py-12 text-center text-[13px] text-[#666]">
              No log entries match your filters.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-[13px]">
                <thead className={adminClasses.tableHead}>
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Time</th>
                    <th className="px-3 py-2.5 font-medium">Level</th>
                    <th className="px-3 py-2.5 font-medium">Action</th>
                    <th className="px-4 py-2.5 font-medium">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log) => (
                    <tr key={log.id} className={adminClasses.tableRow}>
                      <td className="px-4 py-2.5 tabular-nums text-[#666]">
                        {new Date(log.createdAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-3 py-2.5">
                        <AdminStatusDot
                          tone={levelTone[log.level as ActivityLogLevel] ?? "neutral"}
                        >
                          {log.level}
                        </AdminStatusDot>
                      </td>
                      <td className="px-3 py-2.5 text-[#a1a1a1]">
                        {activityActionLabels[log.action] ?? log.action}
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="text-[#ededed]">{log.message}</p>
                        {log.resourceType && (
                          <p className="mt-0.5 font-mono text-[11px] text-[#666]">
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
