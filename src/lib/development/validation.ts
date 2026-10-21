import { z } from "zod";
export const sections = [
  "documents",
  "builds",
  "progress",
  "testing",
  "tasks",
] as const;
export const taskStates = ["Open", "In progress", "Retest", "Done"] as const;
const text = z.string().trim().min(1).max(20000);
const title = z.string().trim().min(1).max(160);
const date = z.iso.date();
export const recordSchemas = {
  builds: z.object({
    version: title,
    release_notes: text,
    instructions: text,
    known_issues: z.string().trim().max(20000),
    published: z.boolean(),
  }),
  documents: z.object({
    title,
    category: z.enum(["Architecture", "Standards", "Setup", "Manual"]),
    body: z.string().trim().max(100000),
    published: z.boolean(),
  }),
  weekly_updates: z
    .object({
      week_start: date,
      week_end: date,
      summary: text,
      published: z.boolean(),
    })
    .refine(
      (v) => v.week_end >= v.week_start,
      "Reporting end must be on or after the start.",
    ),
  testing_reports: z.object({
    build_id: z.uuid(),
    tester_name: title,
    findings: text,
  }),
  tasks: z.object({
    title,
    description: z.string().trim().max(20000),
    owner_name: z.string().trim().max(160).default(""),
    priority: z.enum(["Low", "Medium", "High"]),
    report_id: z.uuid().nullable(),
    status: z.enum(taskStates),
  }),
  events: z.object({ title, event_date: date }),
};
export const MAX_FILE_SIZE = 25 * 1024 * 1024;
export const attachmentTypes = [
  "pdf",
  "md",
  "markdown",
  "png",
  "jpg",
  "jpeg",
  "webp",
];
export const buildTypes = [
  "zip",
  "apk",
  "aab",
  "ipa",
  "exe",
  "msi",
  "dmg",
  "tar",
  "gz",
  "appimage",
];
export function validateAttachment(
  file: { name: string; size: number },
  build: boolean,
) {
  const extension = file.name.toLowerCase().split(".").pop() || "";
  if (file.size > MAX_FILE_SIZE)
    throw new Error("Each file must be 25 MB or smaller.");
  if (!(build ? buildTypes : attachmentTypes).includes(extension))
    throw new Error(
      build
        ? "Choose a supported build bundle."
        : "Choose PDF, Markdown, PNG, JPEG, or WebP.",
    );
  return extension;
}
export function safeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
}
export function attachmentMime(name: string) {
  const extension = name.toLowerCase().split(".").pop();
  return (
    (
      {
        pdf: "application/pdf",
        md: "text/markdown",
        markdown: "text/markdown",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        webp: "image/webp",
        zip: "application/zip",
      } as Record<string, string>
    )[extension || ""] || "application/octet-stream"
  );
}
export const stagedFileSchema = z
  .object({
    id: z.uuid(),
    name: z.string().min(1).max(255),
    path: z.string().max(200),
    size: z.number().int().positive().max(MAX_FILE_SIZE),
    compression: z.enum(["none", "gzip"]).default("none"),
    original_size: z.number().int().positive().max(MAX_FILE_SIZE).optional(),
  })
  .refine(
    (f) => f.path === `shared/${f.id}/${safeFilename(f.name)}`,
    "Invalid upload path",
  )
  .refine(
    (f) =>
      f.compression === "gzip"
        ? !!f.original_size && f.original_size > f.size
        : f.original_size === undefined || f.original_size === f.size,
    "Invalid compression metadata",
  );
