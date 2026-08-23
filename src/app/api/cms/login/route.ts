import { NextResponse } from "next/server";
import { logCmsActivity } from "@/lib/cms/activity-log";
import { createCmsSession, getAdminPassword } from "@/lib/cms/auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = body?.password ?? "";

  if (!password || password !== getAdminPassword()) {
    await logCmsActivity({
      action: "auth.login",
      level: "warning",
      message: "Failed sign-in attempt",
    });
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  await createCmsSession();
  await logCmsActivity({
    action: "auth.login",
    level: "success",
    message: "Signed in to Content Studio",
  });
  return NextResponse.json({ ok: true });
}
