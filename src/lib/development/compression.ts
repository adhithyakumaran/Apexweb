import { MAX_FILE_SIZE } from "./validation";
export type Compression = "none" | "gzip";
export async function compressUpload(
  file: File,
  enabled = true,
): Promise<{ blob: Blob; compression: Compression; originalSize: number }> {
  const original = {
    blob: file as Blob,
    compression: "none" as const,
    originalSize: file.size,
  };
  if (
    !enabled ||
    file.size < 1024 ||
    typeof CompressionStream === "undefined" ||
    typeof DecompressionStream === "undefined"
  )
    return original;
  try {
    const compressed = await new Response(
      file.stream().pipeThrough(new CompressionStream("gzip")),
    ).blob();
    // Keep original formats unless compression saves at least 1 KiB and 2%.
    if (
      file.size - compressed.size < 1024 ||
      compressed.size > file.size * 0.98
    )
      return original;
    return { blob: compressed, compression: "gzip", originalSize: file.size };
  } catch {
    return original;
  }
}
export async function restoreUpload(
  blob: Blob,
  compression: Compression,
  originalSize: number,
): Promise<Blob> {
  if (originalSize <= 0 || originalSize > MAX_FILE_SIZE)
    throw new Error("Invalid original file size.");
  if (compression === "none") {
    if (blob.size !== originalSize)
      throw new Error("File size does not match its metadata.");
    return blob;
  }
  if (typeof DecompressionStream === "undefined")
    throw new Error(
      "This browser cannot restore compressed files. Download the .gz archive instead.",
    );
  const reader = blob
    .stream()
    .pipeThrough(new DecompressionStream("gzip"))
    .getReader();
  const chunks: BlobPart[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > originalSize || size > MAX_FILE_SIZE)
        throw new Error("Restored file exceeds its expected size.");
      chunks.push(new Uint8Array(value));
    }
    if (size !== originalSize)
      throw new Error("Restored file size does not match its metadata.");
    return new Blob(chunks);
  } finally {
    await reader.cancel().catch(() => {});
  }
}
