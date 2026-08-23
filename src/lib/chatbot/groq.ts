const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/** Qwen is usually enabled on free Groq projects; GPT-OSS may need admin enablement. */
export const DEFAULT_GROQ_MODEL = "qwen/qwen3.6-27b";

export const GROQ_MODEL_OPTIONS = [
  { id: "qwen/qwen3.6-27b", label: "Qwen 3.6 27B (default — works on most free projects)" },
  { id: "openai/gpt-oss-20b", label: "GPT-OSS 20B (enable in Groq project limits)" },
  { id: "openai/gpt-oss-120b", label: "GPT-OSS 120B (enable in Groq project limits)" },
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

export function getDefaultGroqModel() {
  return process.env.GROQ_MODEL?.trim() || DEFAULT_GROQ_MODEL;
}

/** Map retired Groq model IDs to a currently supported model. */
export function resolveGroqModel(model?: string | null) {
  const trimmed = model?.trim();
  if (!trimmed) return getDefaultGroqModel();
  return RETIRED_MODEL_MAP[trimmed] ?? trimmed;
}

function buildModelTryList(requested: string) {
  const resolved = resolveGroqModel(requested);
  const envDefault = getDefaultGroqModel();
  return [
    ...new Set([
      resolved,
      envDefault,
      DEFAULT_GROQ_MODEL,
      "qwen/qwen3.6-27b",
      "openai/gpt-oss-20b",
      "openai/gpt-oss-120b",
    ]),
  ];
}

function isRetryableModelError(status: number, body: string) {
  return (
    status === 404 ||
    status === 403 ||
    body.includes("model_not_found") ||
    body.includes("does not exist") ||
    body.includes("blocked at the project level") ||
    body.includes("permissions_error")
  );
}

function formatGroqError(status: number, body: string) {
  if (status === 403 && body.includes("blocked at the project level")) {
    return (
      "This Groq model is disabled for your project. In Chat Bot admin, switch Model to " +
      "`qwen/qwen3.6-27b`, or enable GPT-OSS at console.groq.com/settings/project/limits"
    );
  }
  return `Groq API error (${status}): ${body.slice(0, 240)}`;
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

  const modelsToTry = buildModelTryList(model);
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
    lastError = formatGroqError(response.status, text);

    if (!isRetryableModelError(response.status, text)) break;
  }

  throw new Error(lastError || "Groq chat request failed");
}

export function parseHumanHandoff(reply: string) {
  const needsHuman = /\[HUMAN_SUPPORT\]\s*$/i.test(reply.trim());
  const text = reply.replace(/\n?\[HUMAN_SUPPORT\]\s*$/i, "").trim();
  return { text, needsHuman };
}
