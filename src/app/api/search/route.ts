import { NextResponse } from "next/server";
import { searchSite, searchSiteAsync } from "@/lib/search";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const limit = Number(searchParams.get("limit") ?? "12");

  try {
    const results = await searchSiteAsync(q, Number.isFinite(limit) ? limit : 12);
    return NextResponse.json(
      { results },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("[search] API error:", error);
    const results = searchSite(q, Number.isFinite(limit) ? limit : 12);
    return NextResponse.json({ results });
  }
}
