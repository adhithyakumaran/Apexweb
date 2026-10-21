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
export type Progress = {
  id: string;
  title: string;
  summary: string;
  created_at: string;
};
export type Report = {
  id: string;
  build_id: string | null;
  tester_name: string;
  findings: string;
  created_at: string;
};
export type HubFile = {
  id: string;
  name: string;
  size: number;
  mime_type: string;
  compression: "none" | "gzip";
  original_size: number | null;
  parent_type: string;
  parent_id: string;
  comment: string;
};
async function readFiles(
  db: Awaited<ReturnType<typeof requireWorkspace>>["db"],
) {
  const files: HubFile[] = [];
  // Packages can grow beyond Supabase's default single-response row limit.
  for (let start = 0; ; start += 500) {
    const { data, error } = await db
      .from("files")
      .select("*")
      .order("created_at")
      .order("id")
      .range(start, start + 499);
    if (error)
      throw new Error("Could not load release files. Check the connection.");
    const page = (data || []).map((file) => ({
      ...file,
      comment: file.comment || "",
    })) as HubFile[];
    files.push(...page);
    if (page.length < 500) return files;
  }
}
export const getHubData = cache(async () => {
  const { db } = await requireWorkspace();
  const [builds, updates, reports, files] = await Promise.all([
    db.from("builds").select("*").order("created_at", { ascending: false }),
    db
      .from("weekly_updates")
      .select("*")
      .order("created_at", { ascending: false }),
    db
      .from("testing_reports")
      .select("*")
      .order("created_at", { ascending: false }),
    readFiles(db),
  ]);
  if ([builds, updates, reports].some((result) => result.error))
    throw new Error(
      "Could not load the workspace. Check the latest database migration.",
    );
  return {
    builds: (builds.data || []) as Build[],
    updates: (updates.data || []) as Progress[],
    reports: (reports.data || []) as Report[],
    files,
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
