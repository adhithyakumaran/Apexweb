"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, MessageSquare, X } from "lucide-react";
import { FileDownload } from "./file-download";
import { ActionForm, Textarea } from "./forms";
import { saveFileComment } from "@/lib/development/actions";
export function FileActions({
  id,
  name,
  preview,
  comment,
  comments,
}: {
  id: string;
  name: string;
  preview: boolean;
  comment: string;
  comments: boolean;
}) {
  const [open, setOpen] = useState(false);
  const editor = `comment-${id}`;
  return (
    <>
      <div className="hub-file-actions">
        {preview && (
          <Link
            className="hub-view"
            href={`/development/files/${id}/view`}
            aria-label={`View ${name}`}
          >
            <Eye size={15} aria-hidden="true" />
            <span>View</span>
          </Link>
        )}
        <FileDownload id={id} name={name} />
        {comments && (
          <button
            type="button"
            className="hub-comment-toggle"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls={editor}
            aria-label={`${comment ? "Edit" : "Add"} comment for ${name}`}
            title={comment ? "Edit comment" : "Add comment"}
          >
            {open ? (
              <X size={15} aria-hidden="true" />
            ) : (
              <MessageSquare size={15} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      {open && (
        <div className="hub-comment-form" id={editor}>
          <ActionForm
            action={saveFileComment}
            label="Save comment"
            reset={false}
          >
            <input type="hidden" name="id" value={id} />
            <Textarea
              name="comment"
              label={`Comment for ${name}`}
              defaultValue={comment}
              required={false}
            />
          </ActionForm>
        </div>
      )}
    </>
  );
}
