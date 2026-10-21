import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireWorkspace } from "@/lib/development/supabase";
import { FilePreview } from "@/components/development/file-preview";
export default async function ViewFile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { db } = await requireWorkspace();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const { data: file } = await db
    .from("files")
    .select("name,mime_type,parent_type")
    .eq("id", id)
    .maybeSingle();
  if (
    !file ||
    ![
      "text/markdown",
      "text/plain",
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp",
    ].includes(file.mime_type)
  )
    notFound();
  const back =
    file.parent_type === "weekly_updates"
      ? "progress"
      : file.parent_type === "testing_reports"
        ? "reports"
        : "";
  return (
    <div className="hub-stack">
      <Link
        className="hub-text-link"
        href={`/development#${back || "releases"}`}
      >
        ← Back to {back || "releases"}
      </Link>
      <article className="hub-card">
        <h1>{file.name}</h1>
        <FilePreview key={id} id={id} name={file.name} mime={file.mime_type} />
      </article>
    </div>
  );
}
