/**
 * CMS file upload routing.
 *
 * Production (Vercel): uploads go to Cloudflare R2 — local disk is read-only.
 * Local dev: files save to public/uploads/cms/ when R2 is not configured.
 */
import { promises as fs } from "fs";
import path from "path";
import { isR2Configured, uploadToR2 } from "@/lib/cms/r2";

export function isVercelRuntime() {
  return process.env.VERCEL === "1";
}

export function canUseLocalFileStore() {
  return !isVercelRuntime();
}

export async function uploadCmsFile(
  filename: string,
  buffer: Buffer,
  contentType: string
): Promise<{ url: string }> {
  if (isR2Configured()) {
    return uploadToR2(filename, buffer, contentType);
  }

  if (isVercelRuntime()) {
    throw new Error(
      "File uploads require Cloudflare R2. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL in Vercel environment variables."
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "cms");
  const filepath = path.join(uploadDir, filename);
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(filepath, buffer);

  return { url: `/uploads/cms/${filename}` };
}
