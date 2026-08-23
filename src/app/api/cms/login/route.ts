import { NextResponse } from "next/server";
import { createCmsSession, getAdminPassword } from "@/lib/cms/auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = body?.password ?? "";

  if (!password || password !== getAdminPassword()) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  await createCmsSession();
  return NextResponse.json({ ok: true });
}
