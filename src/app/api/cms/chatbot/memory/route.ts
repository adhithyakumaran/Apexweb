import { NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cms/api-auth";
import { addChatbotMemory, listChatbotMemory } from "@/lib/cms/chatbot";
import type { ChatbotMemoryType } from "@/lib/cms/chatbot-shared";

export async function GET() {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  const memory = await listChatbotMemory();
  return NextResponse.json({ memory });
}

export async function POST(request: Request) {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  const body = (await request.json()) as {
    name?: string;
    type?: ChatbotMemoryType;
    content?: string;
    fileUrl?: string;
    sourceUrl?: string;
  };

  if (!body.name?.trim() || !body.type) {
    return NextResponse.json({ error: "Name and type are required" }, { status: 400 });
  }

  const item = await addChatbotMemory({
    name: body.name.trim(),
    type: body.type,
    content: body.content,
    fileUrl: body.fileUrl,
    sourceUrl: body.sourceUrl,
  });

  return NextResponse.json({ item });
}
