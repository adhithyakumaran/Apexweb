import { NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cms/api-auth";
import { deleteChatbotMemory } from "@/lib/cms/chatbot";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  const { id } = await context.params;
  const memoryId = Number(id);
  if (!Number.isFinite(memoryId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const deleted = await deleteChatbotMemory(memoryId);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
