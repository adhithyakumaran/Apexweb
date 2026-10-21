"use client";
import { useId, useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FileCode2, FileText, GripVertical } from "lucide-react";
import type { HubFile } from "@/lib/development/data";
import { formatFileSize } from "@/lib/development/validation";
import { reorderFiles } from "@/lib/development/actions";
import { FileActions } from "./file-actions";

export function Files({
  files,
  kind,
  id,
  comments = false,
}: {
  files: HubFile[];
  kind: string;
  id: string;
  comments?: boolean;
}) {
  const group = files
    .filter((file) => file.parent_type === kind && file.parent_id === id)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const signature = group
    .map((file) => `${file.id}:${file.sort_order ?? 0}`)
    .join(",");
  const [override, setOverride] = useState<{
    signature: string;
    ids: string[];
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ error?: string; success?: string }>(
    {},
  );
  const ids =
    override?.signature === signature
      ? override.ids
      : group.map((file) => file.id);
  const ordered = ids
    .map((id) => group.find((file) => file.id === id))
    .filter((file): file is HubFile => !!file);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const contextId = useId();
  async function move(from: number, to: number) {
    if (saving || to < 0 || to >= ids.length || from === to) return;
    const next = arrayMove(ids, from, to);
    setOverride({ signature, ids: next });
    setSaving(true);
    setStatus({});
    try {
      const result = await reorderFiles({ kind, parentId: id, ids: next });
      if (result.error) setOverride(null);
      setStatus(result);
    } catch {
      setOverride(null);
      setStatus({
        error: "Could not confirm the order. Refresh and try again.",
      });
    } finally {
      setSaving(false);
    }
  }
  function dropped({ active, over }: DragEndEvent) {
    if (over && active.id !== over.id)
      void move(ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
  }
  return (
    <div className="hub-files">
      <DndContext
        id={contextId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={dropped}
        accessibility={{
          announcements: {
            onDragStart: ({ active }) =>
              `Picked up ${group.find((file) => file.id === active.id)?.name || "file"}.`,
            onDragOver: ({ over }) =>
              over
                ? `Position ${ids.indexOf(String(over.id)) + 1} of ${ids.length}.`
                : undefined,
            onDragEnd: ({ over }) =>
              over ? "File moved. Saving order." : "File order unchanged.",
            onDragCancel: () => "Reordering cancelled.",
          },
        }}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <ul className="hub-file-list">
            {ordered.map((file, index) => (
              <FileRow
                key={file.id}
                file={file}
                comments={comments}
                reorderable={ordered.length > 1}
                disabled={saving}
                moveUp={
                  !saving && index > 0
                    ? () => void move(index, index - 1)
                    : undefined
                }
                moveDown={
                  !saving && index < ordered.length - 1
                    ? () => void move(index, index + 1)
                    : undefined
                }
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      {(saving || status.error || status.success) && (
        <p
          className="hub-order-status"
          role={status.error ? "alert" : "status"}
        >
          {saving ? "Saving file order…" : status.error || status.success}
        </p>
      )}
    </div>
  );
}
function FileRow({
  file,
  comments,
  reorderable,
  disabled,
  moveUp,
  moveDown,
}: {
  file: HubFile;
  comments: boolean;
  reorderable: boolean;
  disabled: boolean;
  moveUp?: () => void;
  moveDown?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id, disabled: !reorderable || disabled });
  const extension = file.name.split(".").pop()?.toUpperCase() || "FILE";
  const installer = [
    "EXE",
    "MSI",
    "DMG",
    "APK",
    "AAB",
    "IPA",
    "APPIMAGE",
  ].includes(extension);
  const Icon = installer ? FileCode2 : FileText;
  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(
          transform ? { ...transform, x: 0 } : null,
        ),
        transition,
      }}
      className="hub-file-card"
      data-dragging={isDragging || undefined}
    >
      <div className="hub-file-row">
        {reorderable ? (
          <button
            type="button"
            ref={setActivatorNodeRef}
            className="hub-drag-handle"
            {...attributes}
            {...listeners}
            disabled={disabled}
            aria-label={`Drag to reorder ${file.name}`}
            title="Drag to reorder"
          >
            <GripVertical size={20} aria-hidden="true" />
          </button>
        ) : (
          <span className={`hub-file-icon ${installer ? "installer" : ""}`}>
            <Icon size={19} aria-hidden="true" />
          </span>
        )}
        <div className="hub-file-name">
          <strong>{file.name}</strong>
          <small>
            <span className="hub-file-type">{extension}</span>
            {formatFileSize(file.original_size ?? file.size)}
            {file.compression === "gzip" && file.original_size ? (
              <span className="hub-compression">
                {" "}
                · {((1 - file.size / file.original_size) * 100).toFixed(0)}%
                smaller
              </span>
            ) : null}
          </small>
          {file.comment && <p className="hub-file-comment">{file.comment}</p>}
        </div>
      </div>
      <FileActions
        id={file.id}
        name={file.name}
        preview={/pdf|markdown|image\/|text\/plain/.test(file.mime_type)}
        comment={file.comment}
        comments={comments}
        moveUp={moveUp}
        moveDown={moveDown}
      />
    </li>
  );
}
