import { requireWorkspace } from "./supabase";
import { cache } from "react";
export type Build = {
  id: string;
  version: string;
  release_notes: string;
  instructions: string;
  known_issues: string;
  published: boolean;
  created_at: string;
};
export type Document = {
  id: string;
  title: string;
  category: string;
  body: string;
  published: boolean;
  created_at: string;
};
export type WeeklyUpdate = {
  id: string;
  week_start: string;
  week_end: string;
  summary: string;
  published: boolean;
  created_at: string;
};
export type Report = {
  id: string;
  build_id: string;
  findings: string;
  tester_name: string;
  created_at: string;
};
export type Task = {
  id: string;
  title: string;
  description: string;
  owner_name: string;
  report_id: string | null;
  priority: string;
  status: string;
  created_at: string;
};
export type Event = { id: string; title: string; event_date: string };
export type HubFile = {
  id: string;
  name: string;
  size: number;
  mime_type: string;
  compression: "none" | "gzip";
  original_size: number | null;
  parent_type: string;
  parent_id: string;
};
export const getHubData = cache(async () => {
  const access = await requireWorkspace();
  const results = await Promise.all([
    access.db
      .from("builds")
      .select("*")
      .order("created_at", { ascending: false }),
    access.db
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false }),
    access.db
      .from("weekly_updates")
      .select("*")
      .order("week_end", { ascending: false }),
    access.db
      .from("testing_reports")
      .select("*")
      .order("created_at", { ascending: false }),
    access.db
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false }),
    access.db.from("events").select("*").order("event_date"),
    access.db
      .from("files")
      .select(
        "id,name,size,mime_type,parent_type,parent_id,compression,original_size",
      ),
  ]);
  if (results.some((r) => r.error))
    throw new Error(
      "Workspace records could not be loaded. Check the migration and database permissions.",
    );
  return {
    ...access,
    builds: (results[0].data || []) as Build[],
    documents: (results[1].data || []) as Document[],
    updates: (results[2].data || []) as WeeklyUpdate[],
    reports: (results[3].data || []) as Report[],
    tasks: (results[4].data || []) as Task[],
    events: (results[5].data || []) as Event[],
    files: (results[6].data || []) as HubFile[],
  };
});
export type HubData = Awaited<ReturnType<typeof getHubData>>;
export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value.length === 10 ? `${value}T00:00:00+05:30` : value));
}
export function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
