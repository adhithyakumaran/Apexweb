/**
 * Chatbot knowledge context builder.
 *
 * Assembles the system prompt knowledge block from:
 * - Static company copy (config + crawl.ts)
 * - Five marketing agents (one-line summaries)
 * - Published CMS articles (up to 12)
 * - Chatbot memory entries (crawled pages + uploads)
 *
 * CHAT_SYSTEM_RULES enforces short, crisp replies — keep answers to 1–2 sentences.
 */
import { agents } from "@/config/agents";
import { officeAddress, officeHours, helpOptions } from "@/config/contact";
import { siteConfig } from "@/config/site";
import { listCmsArticles } from "@/lib/cms/articles-repository";
import { listChatbotMemory } from "@/lib/cms/chatbot";
import { getStaticCompanyKnowledge } from "@/lib/chatbot/crawl";
import { getSiteBaseUrl } from "@/lib/site-url";

export function getAgentQuickReference() {
  return agents
    .map((a) => `${a.codename}: ${a.role.toLowerCase()} — ${a.tagline}`)
    .join("\n");
}

export async function buildChatKnowledgeContext() {
  const sections: string[] = [getStaticCompanyKnowledge()];

  sections.push(`Agents (one line each):\n${getAgentQuickReference()}`);

  try {
    const articles = await listCmsArticles(false);
    const published = articles.filter((a) => a.status === "published").slice(0, 12);
    if (published.length) {
      sections.push(
        `Published articles:\n${published
          .map((a) => `- ${a.title}: ${a.excerpt} (${getSiteBaseUrl()}/articles/${a.slug})`)
          .join("\n")}`
      );
    }
  } catch {
    // articles optional
  }

  try {
    const memory = await listChatbotMemory();
    if (memory.length) {
      sections.push(
        `Uploaded knowledge & crawled pages:\n${memory
          .map((m) => {
            const header = `[${m.type}] ${m.name}`;
            const body = m.content?.trim() ?? "";
            const link = m.sourceUrl ?? m.fileUrl ?? "";
            return `${header}\n${body}${link ? `\nSource: ${link}` : ""}`.trim();
          })
          .join("\n\n")}`
      );
    }
  } catch {
    // memory optional
  }

  return sections.join("\n\n---\n\n").slice(0, 48000);
}

export function getChatSuggestions() {
  return [
    "What agents do you offer?",
    "Phone number?",
    "Office address?",
    "Book a demo",
  ];
}

const TONE_HINTS: Record<string, string> = {
  concise: "Ultra-brief. 1–2 sentences. Plain text only.",
  friendly: "Warm but still short — max 2 sentences.",
  professional: "Polite and tight — max 2–3 sentences.",
  technical: "Precise — max 3 sentences, no fluff.",
  sales: "Helpful pitch — max 2 sentences, one clear next step.",
};

export const CHAT_SYSTEM_RULES = `
You are the ${siteConfig.name} website assistant.

STYLE (mandatory):
- Answer ONLY what was asked. One question → one short answer.
- Default: 1–2 sentences. Hard max 3 sentences unless the user explicitly asks for a full list.
- No markdown tables. No long bullet lists. No "here's everything" dumps.
- No preamble ("Great question!", "We offer five agents that cover..."). Start with the answer.
- If they ask about all agents: name the five in one line, then ask which they want to know more about.
- If they ask about one agent: one sentence on what it does.
- If unsure what they need: one short question back — not a lecture.

AGENTS (only these five — no Phantom or others):
Sentinel (security), TestBuddy (testing), Hermes (performance), Prism (analytics), Atlas (architecture).

FACTS:
- Use only the knowledge base for phone, email, address, hours, and features.
- Unknown agent? Say it doesn't exist and name the five real ones in one line.
- Need a human? End with [HUMAN_SUPPORT] on its own line.
`.trim();

export function getToneInstruction(tone: string) {
  return TONE_HINTS[tone] ?? TONE_HINTS.concise;
}
