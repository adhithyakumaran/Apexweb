import { NextResponse } from "next/server";
import { getChatbotSettings } from "@/lib/cms/chatbot";
import { chatWithGroq, isGroqConfigured, parseHumanHandoff } from "@/lib/chatbot/groq";
import { buildChatKnowledgeContext, CHAT_SYSTEM_RULES } from "@/lib/chatbot/knowledge";

export const dynamic = "force-dynamic";

type ChatRequest = {
  messages?: { role: "user" | "assistant"; content: string }[];
};

export async function POST(request: Request) {
  if (!isGroqConfigured()) {
    return NextResponse.json(
      { error: "Chat is not configured yet. Please try again later." },
      { status: 503 }
    );
  }

  const settings = await getChatbotSettings();
  if (!settings.enabled) {
    return NextResponse.json({ error: "Chat is currently disabled." }, { status: 503 });
  }

  const body = (await request.json()) as ChatRequest;
  const history = body.messages?.filter((m) => m.content?.trim()).slice(-10) ?? [];

  if (!history.length || history[history.length - 1]?.role !== "user") {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  try {
    const knowledge = await buildChatKnowledgeContext();
    const toneLine = `Tone: ${settings.tone}. Skills: ${settings.skills.join(", ") || "general assistance"}.`;

    const system = `${CHAT_SYSTEM_RULES}\n\n${toneLine}\n\n${settings.systemPrompt}\n\n--- KNOWLEDGE BASE ---\n${knowledge}`;

    const reply = await chatWithGroq({
      model: settings.model,
      messages: [{ role: "system", content: system }, ...history],
    });

    const { text, needsHuman } = parseHumanHandoff(reply);

    return NextResponse.json({
      message: text,
      needsHuman,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Chat failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
