const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/** Groq retired Llama 3.x models on 2026-08-16. See console.groq.com/docs/models */
export const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b";

export const GROQ_MODEL_OPTIONS = [
  { id: "openai/gpt-oss-20b", label: "GPT-OSS 20B (fast, recommended)" },
  { id: "openai/gpt-oss-120b", label: "GPT-OSS 120B (smarter)" },
  { id: "qwen/qwen3.6-27b", label: "Qwen 3.6 27B (preview)" },
] as const;

const RETIRED_MODEL_MAP: Record<string, string> = {
  "llama-3.3-70b-versatile": DEFAULT_GROQ_MODEL,
  "llama-3.1-8b-instant": DEFAULT_GROQ_MODEL,
  "llama3-70b-8192": DEFAULT_GROQ_MODEL,
  "mixtral-8x7b-32768": DEFAULT_GROQ_MODEL,
};

export type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export function isGroqConfigured() {
  return Boolean(process.env.GROQ_API_KEY?.trim());
}

/** Map retired Groq model IDs to a currently supported model. */
export function resolveGroqModel(model?: string | null) {
  const trimmed = model?.trim();
  if (!trimmed) return DEFAULT_GROQ_MODEL;
  return RETIRED_MODEL_MAP[trimmed] ?? trimmed;
}

export async function chatWithGroq({
  model,
  messages,
  temperature = 0.4,
}: {
  model: string;
  messages: GroqMessage[];
  temperature?: number;
}) {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const resolvedModel = resolveGroqModel(model);
  const modelsToTry = [...new Set([resolvedModel, DEFAULT_GROQ_MODEL, "openai/gpt-oss-120b"])];

  let lastError = "";

  for (const modelId of modelsToTry) {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        temperature,
        max_tokens: 1024,
      }),
    });

    if (response.ok) {
      const data = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = data.choices?.[0]?.message?.content?.trim();
      if (!content) throw new Error("Empty response from Groq");
      return content;
    }

    const text = await response.text();
    lastError = `Groq API error (${response.status}): ${text.slice(0, 240)}`;

    const isModelError =
      response.status === 404 || text.includes("model_not_found") || text.includes("does not exist");
    if (!isModelError) break;
  }

  throw new Error(lastError || "Groq chat request failed");
}

export function parseHumanHandoff(reply: string) {
  const needsHuman = /\[HUMAN_SUPPORT\]\s*$/i.test(reply.trim());
  const text = reply.replace(/\n?\[HUMAN_SUPPORT\]\s*$/i, "").trim();
  return { text, needsHuman };
}
