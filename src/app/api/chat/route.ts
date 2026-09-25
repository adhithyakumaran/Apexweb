/**
 * Public chat API — POST /api/chat
 *
 * Accepts up to 10 recent messages, builds a knowledge context from CMS
 * settings + memory + published articles, and returns a short Groq reply.
 * Returns 503 when GROQ_API_KEY is missing or chatbot is disabled in CMS.
 */
import { NextResponse } from "next/server";
import { getChatbotSettings } from "@/lib/cms/chatbot";
import { chatWithGroq, isGroqConfigured, parseHumanHandoff } from "@/lib/chatbot/groq";
import { ANSWER_ENGINE_RULES, buildAnswerEnvelope } from "@/lib/chatbot/answer-envelope";
import { buildChatKnowledgeContext, CHAT_SYSTEM_RULES, getToneInstruction } from "@/lib/chatbot/knowledge";

export const dynamic = "force-dynamic";

type ChatRequest = {
  messages?: { role: "user" | "assistant"; content: string }[];
  structured?: boolean;
  pageContext?: { pathname?: string };
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
  const structured = body.structured === true;
  const pagePath = body.pageContext?.pathname?.trim() || "/";
  const history = body.messages?.filter((m) => m.content?.trim()).slice(-10) ?? [];

  if (!history.length || history[history.length - 1]?.role !== "user") {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  try {
    const knowledge = await buildChatKnowledgeContext();
    const toneLine = `${getToneInstruction(settings.tone)} Skills: ${settings.skills.join(", ") || "general assistance"}.`;

    const pageLine = structured ? `\n\nCURRENT PAGE: ${pagePath}` : "";
    const rules = structured ? ANSWER_ENGINE_RULES : CHAT_SYSTEM_RULES;
    const system = `${rules}\n\n${toneLine}\n\n${settings.systemPrompt}${pageLine}\n\n--- KNOWLEDGE BASE ---\n${knowledge}`;

    const reply = await chatWithGroq({
      model: settings.model,
      messages: [{ role: "system", content: system }, ...history],
      maxTokens: structured ? 520 : 220,
    });

    const { text, needsHuman } = parseHumanHandoff(reply);

    if (structured) {
      const userQuestion = history[history.length - 1]?.content ?? "";
      const envelope = buildAnswerEnvelope(userQuestion, pagePath, text);
      return NextResponse.json({
        message: text,
        needsHuman,
        relatedQuestions: envelope.relatedQuestions,
        ctas: envelope.ctas,
        sources: envelope.sources,
      });
    }

    return NextResponse.json({
      message: text,
      needsHuman,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Chat failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
