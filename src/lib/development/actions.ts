"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireWorkspace } from "./supabase";
import {
  recordSchemas,
  taskStates,
  validateAttachment,
  MAX_FILE_SIZE,
  stagedFileSchema,
  attachmentMime,
} from "./validation";
export type Result = { error?: string; success?: string; keepFiles?: boolean };
const field = (form: FormData, name: string) => String(form.get(name) || "");
const nullable = (form: FormData, name: string) => field(form, name) || null;
export async function saveRecord(_: Result, form: FormData): Promise<Result> {
  const { db } = await requireWorkspace();
  const kind = field(form, "kind");
  if (!Object.hasOwn(recordSchemas, kind))
    return { error: "Unsupported content type." };
  const raw = Object.fromEntries(form.entries());
  const schema = recordSchemas[kind as keyof typeof recordSchemas];
  const parsed = schema.safeParse({
    ...raw,
    published: form.get("published") === "on",
    active: form.get("active") === "on",
    owner_id: nullable(form, "owner_id"),
    report_id: nullable(form, "report_id"),
  });
  if (!parsed.success)
    return {
      error: parsed.error.issues[0]?.message || "Check the form fields.",
    };
  if (
    form
      .getAll("attachments")
      .some((value) => value instanceof File && value.size > 0)
  )
    return { error: "Enable JavaScript to upload files directly to Supabase." };
  let uploads: z.infer<typeof stagedFileSchema>[];
  try {
    uploads = z
      .array(stagedFileSchema)
      .max(5)
      .parse(JSON.parse(field(form, "staged_files") || "[]"));
  } catch {
    return { error: "Upload metadata is invalid. Choose the files again." };
  }
  if (
    uploads.reduce((sum, file) => sum + (file.original_size ?? file.size), 0) >
    MAX_FILE_SIZE
  )
    return { error: "Attachments must total 25 MB or less." };
  if (uploads.length > 5)
    return { error: "Attach up to five files per submission." };
  try {
    uploads.forEach((file) => validateAttachment(file, kind === "builds"));
  } catch (e) {
    return { error: (e as Error).message };
  }
  if ((kind === "builds" || kind === "weekly_updates") && uploads.length === 0)
    return {
      error:
        kind === "builds"
          ? "Attach a build bundle."
          : "Attach the weekly PDF or Markdown report.",
    };
  if (
    kind === "weekly_updates" &&
    uploads.some((f) => !/\.(pdf|md|markdown)$/i.test(f.name))
  )
    return { error: "Weekly reports must be PDF or Markdown." };
  if (
    kind === "documents" &&
    !("body" in parsed.data && parsed.data.body) &&
    uploads.length === 0
  )
    return { error: "Enter Markdown content or attach a document." };
  if (
    kind === "documents" &&
    uploads.some((f) => !/\.(pdf|md|markdown)$/i.test(f.name))
  )
    return { error: "Documents must be PDF or Markdown." };
  for (const file of uploads) {
    const { data: info, error } = await db.storage
      .from("development-files")
      .info(file.path);
    if (error || !info || info.size !== file.size)
      return {
        error:
          "An uploaded file could not be verified. Choose the files again.",
      };
  }
  const id = crypto.randomUUID();
  const publishing = "published" in parsed.data && parsed.data.published;
  const content =
    "published" in parsed.data
      ? { ...parsed.data, published: false }
      : parsed.data;
  const { error: createError } = await db
    .from(kind)
    .insert({ ...content, id, created_by: null });
  if (createError)
    return {
      error:
        "Could not save. Check the URL-access database setup and referenced records.",
    };
  const paths: string[] = [];
  try {
    for (const file of uploads) {
      const path = file.path;
      const fileId = file.id;
      const mime = attachmentMime(file.name);
      paths.push(path);
      const { error: metadataError } = await db.from("files").insert({
        id: fileId,
        path,
        name: file.name,
        size: file.size,
        mime_type: mime,
        compression: file.compression,
        original_size: file.original_size ?? file.size,
        parent_type: kind,
        parent_id: id,
        created_by: null,
      });
      if (metadataError) throw metadataError;
    }
  } catch {
    const removed = paths.length
      ? await db.storage.from("development-files").remove(paths)
      : { error: null };
    const rolledBack = await db.from(kind).delete().eq("id", id);
    revalidatePath("/development", "layout");
    return {
      error:
        rolledBack.error || removed.error
          ? "Upload failed and cleanup could not be completed. Check for an incomplete submission in the list before retrying."
          : "Upload failed; the submission was not kept. Check the private Storage bucket and try again.",
      keepFiles: Boolean(rolledBack.error),
    };
  }
  if (publishing) {
    const { error } = await db
      .from(kind)
      .update({ published: true })
      .eq("id", id);
    if (error) {
      revalidatePath("/development", "layout");
      return {
        error:
          "Files were saved as a draft, but publishing failed. Retry Publish from the list.",
        keepFiles: true,
      };
    }
  }
  revalidatePath("/development", "layout");
  return {
    success:
      kind === "testing_reports"
        ? "Testing report submitted."
        : "published" in parsed.data && !parsed.data.published
          ? "Draft saved. Publish it from the list when ready."
          : "Saved successfully.",
  };
}
export async function changeTask(_: Result, form: FormData): Promise<Result> {
  const { db } = await requireWorkspace();
  const parsed = z
    .object({ id: z.uuid(), status: z.enum(taskStates) })
    .safeParse({ id: field(form, "id"), status: field(form, "status") });
  if (!parsed.success) return { error: "Choose a valid task and status." };
  const query = db
    .from("tasks")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);
  const { data, error } = await query.select("id");
  if (error || !data?.length) return { error: "Could not update this task." };
  revalidatePath("/development", "layout");
  return { success: "Task status updated." };
}
export async function publishRecord(
  _: Result,
  form: FormData,
): Promise<Result> {
  const { db } = await requireWorkspace();
  const kind = field(form, "kind");
  if (
    !["builds", "documents", "weekly_updates"].includes(kind) ||
    !z.uuid().safeParse(field(form, "id")).success
  )
    return { error: "Invalid record." };
  const { error, data } = await db
    .from(kind)
    .update({ published: true })
    .eq("id", field(form, "id"))
    .select("id");
  if (error || !data?.length)
    return { error: "Could not publish this record." };
  revalidatePath("/development", "layout");
  return { success: "Published to the workspace." };
}

export async function updateTask(_: Result, form: FormData): Promise<Result> {
  const { db } = await requireWorkspace();
  const id = z.uuid().safeParse(field(form, "id"));
  const parsed = recordSchemas.tasks.safeParse({
    ...Object.fromEntries(form.entries()),
    owner_id: nullable(form, "owner_id"),
    report_id: nullable(form, "report_id"),
  });
  if (!id.success || !parsed.success)
    return { error: "Check the task fields, owner, and related report." };
  const { data, error } = await db
    .from("tasks")
    .update(parsed.data)
    .eq("id", id.data)
    .select("id");
  if (error || !data?.length) return { error: "Could not update this task." };
  revalidatePath("/development", "layout");
  return { success: "Task details saved." };
}
