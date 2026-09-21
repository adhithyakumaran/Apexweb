import { NextResponse } from "next/server";
import { z } from "zod";
import { answerQuestion } from "@/lib/ai/answer-engine";

const bodySchema = z.object({
  question: z.string().min(1).max(2000),
  conversationId: z.string().uuid().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional(),
  pageContext: z
    .object({
      pathname: z.string(),
      title: z.string().optional(),
      section: z.string().optional(),
    })
    .optional(),
  regenerate: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await answerQuestion(parsed.data);
    return NextResponse.json(result);
  } catch (e) {
    console.error("[api/ai/ask]", e);
    return NextResponse.json(
      { error: "Failed to generate answer" },
      { status: 500 }
    );
  }
}
