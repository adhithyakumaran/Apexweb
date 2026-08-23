import { agents } from "@/config/agents";
import { officeAddress, officeHours, helpOptions } from "@/config/contact";
import { siteConfig } from "@/config/site";
import { listCmsArticles } from "@/lib/cms/articles-repository";
import { listChatbotMemory } from "@/lib/cms/chatbot";
import { getStaticCompanyKnowledge } from "@/lib/chatbot/crawl";
import { getSiteBaseUrl } from "@/lib/site-url";

export async function buildChatKnowledgeContext() {
  const sections: string[] = [getStaticCompanyKnowledge()];

  sections.push(
    `Agents detail:\n${agents
      .map(
        (a) =>
          `${a.codename} — ${a.role}. ${a.tagline} Page: ${getSiteBaseUrl()}/agents/${a.slug}`
      )
      .join("\n")}`
  );

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
    "What's your phone number?",
    "Where is your office?",
    "How can QA automation help us?",
    "Book a demo",
  ];
}

export const CHAT_SYSTEM_RULES = `
You are the ${siteConfig.name} website assistant. Answer accurately using ONLY the knowledge provided.
- For phone, email, address, and office hours: give exact details from the knowledge base.
- For agents: explain each agent's role and suggest the best fit when the user is unsure.
- If the user does not know what they need, ask one clarifying question and offer 2–3 tailored suggestions.
- Be concise, professional, and helpful. Use short paragraphs or bullets when listing options.
- If the question needs a human (pricing negotiation, legal, account issues, or you lack data), respond normally then end with the exact tag [HUMAN_SUPPORT] on its own line.
- Never invent contact details, pricing, or features not in the knowledge base.
`.trim();
