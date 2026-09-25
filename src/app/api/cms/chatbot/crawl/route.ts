import { NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cms/api-auth";
import { triggerChatbotCrawl } from "@/lib/cms/chatbot";

export async function POST(request: Request) {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  let crawlBaseUrl: string | undefined;
  try {
    const body = (await request.json()) as { crawlBaseUrl?: string };
    crawlBaseUrl = body.crawlBaseUrl?.trim();
  } catch {
    crawlBaseUrl = undefined;
  }

  const result = await triggerChatbotCrawl(crawlBaseUrl);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
