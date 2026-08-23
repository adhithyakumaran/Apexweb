import { NextResponse } from "next/server";
import { logCmsActivity } from "@/lib/cms/activity-log";
import { clearCmsSession } from "@/lib/cms/auth";

export async function POST() {
  await logCmsActivity({
    action: "auth.logout",
    level: "info",
    message: "Signed out of Content Studio",
  });
  await clearCmsSession();
  return NextResponse.json({ ok: true });
}
