"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireWorkspace } from "./supabase";
import {
  recordSchemas,
  validateAttachment,
  stagedFileSchema,
  attachmentMime,
  safeFilename,
  isExe,
} from "./validation";
import { signExeUpload, verifyExeUpload, removeExeUpload } from "./r2";
export type Result = {
  error?: string;
  success?: string;
  keepFiles?: boolean;
  redirectTo?: string;
};
const field = (form: FormData, name: string) => String(form.get(name) || "");
type Upload = z.infer<typeof stagedFileSchema>;
function readUploads(form: FormData, release: boolean): Upload[] {
  if (form.getAll("attachments").some((v) => v instanceof File && v.size > 0))
    throw new Error("Enable JavaScript for direct file uploads.");
  let uploads: Upload[];
  try {
    uploads = z
      .array(stagedFileSchema)
      .parse(JSON.parse(field(form, "staged_files") || "[]"));
  } catch {
    throw new Error("Upload metadata is invalid. Choose the files again.");
  }
  uploads.forEach((file) =>
    validateAttachment(
      { name: file.name, size: file.original_size ?? file.size },
      release,
    ),
  );
  return uploads;
}
async function verifyUploads(
  db: Awaited<ReturnType<typeof requireWorkspace>>["db"],
  uploads: Upload[],
) {
  for (const file of uploads) {
    if (file.storage_provider === "r2") {
      await verifyExeUpload(file.path, file.size);
      continue;
    }
    const { data, error } = await db.storage
      .from("development-files")
      .info(file.path);
    if (error || !data || data.size !== file.size)
      throw new Error(
        "An uploaded file could not be verified. Please try again.",
      );
  }
}
async function attach(
  db: Awaited<ReturnType<typeof requireWorkspace>>["db"],
  kind: string,
  id: string,
  uploads: Upload[],
) {
  if (!uploads.length) return null;
  const { error } = await db.from("files").insert(
    uploads.map((file) => ({
      id: file.id,
      storage_provider: file.storage_provider,
      path: file.path,
      name: file.name,
      size: file.size,
      mime_type: attachmentMime(file.name),
      compression: file.compression,
      original_size: file.original_size ?? file.size,
      comment: file.comment,
      parent_type: kind,
      parent_id: id,
      created_by: null,
    })),
  );
  return error;
}
export async function saveRecord(_: Result, form: FormData): Promise<Result> {
  const { db } = await requireWorkspace();
  const kind = field(form, "kind");
  if (!["builds", "testing_reports", "weekly_updates"].includes(kind))
    return { error: "Choose Releases, Tester reports, or Progress." };
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const raw = Object.fromEntries(form.entries());
  const schema =
    recordSchemas[kind as "builds" | "testing_reports" | "weekly_updates"];
  const parsed = schema.safeParse({
    ...raw,
    published: true,
    build_id: field(form, "build_id") || null,
    week_start: field(form, "week_start") || date,
    week_end: field(form, "week_end") || date,
    summary: field(form, "summary") || field(form, "title"),
  });
  if (!parsed.success)
    return {
      error: parsed.error.issues[0]?.message || "Check the form fields.",
    };
  let uploads: Upload[];
  try {
    uploads = readUploads(form, kind === "builds");
    if (kind !== "builds" && !uploads.length)
      return { error: "Attach a PDF or Markdown file." };
    await verifyUploads(db, uploads);
  } catch (cause) {
    return { error: (cause as Error).message };
  }
  const id = crypto.randomUUID();
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
        createError.code === "23505"
          ? "That release name already exists. Open it to add more files."
          : "Could not save. Check the latest SQL setup and your connection.",
    };
  const attachmentError = await attach(db, kind, id, uploads);
  if (attachmentError) {
    const { error } = await db.from(kind).delete().eq("id", id);
    revalidatePath("/development", "layout");
    return {
      error: error
        ? "Could not attach all files. Check the list for an incomplete entry before retrying."
        : "Could not attach the files. Please try again.",
      keepFiles: !!error,
    };
  }
  if ("published" in parsed.data) {
    const { error } = await db
      .from(kind)
      .update({ published: true })
      .eq("id", id);
    if (error)
      return {
        error:
          "The entry and files were saved, but publishing failed. Check the list before retrying.",
        keepFiles: true,
      };
  }
  revalidatePath("/development", "layout");
  return {
    success:
      kind === "builds"
        ? "Release created."
        : kind === "testing_reports"
          ? "Report uploaded."
          : "Progress uploaded.",
    ...(kind === "builds" ? { redirectTo: `/development#release-${id}` } : {}),
  };
}
export async function addReleaseFiles(
  _: Result,
  form: FormData,
): Promise<Result> {
  const { db } = await requireWorkspace();
  const id = z.uuid().safeParse(field(form, "release_id"));
  if (!id.success) return { error: "Choose a valid release." };
  const { data: release, error } = await db
    .from("builds")
    .select("id")
    .eq("id", id.data)
    .maybeSingle();
  if (error || !release) return { error: "This release could not be found." };
  let uploads: Upload[];
  try {
    uploads = readUploads(form, true);
    if (!uploads.length) return { error: "Choose at least one file." };
    await verifyUploads(db, uploads);
  } catch (cause) {
    return { error: (cause as Error).message };
  }
  if (await attach(db, "builds", id.data, uploads))
    return { error: "Could not add these files. Please try again." };
  revalidatePath("/development", "layout");
  return {
    success: `${uploads.length} ${uploads.length === 1 ? "file" : "files"} added to the release.`,
  };
}
export async function saveFileComment(
  _: Result,
  form: FormData,
): Promise<Result> {
  const { db } = await requireWorkspace();
  const parsed = z
    .object({ id: z.uuid(), comment: z.string().trim().max(2000) })
    .safeParse({ id: field(form, "id"), comment: field(form, "comment") });
  if (!parsed.success)
    return { error: "Comments must be 2,000 characters or fewer." };
  const { data, error } = await db
    .from("files")
    .update({ comment: parsed.data.comment })
    .eq("id", parsed.data.id)
    .eq("parent_type", "builds")
    .select("id");
  if (error || !data?.length)
    return {
      error: "Could not save the comment. Check the latest SQL update.",
    };
  revalidatePath("/development", "layout");
  return { success: "Comment saved." };
}

export async function prepareExeUpload(input: {
  id: string;
  name: string;
  size: number;
}) {
  await requireWorkspace();
  const parsed = z
    .object({
      id: z.uuid(),
      name: z.string().min(1).max(255),
      size: z.number().int().positive(),
    })
    .safeParse(input);
  if (!parsed.success) return { error: "Invalid EXE upload." };
  try {
    validateAttachment(parsed.data, true);
    if (!isExe(parsed.data.name)) return { error: "Only EXE files use R2." };
    const path = `shared/${parsed.data.id}/${safeFilename(parsed.data.name)}`;
    return { url: await signExeUpload(path, parsed.data.size) };
  } catch (cause) {
    return {
      error:
        cause instanceof Error
          ? cause.message
          : "Could not prepare the R2 upload.",
    };
  }
}
export async function discardExeUploads(inputs: unknown) {
  const { db } = await requireWorkspace();
  const parsed = z.array(stagedFileSchema).max(100).safeParse(inputs);
  if (!parsed.success) return;
  for (const file of parsed.data.filter((f) => f.storage_provider === "r2")) {
    const { data, error } = await db
      .from("files")
      .select("id")
      .eq("path", file.path)
      .limit(1);
    if (!error && data && !data.length)
      await removeExeUpload(file.path).catch(() => {});
  }
}
