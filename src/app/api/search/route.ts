import { NextResponse } from "next/server";
import { searchSiteAsync } from "@/lib/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const limit = Number(searchParams.get("limit") ?? "12");

  const results = await searchSiteAsync(q, Number.isFinite(limit) ? limit : 12);
  return NextResponse.json({ results });
}
