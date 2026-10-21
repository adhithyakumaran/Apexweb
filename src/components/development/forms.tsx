"use client";
import { useActionState, useEffect, useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import {
  saveRecord,
  changeTask,
  publishRecord,
  type Result,
} from "@/lib/development/actions";
import { compressUpload } from "@/lib/development/compression";
import { createClient } from "@supabase/supabase-js";
import { useUploadConfiguration } from "./upload-provider";
import {
  MAX_FILE_SIZE,
  validateAttachment,
  safeFilename,
  attachmentMime,
} from "@/lib/development/validation";
import { taskStates } from "@/lib/development/validation";
function Submit({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button className="hub-button" disabled={pending} type="submit">
      {pending ? "Saving…" : children}
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
  const [state, dispatch] = useActionState(
    async (previous: Result, form: FormData): Promise<Result> => {
      const files = form
        .getAll("attachments")
        .filter(
          (value): value is File => value instanceof File && value.size > 0,
        );
      if (!files.length) return action(previous, form);
      if (!config) return { error: "Connect Supabase before uploading files." };
      if (
        files.length > 5 ||
        files.reduce((sum, f) => sum + f.size, 0) > MAX_FILE_SIZE
      )
        return { error: "Choose up to five files totalling 25 MB or less." };
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
      for (const file of files) {
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
  }, [state, reset]);
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
  documents = false,
}: {
  build?: boolean;
  required?: boolean;
  documents?: boolean;
}) {
  return (
    <>
      <label className="hub-field">
        {build ? "Build bundle" : "Attachments"}
        <input
          type="file"
          name="attachments"
          multiple
          required={required}
          accept={
            build
              ? ".zip,.apk,.aab,.ipa,.exe,.msi,.dmg,.tar,.gz,.appimage"
              : documents
                ? ".pdf,.md,.markdown"
                : ".pdf,.md,.markdown,.png,.jpg,.jpeg,.webp"
          }
        />
        <span className="hub-muted">
          Up to 5 files · 25 MB total
          {!build &&
            (documents
              ? " · PDF or Markdown"
              : " · PDF, Markdown, or screenshots")}
        </span>
      </label>
      <label className="hub-check">
        <input type="checkbox" name="compress_uploads" defaultChecked />{" "}
        Lossless compression
      </label>
      <p className="hub-muted">
        Saves space when possible. Downloads restore the exact original file;
        already-compressed files may stay the same size.
      </p>
    </>
  );
}
export function PublishCheckbox() {
  return (
    <label className="hub-check">
      <input type="checkbox" name="published" defaultChecked /> Publish to the
      workspace now
    </label>
  );
}
export function PublishButton({ kind, id }: { kind: string; id: string }) {
  return (
    <ActionForm action={publishRecord} label="Publish">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
    </ActionForm>
  );
}
export function StatusForm({ id, status }: { id: string; status: string }) {
  return (
    <ActionForm action={changeTask} label="Update status" reset={false}>
      <input type="hidden" name="id" value={id} />
      <label className="hub-field">
        Status
        <select name="status" defaultValue={status}>
          {taskStates.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
    </ActionForm>
  );
}
