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
  const now = new Date();
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;
  const today = dayNames[now.getUTCDay()];
  const hour = now.getUTCHours();

  if (!settings.digestEnabled) {
    return NextResponse.json({ skipped: true, reason: "Digest disabled" });
  }

  if (today !== settings.digestDay || hour !== settings.digestHourUtc) {
    return NextResponse.json({
      skipped: true,
      reason: `Scheduled for ${settings.digestDay} ${settings.digestHourUtc}:00 UTC`,
    });
  }

  const result = await sendWeeklyDigest();
  return NextResponse.json({ ok: true, result });
}
