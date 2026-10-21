"use client";
import { useState } from "react";
import { ArrowDownToLine } from "lucide-react";
import { restoreUpload, type Compression } from "@/lib/development/compression";
type FileLink = {
  url: string;
  name: string;
  mime_type: string;
  compression: Compression;
  original_size: number;
};
export async function loadOriginalFile(id: string, signal?: AbortSignal) {
  const response = await fetch(`/development/files/${id}?link=1`, {
    cache: "no-store",
    signal,
  });
  if (!response.ok)
    throw new Error("Could not get a download link. Please try again.");
  const info = (await response.json()) as FileLink;
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
      const { info, blob } = await loadOriginalFile(id);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = info.name;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
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
