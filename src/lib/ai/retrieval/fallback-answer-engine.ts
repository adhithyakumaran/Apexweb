import {
  defaultRelatedQuestions,
  structuredFaqs,
  getStructuredKnowledgeText,
} from "@/config/knowledge";
import { siteConfig } from "@/config/site";
import type { AskAiRequest, AskAiResponse, CitationSource } from "@/lib/ai/types";
import { getWebsiteChunksForPath } from "@/lib/ai/retrieval/website-content";

function scoreFaq(question: string, faqQ: string): number {
  const q = question.toLowerCase();
  const f = faqQ.toLowerCase();
  const words = q.split(/\W+/).filter((w) => w.length > 3);
  let score = 0;
  for (const w of words) {
    if (f.includes(w)) score += 1;
  }
  return score;
}

function buildSources(pathname?: string): CitationSource[] {
  const sources: CitationSource[] = [
    {
      id: "structured",
      title: "Apex Node — Company knowledge base",
      type: "structured",
    },
  ];
  if (pathname && pathname !== "/") {
    sources.unshift({
      id: "page",
      title: `Apex Node — ${pathname}`,
      href: pathname,
      type: "website",
    });
  } else {
    sources.unshift({
      id: "home",
      title: "Apex Node — Homepage",
      href: "/",
      type: "website",
    });
  }
  return sources;
}

export async function runFallbackAnswerEngine(
  request: AskAiRequest
): Promise<AskAiResponse> {
  const question = request.question.trim();
  const pathname = request.pageContext?.pathname ?? "/";

  const ranked = [...structuredFaqs].sort(
    (a, b) => scoreFaq(question, b.question) - scoreFaq(question, a.question)
  );
  const best = ranked[0];
  const bestScore = best ? scoreFaq(question, best.question) : 0;

  const websiteChunks = await getWebsiteChunksForPath(pathname);
  const contextHint = websiteChunks[0] ?? "";

  let answer: string;
  if (bestScore >= 2 && best) {
    answer = `${best.answer}\n\n${contextHint ? `**On this page:** ${contextHint}` : ""}`.trim();
  } else if (
    /price|plan|cost|enterprise/i.test(question)
  ) {
    answer =
      "Enterprise QA plans include governance, continuous agentic coverage, and dedicated support. Visit our [Pricing](/pricing) page or [contact us](/contact) for a quote tailored to your release cadence and stack.";
  } else if (/contact|email|phone|whatsapp|talk|demo/i.test(question)) {
    answer = `You can reach Apex Node at **${siteConfig.contact.email}** or **${siteConfig.contact.phone}**. For the fastest response, use [WhatsApp](/contact) or [book a demo](/book-demo).`;
  } else if (/what does apex|what is apex/i.test(question)) {
    answer = `${siteConfig.description} Explore our [agents](/agents) and [services](/what-we-do) to see how each layer of the platform works together.`;
  } else {
    const excerpt = getStructuredKnowledgeText().slice(0, 800);
    answer =
      "I don’t have enough verified detail to answer that precisely from our public knowledge base yet. Here’s what I can confirm from Apex Node’s published information:\n\n" +
      excerpt.replace(/\n/g, "\n\n").slice(0, 600) +
      "\n\nFor a definitive answer on your environment, please [contact our team](/contact) or ask a more specific question about our agents, services, or pricing.";
  }

  const related = defaultRelatedQuestions.filter(
    (q) => q.toLowerCase() !== question.toLowerCase()
  );

  return {
    answer,
    conversationId: request.conversationId ?? crypto.randomUUID(),
    sources: buildSources(pathname),
    relatedQuestions: related.slice(0, 4),
    ctas: [
      { label: "Book a demo", href: "/book-demo" },
      { label: "Contact us", href: "/contact" },
    ],
    fallbackMode: true,
  };
}
