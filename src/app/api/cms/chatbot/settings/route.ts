import { NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cms/api-auth";
import { getChatbotSettings, updateChatbotSettings } from "@/lib/cms/chatbot";

export async function GET() {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  const settings = await getChatbotSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  const body = (await request.json()) as Record<string, unknown>;
  const settings = await updateChatbotSettings({
    provider: typeof body.provider === "string" ? body.provider : undefined,
    model: typeof body.model === "string" ? body.model : undefined,
    systemPrompt: typeof body.systemPrompt === "string" ? body.systemPrompt : undefined,
    tone: typeof body.tone === "string" ? (body.tone as never) : undefined,
    skills: Array.isArray(body.skills) ? body.skills.map(String) : undefined,
    crawlEnabled: typeof body.crawlEnabled === "boolean" ? body.crawlEnabled : undefined,
    crawlBaseUrl: typeof body.crawlBaseUrl === "string" ? body.crawlBaseUrl : undefined,
    enabled: typeof body.enabled === "boolean" ? body.enabled : undefined,
    welcomeMessage: typeof body.welcomeMessage === "string" ? body.welcomeMessage : undefined,
  });

  return NextResponse.json({ settings });
}
