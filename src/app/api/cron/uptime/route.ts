import { NextResponse } from "next/server";
import { dispatchAlert } from "@/lib/alerts/dispatch";
import { getAlertSettings } from "@/lib/alerts/settings";
import { sendWeeklyDigest } from "@/lib/alerts/digest";
import {
  getUptimeStats,
  listUptimeChecksWithLatest,
  runAllUptimeChecks,
} from "@/lib/uptime/checks";
import { getSiteBaseUrl } from "@/lib/site-url";

function authorizeCron(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await runAllUptimeChecks();
  const [checks, stats] = await Promise.all([listUptimeChecksWithLatest(), getUptimeStats()]);
  const settings = await getAlertSettings();

  const failures = checks.filter((c) => c.latest && !c.latest.ok);
  if (settings.alertOnUptimeFailure && failures.length > 0) {
    await dispatchAlert({
      title: `Uptime alert — ${failures.length} down`,
      message: failures.map((c) => `${c.name}: ${c.latest?.error ?? "failed"}`).join("\n"),
      severity: "critical",
      link: `${getSiteBaseUrl()}/admin/uptime`,
    });
  }

  return NextResponse.json({
    ok: true,
    ran: results.length,
    up: stats.upNow,
    down: stats.downNow,
  });
}
