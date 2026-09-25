import { NextResponse } from "next/server";
import {
  getPipelineLogs,
  pipelineLogsToCsv,
  pipelineLogsToPrintHtml,
  type PipelineLogsPeriod,
} from "@/lib/monitoring/pipeline-logs";
import { requireCmsAuth } from "@/lib/cms/api-auth";

export async function GET(request: Request) {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const period: PipelineLogsPeriod = searchParams.get("period") === "day" ? "day" : "week";
  const format = searchParams.get("format") ?? "csv";

  const data = await getPipelineLogs(period);
  const stamp = new Date().toISOString().slice(0, 10);

  if (format === "html" || format === "pdf") {
    const html = pipelineLogsToPrintHtml(data);
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="pipeline-logs-${period}-${stamp}.html"`,
      },
    });
  }

  const csv = pipelineLogsToCsv(data);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pipeline-logs-${period}-${stamp}.csv"`,
    },
  });
}
