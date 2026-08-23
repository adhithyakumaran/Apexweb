import { NextResponse } from "next/server";
import { dispatchAlert } from "@/lib/alerts/dispatch";
import { getAlertSettings } from "@/lib/alerts/settings";
import {
  getUptimeStats,
  listUptimeChecksWithLatest,
  runAllUptimeChecks,
} from "@/lib/uptime/checks";
import { getSiteBaseUrl } from "@/lib/site-url";
import { requireCmsAuth } from "@/lib/cms/api-auth";

export async function POST() {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  const results = await runAllUptimeChecks();
  const [checks, stats] = await Promise.all([listUptimeChecksWithLatest(), getUptimeStats()]);

  const failures = checks.filter((c) => c.latest && !c.latest.ok);
  const settings = await getAlertSettings();

  if (settings.alertOnUptimeFailure && failures.length > 0) {
    await dispatchAlert({
      title: `${failures.length} endpoint(s) down`,
      message: failures
        .map((c) => `• ${c.name} (${c.url}): ${c.latest?.error ?? "failed"}`)
        .join("\n"),
      severity: "critical",
      link: `${getSiteBaseUrl()}/admin/uptime`,
    });
  }

  return NextResponse.json({ results, checks, stats });
}
