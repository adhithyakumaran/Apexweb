import { helpOptions } from "@/config/contact";
import { tryItCta } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { getChatSuggestions } from "@/lib/chatbot/knowledge";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";

export type AnswerCta = { label: string; href: string; external?: boolean };
export type AnswerSource = { title: string; href?: string; type: "website" | "cms" };

export function buildAnswerEnvelope(
  userQuestion: string,
  pathname: string,
  assistantText: string
) {
  const relatedQuestions = pickRelatedQuestions(userQuestion);
  const ctas = buildCtas(assistantText);
  const sources = buildSources(pathname, assistantText);

  return { relatedQuestions, ctas, sources };
}

function pickRelatedQuestions(question: string) {
  const q = question.toLowerCase().trim();
  const pool = [
    ...getChatSuggestions(),
    ...helpOptions.map((h) => `How can Apex Node help with ${h.toLowerCase()}?`),
    "What does TestBuddy do?",
    "How do I book a demo?",
  ];
  const unique = [...new Set(pool)].filter(
    (item) => item.toLowerCase() !== q && !q.includes(item.toLowerCase().slice(0, 12))
  );
  return unique.slice(0, 4);
}

function buildCtas(assistantText: string): AnswerCta[] {
  const fromMessage = extractMarkdownLinks(assistantText).slice(0, 2);
  const defaults: AnswerCta[] = [
    { label: tryItCta.label, href: tryItCta.href },
    { label: "Contact us", href: "/contact" },
    {
      label: "WhatsApp",
      href: getWhatsAppLink(),
      external: true,
    },
  ];
  const seen = new Set<string>();
  const merged = [...fromMessage, ...defaults].filter((c) => {
    if (seen.has(c.href)) return false;
    seen.add(c.href);
    return true;
  });
  return merged.slice(0, 4);
}

function extractMarkdownLinks(text: string): AnswerCta[] {
  const links: AnswerCta[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const href = m[2];
    links.push({
      label: m[1],
      href,
      external: href.startsWith("http"),
    });
  }
  return links;
}

function buildSources(pathname: string, assistantText: string): AnswerSource[] {
  const sources: AnswerSource[] = [];

  if (pathname && pathname !== "/") {
    sources.push({
      title: `Apex Node — ${pathname}`,
      href: pathname,
      type: "website",
    });
  } else {
    sources.push({ title: "Apex Node — Homepage", href: "/", type: "website" });
  }

  sources.push({
    title: `${siteConfig.shortName} — CMS knowledge base`,
    type: "cms",
  });

  const linkHits = extractMarkdownLinks(assistantText);
  for (const link of linkHits) {
    if (link.href.startsWith("/") && !sources.some((s) => s.href === link.href)) {
      sources.push({ title: link.label, href: link.href, type: "website" });
    }
  }

  return sources.slice(0, 6);
}

export const ANSWER_ENGINE_RULES = `
You are the ${siteConfig.name} AI answer engine on the public website.

GOAL:
- Give accurate, helpful answers using ONLY the knowledge base below (site copy, CMS uploads, articles, crawled pages).
- If evidence is missing, say you do not have verified information and suggest contacting the team.

FORMAT (mandatory for this mode):
- Use clear markdown: short headings (##), bullet lists when listing items, and [label](url) links for pages and resources.
- Include 1–3 relevant internal links when they exist in the knowledge base (e.g. /agents, /what-we-do, /articles/..., /contact).
- Mention uploaded documents by name only — do not invent file contents.
- End with one concrete next step when appropriate (demo, contact, or relevant page).

AGENTS (only these five):
Sentinel, TestBuddy, Hermes, Prism, Atlas — use knowledge base descriptions.

Keep answers scannable (roughly 80–180 words unless the user asks for detail).
`.trim();
