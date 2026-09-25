import { NextResponse } from "next/server";
import {
  analyticsToCsv,
  analyticsToPrintHtml,
  getVisitorAnalytics,
  type AnalyticsPeriod,
} from "@/lib/analytics/posthog-query";
import { requireCmsAuth } from "@/lib/cms/api-auth";

export async function GET(request: Request) {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const period: AnalyticsPeriod = searchParams.get("period") === "month" ? "month" : "week";
  const format = searchParams.get("format") ?? "csv";

  const data = await getVisitorAnalytics(period);
  const stamp = new Date().toISOString().slice(0, 10);

  if (format === "html" || format === "pdf") {
    const html = analyticsToPrintHtml(data);
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="analytics-${period}-${stamp}.html"`,
      },
    });
  }

  const csv = analyticsToCsv(data);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="analytics-${period}-${stamp}.csv"`,
    },
  });
}
