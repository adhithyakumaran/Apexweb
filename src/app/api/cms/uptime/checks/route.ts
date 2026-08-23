import { NextResponse } from "next/server";
import {
  getUptimeStats,
  listUptimeChecksWithLatest,
  saveUptimeCheck,
} from "@/lib/uptime/checks";
import { requireCmsAuth } from "@/lib/cms/api-auth";

export async function GET() {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  const [checks, stats] = await Promise.all([listUptimeChecksWithLatest(), getUptimeStats()]);
  return NextResponse.json({ checks, stats });
}

export async function POST(request: Request) {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const check = await saveUptimeCheck(body);
    return NextResponse.json({ check });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create check";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
