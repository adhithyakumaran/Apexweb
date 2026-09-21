import type { AskAiRequest, AskAiResponse } from "@/lib/ai/types";
import { runFallbackAnswerEngine } from "@/lib/ai/retrieval/fallback-answer-engine";

/**
 * Production integration point: swap `runFallbackAnswerEngine` with
 * vector retrieval + LLMProvider when OPENAI_API_KEY (or similar) and
 * document storage are configured.
 */
export async function answerQuestion(request: AskAiRequest): Promise<AskAiResponse> {
  const useProduction =
    process.env.AI_ANSWER_ENGINE_MODE === "production" &&
    Boolean(process.env.LLM_API_KEY);

  if (useProduction) {
    // Reserved for future: embedding search + LLM completion
    // Fall through to fallback until implemented
  }

  return runFallbackAnswerEngine(request);
}
