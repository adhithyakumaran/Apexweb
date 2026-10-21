import { getAccess } from "@/lib/development/supabase";
import { z } from "zod";
import { NextResponse } from "next/server";
const headers = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
};
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await getAccess();
  if (access.state !== "ready")
    return new Response("The workspace is not configured.", {
      status: 503,
      headers,
    });
  const { id } = await params;
  if (!z.uuid().safeParse(id).success)
    return new Response("File not found.", { status: 404, headers });
  const { data: file, error } = await access.db
    .from("files")
    .select("path,name,mime_type,compression,original_size,size")
    .eq("id", id)
    .maybeSingle();
  if (error || !file)
    return new Response("File not found or access denied.", {
      status: 404,
      headers,
    });
  const query = new URL(request.url).searchParams;
  const view = query.get("view") === "1";
  if (view)
    return NextResponse.redirect(
      new URL(`/development/files/${id}/view`, request.url),
      { status: 302, headers },
    );
  const name = file.compression === "gzip" ? `${file.name}.gz` : file.name;
  const { data, error: signError } = await access.db.storage
    .from("development-files")
    .createSignedUrl(
      file.path,
      60,
      query.get("link") === "1" ? undefined : { download: name },
    );
  if (signError || !data)
    return new Response("File unavailable. Please try again.", {
      status: 503,
      headers,
    });
  if (query.get("link") === "1")
    return NextResponse.json(
      {
        url: data.signedUrl,
        name: file.name,
        mime_type: file.mime_type,
        compression: file.compression,
        original_size: file.original_size ?? file.size,
      },
      { headers },
    );
  return NextResponse.redirect(data.signedUrl, { status: 302, headers });
}
