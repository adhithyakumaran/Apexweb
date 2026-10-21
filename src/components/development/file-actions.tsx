"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Eye,
  MessageSquare,
  X,
  MoreVertical,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { FileDownload } from "./file-download";
import { ActionForm, Textarea, Input } from "./forms";
import {
  saveFileComment,
  renameFile,
  deleteFile,
} from "@/lib/development/actions";
function positionMenu(details: HTMLDetailsElement | null) {
  const panel = details?.querySelector<HTMLElement>(".hub-file-menu-items");
  if (!details?.open || !panel) return;
  panel.style.transform = "";
  const bounds = panel.getBoundingClientRect();
  const shift =
    bounds.left < 8
      ? 8 - bounds.left
      : bounds.right > window.innerWidth - 8
        ? window.innerWidth - 8 - bounds.right
        : 0;
  panel.style.transform = `translateX(${shift}px)`;
}
export function FileActions({
  id,
  name,
  preview,
  comment,
  comments,
  moveUp,
  moveDown,
}: {
  id: string;
  name: string;
  preview: boolean;
  comment: string;
  comments: boolean;
  moveUp?: () => void;
  moveDown?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<"rename" | "delete" | null>(null);
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !menu.current?.contains(event.target) &&
        menu.current
      )
        menu.current.open = false;
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape" && menu.current?.open) {
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    }
    const resize = () => positionMenu(menu.current);
    window.addEventListener("resize", resize);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  function edit(value: "rename" | "delete") {
    if (menu.current) menu.current.open = false;
    setOpen(false);
    setEditing(value);
  }
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
        <details
          className="hub-file-menu"
          ref={menu}
          onToggle={() => positionMenu(menu.current)}
        >
          <summary
            className="hub-comment-toggle"
            aria-label={`More actions for ${name}`}
            title="More actions"
          >
            <MoreVertical size={16} aria-hidden="true" />
          </summary>
          <div className="hub-file-menu-items">
            {moveUp && (
              <button
                type="button"
                onClick={() => {
                  if (menu.current) menu.current.open = false;
                  moveUp();
                }}
              >
                <ArrowUp size={14} aria-hidden="true" />
                Move up
              </button>
            )}
            {moveDown && (
              <button
                type="button"
                onClick={() => {
                  if (menu.current) menu.current.open = false;
                  moveDown();
                }}
              >
                <ArrowDown size={14} aria-hidden="true" />
                Move down
              </button>
            )}
            {comments && (
              <button
                type="button"
                aria-label={`${comment ? "Edit" : "Add"} comment for ${name}`}
                onClick={() => {
                  if (menu.current) menu.current.open = false;
                  setEditing(null);
                  setOpen(!open);
                }}
              >
                <MessageSquare size={14} aria-hidden="true" />{" "}
                {comment ? "Edit comment" : "Add comment"}
              </button>
            )}
            <button type="button" onClick={() => edit("rename")}>
              <Pencil size={14} aria-hidden="true" /> Rename file
            </button>
            <button type="button" onClick={() => edit("delete")}>
              <Trash2 size={14} aria-hidden="true" /> Delete file
            </button>
          </div>
        </details>
      </div>
      {editing && (
        <div
          className="hub-comment-form hub-file-editor"
          key={`${editing}-${name}`}
        >
          <div className="hub-file-editor-heading">
            <strong>
              {editing === "rename" ? "Rename file" : "Delete file?"}
            </strong>
            <button
              type="button"
              className="hub-comment-toggle"
              onClick={() => setEditing(null)}
              aria-label="Cancel file action"
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>
          <ActionForm
            action={async (state, form) => {
              const result = await (
                editing === "rename" ? renameFile : deleteFile
              )(state, form);
              if (result.success) setEditing(null);
              return result;
            }}
            label={editing === "rename" ? "Save name" : "Delete permanently"}
            reset={false}
          >
            <input type="hidden" name="id" value={id} />
            {editing === "rename" ? (
              <Input
                name="name"
                label="File name"
                defaultValue={name}
                maxLength={255}
              />
            ) : (
              <p className="hub-delete-confirm">
                Remove <strong>{name}</strong> and its uploaded file
                permanently? This cannot be undone.
              </p>
            )}
          </ActionForm>
        </div>
      )}
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
