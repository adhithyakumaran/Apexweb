"use client";
import { useState } from "react";
import { ArrowDownToLine } from "lucide-react";
import { restoreUpload, type Compression } from "@/lib/development/compression";
type FileLink = {
  storage_provider?: "supabase" | "r2";
  url: string;
  name: string;
  mime_type: string;
  compression: Compression;
  original_size: number;
};
async function getFileLink(
  id: string,
  signal?: AbortSignal,
): Promise<FileLink> {
  const response = await fetch(`/development/files/${id}?link=1`, {
    cache: "no-store",
    signal,
  });
  if (!response.ok)
    throw new Error("Could not get a download link. Please try again.");
  return response.json();
}
export async function loadOriginalFile(
  id: string,
  signal?: AbortSignal,
  existingInfo?: FileLink,
) {
  const info = existingInfo || (await getFileLink(id, signal));
  const download = await fetch(info.url, { signal });
  if (!download.ok)
    throw new Error("Could not download the file. Please try again.");
  const restored = await restoreUpload(
    await download.blob(),
    info.compression,
    info.original_size,
  );
  return { info, blob: new Blob([restored], { type: info.mime_type }) };
}
export function FileDownload({ id, name }: { id: string; name: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function download() {
    setPending(true);
    setError("");
    try {
      const info = await getFileLink(id);
      // Let the browser stream large installers directly from R2 to disk.
      const url =
        info.storage_provider === "r2"
          ? info.url
          : URL.createObjectURL(
              (await loadOriginalFile(id, undefined, info)).blob,
            );
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = info.name;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      if (info.storage_provider !== "r2")
        setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Download failed.");
    } finally {
      setPending(false);
    }
  }
  return (
    <>
      <button
        type="button"
        className="hub-download"
        disabled={pending}
        onClick={download}
        aria-label={`Download ${name}`}
      >
        <ArrowDownToLine size={16} aria-hidden="true" />
        <span>{pending ? "Preparing…" : "Download"}</span>
      </button>
      {error && (
        <p role="alert" className="hub-muted">
          {error} <a href={`/development/files/${id}`}>Download stored file</a>
        </p>
      )}
    </>
  );
}
