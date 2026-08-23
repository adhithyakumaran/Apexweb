import { articles } from "@/config/articles";
import { agents } from "@/config/agents";
import { contactMethods, officeAddress } from "@/config/contact";
import { mainNav, tryItCta } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import {
  aiPlatforms,
  coreServices,
  industryAgents,
  serviceQuickLinks,
  agentQuickLinks,
} from "@/config/services";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";

export type SearchResultCategory =
  | "Pages"
  | "Services"
  | "Agents"
  | "Articles"
  | "Contact";

export type SearchResult = {
  id: string;
  title: string;
  description: string;
  href: string;
  category: SearchResultCategory;
  keywords: string[];
};

function item(
  id: string,
  title: string,
  description: string,
  href: string,
  category: SearchResultCategory,
  keywords: string[] = []
): SearchResult {
  return { id, title, description, href, category, keywords };
}

export function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  for (const nav of mainNav) {
    results.push(item(`page-${nav.href}`, nav.label, `Go to ${nav.label}`, nav.href, "Pages"));
  }

  results.push(
    item("page-home", "Home", siteConfig.description, "/", "Pages", ["homepage", "apex"]),
    item("page-demo", tryItCta.label, "Book a demo with Apex Node", tryItCta.href, "Pages", [
      "demo",
      "trial",
    ])
  );

  for (const service of [...coreServices, ...aiPlatforms, ...industryAgents]) {
    results.push(
      item(
        `service-${service.href}`,
        service.title,
        service.description,
        service.href,
        "Services",
        [service.title.toLowerCase(), "service", "what we do"]
      )
    );
  }

  for (const link of [...serviceQuickLinks, ...agentQuickLinks]) {
    results.push(
      item(`quick-${link.href}`, link.label, link.label, link.href, "Services", [
        link.label.toLowerCase(),
      ])
    );
  }

  for (const agent of agents) {
    results.push(
      item(
        `agent-${agent.slug}`,
        agent.codename,
        agent.tagline,
        `/agents/${agent.slug}`,
        "Agents",
        [agent.codename, agent.role, agent.slug, "agent", "testing"]
      )
    );
  }

  results.push(
    item(
      "agents-all",
      "All Agents",
      "Browse the full Apex Node agent suite",
      "/agents",
      "Agents",
      ["agents", "platform"]
    )
  );

  for (const article of articles) {
    results.push(
      item(
        `article-${article.slug}`,
        article.title,
        article.hook,
        `/articles/${article.slug}`,
        "Articles",
        [
          article.title.toLowerCase(),
          article.hook.toLowerCase(),
          ...article.tags.map((t) => t.toLowerCase()),
          article.topic.toLowerCase(),
          "article",
          "blog",
          "case study",
        ]
      )
    );
  }

  results.push(
    item(
      "articles-all",
      "Articles & Case Studies",
      "Knowledge hub — articles, case studies, and insights",
      "/articles",
      "Articles",
      ["articles", "blog", "knowledge", "case studies"]
    )
  );

  for (const method of contactMethods) {
    results.push(
      item(
        `contact-${method.id}`,
        method.label,
        method.headline,
        method.href,
        "Contact",
        [method.label.toLowerCase(), "contact", method.value.toLowerCase()]
      )
    );
  }

  results.push(
    item(
      "contact-page",
      "Contact",
      "Get in touch with Apex Node Technologies",
      "/contact",
      "Contact",
      ["contact", "email", "phone", "whatsapp", "chennai"]
    ),
    item(
      "contact-address",
      "Chennai Office",
      officeAddress.lines.join(", "),
      "/contact",
      "Contact",
      ["chennai", "office", "address", "visit", officeAddress.mapQuery.toLowerCase()]
    ),
    item(
      "contact-whatsapp",
      "WhatsApp",
      "Chat with our team on WhatsApp",
      getWhatsAppLink(),
      "Contact",
      ["whatsapp", "chat", siteConfig.contact.phone]
    ),
    item(
      "contact-email",
      "Email",
      siteConfig.contact.email,
      `mailto:${siteConfig.contact.email}`,
      "Contact",
      ["email", siteConfig.contact.email]
    )
  );

  return results;
}

function scoreResult(result: SearchResult, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;

  const title = result.title.toLowerCase();
  const description = result.description.toLowerCase();
  let score = 0;

  if (title === q) score += 100;
  if (title.startsWith(q)) score += 50;
  if (title.includes(q)) score += 30;
  if (description.includes(q)) score += 15;

  for (const keyword of result.keywords) {
    if (keyword.includes(q)) score += 10;
    if (keyword.startsWith(q)) score += 8;
  }

  return score;
}

export function searchSite(query: string, limit = 12): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q || q.length < 2) return [];

  return buildSearchIndex()
    .map((result) => ({ result, score: scoreResult(result, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ result }) => result);
}

export const searchIndex = buildSearchIndex();
