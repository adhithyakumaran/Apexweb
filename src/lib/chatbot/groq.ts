const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export function isGroqConfigured() {
  return Boolean(process.env.GROQ_API_KEY?.trim());
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

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq API error (${response.status}): ${text.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("Empty response from Groq");
  return content;
}

export function parseHumanHandoff(reply: string) {
  const needsHuman = /\[HUMAN_SUPPORT\]\s*$/i.test(reply.trim());
  const text = reply.replace(/\n?\[HUMAN_SUPPORT\]\s*$/i, "").trim();
  return { text, needsHuman };
}
