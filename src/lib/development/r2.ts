import "server-only";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function connection() {
  const account = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.R2_BUCKET_NAME?.trim();
  if (!account || !accessKeyId || !secretAccessKey || !bucket)
    throw new Error(
      "R2 is not configured. Check the existing R2 environment variables in Vercel.",
    );
  return {
    bucket,
    client: new S3Client({
      region: "auto",
      endpoint:
        process.env.R2_ENDPOINT?.trim() ||
        `https://${account}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
      requestChecksumCalculation: "WHEN_REQUIRED",
    }),
  };
}
function key(path: string) {
  if (!/^shared\/[0-9a-f-]{36}\/[a-zA-Z0-9._-]+$/.test(path))
    throw new Error("Invalid R2 upload path.");
  return `development/${path}`;
}
export async function signExeUpload(path: string, size: number) {
  const { client, bucket } = connection();
  return getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: bucket,
      Key: key(path),
      ContentType: "application/octet-stream",
      ContentLength: size,
      IfNoneMatch: "*",
    }),
    { expiresIn: 900 },
  );
}
export async function verifyExeUpload(path: string, size: number) {
  const { client, bucket } = connection();
  const object = await client.send(
    new HeadObjectCommand({ Bucket: bucket, Key: key(path) }),
  );
  if (
    object.ContentLength !== size ||
    object.ContentType !== "application/octet-stream"
  )
    throw new Error(
      "The EXE upload could not be verified. Try uploading it again.",
    );
}
export async function signExeDownload(path: string, name: string) {
  const { client, bucket } = connection();
  const filename = name.replace(/[^a-zA-Z0-9._-]/g, "_");
  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key(path),
      ResponseContentType: "application/octet-stream",
      ResponseContentDisposition: `attachment; filename="${filename}"`,
    }),
    { expiresIn: 60 },
  );
}
export async function removeExeUpload(path: string) {
  const { client, bucket } = connection();
  await client.send(
    new DeleteObjectCommand({ Bucket: bucket, Key: key(path) }),
  );
}
