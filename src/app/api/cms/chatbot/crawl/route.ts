import { NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cms/api-auth";
import { triggerChatbotCrawl } from "@/lib/cms/chatbot";

export async function POST() {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  const result = await triggerChatbotCrawl();
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
