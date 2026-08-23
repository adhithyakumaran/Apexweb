export type ChatbotTone =
  | "professional"
  | "friendly"
  | "concise"
  | "technical"
  | "sales";

export type ChatbotMemoryType = "text" | "pdf" | "url" | "crawl";

export type ChatbotSettings = {
  provider: string;
  model: string;
  systemPrompt: string;
  tone: ChatbotTone;
  skills: string[];
  crawlEnabled: boolean;
  crawlBaseUrl: string;
  lastCrawledAt: string | null;
  enabled: boolean;
  welcomeMessage: string;
  updatedAt: string | null;
  groqConfigured: boolean;
};

export type ChatbotMemoryItem = {
  id: number;
  name: string;
  type: ChatbotMemoryType;
  content: string | null;
  fileUrl: string | null;
  sourceUrl: string | null;
  charCount: number;
  createdAt: string;
};

export const CHATBOT_TONES: { value: ChatbotTone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "concise", label: "Concise" },
  { value: "technical", label: "Technical" },
  { value: "sales", label: "Sales" },
];

export const CHATBOT_SKILL_SUGGESTIONS = [
  "Answer product questions",
  "Explain pricing",
  "Book a demo",
  "Troubleshoot QA workflows",
  "Summarize articles",
  "Compare agents",
];

export const DEFAULT_CHATBOT_SETTINGS: Omit<ChatbotSettings, "groqConfigured" | "updatedAt" | "lastCrawledAt"> = {
  provider: "groq",
  model: "qwen/qwen3.6-27b",
  systemPrompt:
    "You are the Apexweb assistant. Answer using the company website, knowledge base, and uploaded documents. Be accurate and concise.",
  tone: "professional",
  skills: ["Answer product questions", "Summarize articles"],
  crawlEnabled: true,
  crawlBaseUrl: "",
  enabled: true,
  welcomeMessage: "Hi — how can I help you today?",
};
