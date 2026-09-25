import { NextResponse } from "next/server";
import path from "path";
import { logCmsActivity } from "@/lib/cms/activity-log";
import { requireCmsAuth } from "@/lib/cms/api-auth";
import { uploadCmsFile } from "@/lib/cms/storage";

const maxBytes = 12 * 1024 * 1024;

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/zip",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function safeFilename(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

export async function POST(request: Request) {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > maxBytes) {
    return NextResponse.json({ error: "File exceeds 12MB limit" }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  const ext = path.extname(file.name) || "";
  const base = safeFilename(path.basename(file.name, ext));
  const stamp = Date.now();
  const filename = `${stamp}-${base}${ext}`;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url } = await uploadCmsFile(filename, buffer, file.type);

    await logCmsActivity({
      action: "media.uploaded",
      level: "success",
      message: `Uploaded ${file.name}`,
      resourceType: "media",
      resourceId: filename,
      metadata: { url, size: file.size, type: file.type },
    });

    return NextResponse.json({
      url,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    await logCmsActivity({
      action: "media.uploaded",
      level: "error",
      message: `Upload failed: ${file.name}`,
      resourceType: "media",
      metadata: { error: message },
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
