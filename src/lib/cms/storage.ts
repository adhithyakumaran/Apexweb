import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";

export function isVercelRuntime() {
  return process.env.VERCEL === "1";
}

export function canUseLocalFileStore() {
  return !isVercelRuntime();
}

export function isBlobStorageConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function uploadCmsFile(
  filename: string,
  buffer: Buffer,
  contentType: string
): Promise<{ url: string }> {
  if (isBlobStorageConfigured()) {
    const blob = await put(`cms/${filename}`, buffer, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });
    return { url: blob.url };
  }

  if (isVercelRuntime()) {
    throw new Error(
      "File uploads require Vercel Blob. In your Vercel project go to Storage → Create Blob Store, then redeploy."
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "cms");
  const filepath = path.join(uploadDir, filename);
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(filepath, buffer);

  return { url: `/uploads/cms/${filename}` };
}
