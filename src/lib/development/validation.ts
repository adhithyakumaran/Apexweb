import { z } from "zod";
export const sections = ["releases", "reports", "progress"] as const;
export const taskStates = ["Open", "In progress", "Retest", "Done"] as const;
const text = z.string().trim().min(1).max(20000);
const title = z.string().trim().min(1).max(160);
const date = z.iso.date();
export const recordSchemas = {
  builds: z.object({
    version: title,
    release_notes: z.string().trim().max(20000).default(""),
    instructions: z.string().trim().max(20000).default(""),
    known_issues: z.string().trim().max(20000).default(""),
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
      title: title.optional(),
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
    build_id: z.uuid().nullable().default(null),
    tester_name: title,
    findings: z.string().trim().max(20000).default(""),
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
export const MAX_FILE_SIZE = 250 * 1024 * 1024;
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
    throw new Error("Each file must be 250 MB or smaller.");
  if (
    !(
      build
        ? [...buildTypes, ...attachmentTypes, "txt", "sha256", "sha256sum"]
        : ["pdf", "md", "markdown"]
    ).includes(extension)
  )
    throw new Error(
      build
        ? "Choose an installer, archive, PDF, Markdown, text, checksum, or image file."
        : "Choose a PDF or Markdown file.",
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
        txt: "text/plain",
        sha256: "text/plain",
        sha256sum: "text/plain",
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
    comment: z.string().trim().max(2000).default(""),
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

export function formatFileSize(size: number) {
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  if (size >= 1024) return `${Math.ceil(size / 1024)} KB`;
  return `${size} B`;
}
