import { NextResponse } from "next/server";
import { getChatbotSettings } from "@/lib/cms/chatbot";
import { isGroqConfigured } from "@/lib/chatbot/groq";
import { getChatSuggestions } from "@/lib/chatbot/knowledge";

export async function GET() {
  const settings = await getChatbotSettings();
  const available = isGroqConfigured() && settings.enabled;

  return NextResponse.json({
    enabled: available,
    welcomeMessage: settings.welcomeMessage,
    suggestions: getChatSuggestions(),
    tone: settings.tone,
  });
}
