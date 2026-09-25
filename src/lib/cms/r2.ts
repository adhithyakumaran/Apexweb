import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
  endpoint?: string;
};

function env(name: string) {
  const value = process.env[name];
  return value?.trim() || "";
}

export function getR2Config(): R2Config | null {
  const accountId = env("R2_ACCOUNT_ID");
  const accessKeyId = env("R2_ACCESS_KEY_ID");
  const secretAccessKey = env("R2_SECRET_ACCESS_KEY");
  const bucketName = env("R2_BUCKET_NAME");
  const publicUrl = env("R2_PUBLIC_URL");

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
    return null;
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicUrl: publicUrl.replace(/\/$/, ""),
    endpoint: env("R2_ENDPOINT") || undefined,
  };
}

export function isR2Configured() {
  return getR2Config() !== null;
}

function createR2Client(config: R2Config) {
  const endpoint =
    config.endpoint ?? `https://${config.accountId}.r2.cloudflarestorage.com`;

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

export async function uploadToR2(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<{ url: string }> {
  const config = getR2Config();
  if (!config) {
    throw new Error(
      "Cloudflare R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL in Vercel."
    );
  }

  const objectKey = key.startsWith("cms/") ? key : `cms/${key}`;
  const client = createR2Client(config);

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: config.bucketName,
        Key: objectKey,
        Body: buffer,
        ContentType: contentType,
      })
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "R2 upload failed";
    throw new Error(`R2 upload failed: ${message}`);
  }

  return { url: `${config.publicUrl}/${objectKey}` };
}

export function getR2PublicHostname() {
  const config = getR2Config();
  if (!config) return null;
  try {
    return new URL(config.publicUrl).hostname;
  } catch {
    return null;
  }
}

export function getR2ConfigStatus() {
  return {
    accountId: Boolean(env("R2_ACCOUNT_ID")),
    accessKeyId: Boolean(env("R2_ACCESS_KEY_ID")),
    secretAccessKey: Boolean(env("R2_SECRET_ACCESS_KEY")),
    bucketName: Boolean(env("R2_BUCKET_NAME")),
    publicUrl: Boolean(env("R2_PUBLIC_URL")),
    configured: isR2Configured(),
  };
}
