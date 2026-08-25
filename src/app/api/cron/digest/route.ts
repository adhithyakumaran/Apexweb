/**
 * Weekly digest cron — GET /api/cron/digest
 *
 * Triggered by Vercel cron (Mondays 09:00 UTC). Requires
 * Authorization: Bearer $CRON_SECRET. Skips when digest is disabled in CMS.
 */
import { NextResponse } from "next/server";
import { sendWeeklyDigest } from "@/lib/alerts/digest";
import { getAlertSettings } from "@/lib/alerts/settings";

function authorizeCron(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getAlertSettings();
  if (!settings.digestEnabled) {
    return NextResponse.json({ skipped: true, reason: "Digest disabled" });
  }

  const result = await sendWeeklyDigest();
  return NextResponse.json({ ok: true, result });
}
