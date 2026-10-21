"use client";
import { useActionState, useEffect, useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { saveRecord, type Result } from "@/lib/development/actions";
import { compressUpload } from "@/lib/development/compression";
import { createClient } from "@supabase/supabase-js";
import { useUploadConfiguration } from "./upload-provider";
import {
  validateAttachment,
  safeFilename,
  attachmentMime,
  formatFileSize,
} from "@/lib/development/validation";
import { useCloseActionPanel } from "./action-panel";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UploadCloud, FileText, X, LoaderCircle } from "lucide-react";
function Submit({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button className="hub-button" disabled={pending} type="submit">
      {pending ? (
        <>
          <LoaderCircle size={16} className="hub-spin" aria-hidden="true" />{" "}
          Saving…
        </>
      ) : (
        children
      )}
    </button>
  );
}
export function ActionForm({
  action = saveRecord,
  children,
  label = "Save",
  reset = true,
}: {
  action?: (state: Result, form: FormData) => Promise<Result>;
  children: ReactNode;
  label?: string;
  reset?: boolean;
}) {
  const config = useUploadConfiguration();
  const router = useRouter();
  const closePanel = useCloseActionPanel();
  const [state, dispatch] = useActionState(
    async (previous: Result, form: FormData): Promise<Result> => {
      const files = form
        .getAll("attachments")
        .filter(
          (value): value is File => value instanceof File && value.size > 0,
        );
      if (!files.length) return action(previous, form);
      if (!config) return { error: "Connect Supabase before uploading files." };
      try {
        files.forEach((file) =>
          validateAttachment(file, form.get("kind") === "builds"),
        );
      } catch (error) {
        return { error: (error as Error).message };
      }
      const storage = createClient(config.url, config.key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }).storage.from("development-files");
      const staged = [];
      let storedBytes = 0;
      for (const [index, file] of files.entries()) {
        const id = crypto.randomUUID();
        const path = `shared/${id}/${safeFilename(file.name)}`;
        const prepared = await compressUpload(
          file,
          form.get("compress_uploads") === "on",
        );
        const { error } = await storage.upload(path, prepared.blob, {
          contentType:
            prepared.compression === "gzip"
              ? "application/gzip"
              : attachmentMime(file.name),
          upsert: false,
        });
        if (error) {
          if (staged.length) await storage.remove(staged.map((f) => f.path));
          return {
            error:
              "Upload failed. Check the Supabase Storage setup and connection, then retry.",
          };
        }
        storedBytes += prepared.blob.size;
        staged.push({
          id,
          path,
          name: file.name,
          size: prepared.blob.size,
          compression: prepared.compression,
          original_size: file.size,
          comment: String(form.get(`file_comment_${index}`) || ""),
        });
      }
      // Only metadata traverses Vercel; bundle bytes go directly to Supabase.
      form.delete("attachments");
      form.set("staged_files", JSON.stringify(staged));
      try {
        const result = await action(previous, form);
        if (result.error && !result.keepFiles)
          await storage.remove(staged.map((f) => f.path));
        if (result.success) {
          const saved = files.reduce((sum, f) => sum + f.size, 0) - storedBytes;
          if (saved > 0)
            result.success += ` Lossless compression saved ${(saved / 1024).toFixed(1)} KB.`;
        }
        return result;
      } catch {
        return {
          error:
            "Could not confirm the save. Check the list before retrying; your upload may already be saved.",
        };
      }
    },
    {},
  );
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.success && reset) ref.current?.reset();
    if (state.success && state.redirectTo) router.push(state.redirectTo);
    if (state.success) closePanel?.();
  }, [state, reset, router, closePanel]);
  return (
    <form action={dispatch} ref={ref} className="hub-form">
      {children}
      <div>
        <Submit>{label}</Submit>
      </div>
      {state.error && (
        <p role="alert" className="hub-message">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="hub-message">
          ✓ {state.success}
        </p>
      )}
    </form>
  );
}
export function Input({
  label,
  name,
  type = "text",
  required = true,
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <label className="hub-field">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        maxLength={160}
        {...rest}
      />
    </label>
  );
}
export function Textarea({
  label,
  name,
  required = true,
  defaultValue,
}: {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="hub-field">
      {label}
      <textarea
        name={name}
        rows={4}
        required={required}
        maxLength={20000}
        defaultValue={defaultValue}
      />
    </label>
  );
}
export function Upload({
  build = false,
  required = false,
  multiple = true,
}: {
  build?: boolean;
  required?: boolean;
  multiple?: boolean;
}) {
  const [selected, setSelected] = useState<File[]>([]);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const form = input.current?.form;
    const reset = () => setSelected([]);
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, []);
  function remove(index: number) {
    const remaining = selected.filter((_, i) => i !== index);
    const transfer = new DataTransfer();
    remaining.forEach((file) => transfer.items.add(file));
    if (input.current) input.current.files = transfer.files;
    setSelected(remaining);
  }
  return (
    <div className="hub-upload-field">
      <label className="hub-upload-zone">
        <span className="hub-upload-icon">
          <UploadCloud size={22} aria-hidden="true" />
        </span>
        <strong>{multiple ? "Choose files" : "Choose a file"}</strong>
        <span>
          {build
            ? "EXE, installers, ZIP, Markdown, PDF, text & checksums"
            : "PDF or Markdown"}{" "}
          · 50 MB per file
        </span>
        <input
          ref={input}
          type="file"
          name="attachments"
          multiple={multiple}
          required={required}
          accept={
            build
              ? ".exe,.msi,.zip,.apk,.aab,.ipa,.dmg,.tar,.gz,.appimage,.pdf,.md,.markdown,.txt,.sha256,.sha256sum,.png,.jpg,.jpeg,.webp"
              : ".pdf,.md,.markdown"
          }
          onChange={(event) =>
            setSelected(Array.from(event.target.files || []))
          }
        />
      </label>
      {selected.length > 0 && (
        <ul className="hub-selected-files">
          {selected.map((file, index) => (
            <li key={`${file.name}-${index}`}>
              <div>
                <FileText size={16} aria-hidden="true" />
                <span>
                  {file.name}
                  <small>{formatFileSize(file.size)}</small>
                </span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={16} />
                </button>
              </div>
              {build && (
                <label className="hub-field">
                  <span className="hub-sr-only">Comment for {file.name}</span>
                  <input
                    name={`file_comment_${index}`}
                    placeholder="Add a comment (optional)"
                    maxLength={2000}
                  />
                </label>
              )}
            </li>
          ))}
        </ul>
      )}
      <label className="hub-check">
        <input type="checkbox" name="compress_uploads" defaultChecked />{" "}
        Lossless compression{" "}
        <span className="hub-muted">· original quality</span>
      </label>
    </div>
  );
}
