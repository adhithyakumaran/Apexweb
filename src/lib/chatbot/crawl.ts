import { agents } from "@/config/agents";
import { officeAddress, officeHours, helpOptions } from "@/config/contact";
import { siteConfig } from "@/config/site";
import { getSiteBaseUrl } from "@/lib/site-url";

/** Public routes to crawl for chatbot knowledge (no admin/api). */
export function getCrawlRoutes() {
  const staticRoutes = ["/", "/what-we-do", "/agents", "/articles", "/contact"];
  const agentRoutes = agents.map((agent) => `/agents/${agent.slug}`);
  return [...staticRoutes, ...agentRoutes];
}

export function stripHtmlToText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchPageText(baseUrl: string, path: string) {
  const url = `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "ApexwebBotCrawler/1.0" },
      next: { revalidate: 0 },
    });
    if (!response.ok) return { url, path, text: "", ok: false };
    const html = await response.text();
    const text = stripHtmlToText(html).slice(0, 12000);
    return { url, path, text, ok: text.length > 80 };
  } catch {
    return { url, path, text: "", ok: false };
  }
}

export async function crawlPublicSite(baseUrl: string) {
  const routes = getCrawlRoutes();
  const results = await Promise.all(routes.map((route) => fetchPageText(baseUrl, route)));
  return results.filter((page) => page.ok && page.text);
}

export function getStaticCompanyKnowledge() {
  const agentLines = agents
    .map((a) => `- ${a.codename} (${a.role}): ${a.tagline}`)
    .join("\n");

  return `
Company: ${siteConfig.name}
Description: ${siteConfig.description}
Website: ${getSiteBaseUrl()}
Email: ${siteConfig.contact.email}
Phone: ${siteConfig.contact.phone}
WhatsApp: +${siteConfig.whatsapp.number}
Address: ${officeAddress.lines.join(", ")}
Office hours: ${officeHours}

AI Agents:
${agentLines}

Services we help with: ${helpOptions.join(", ")}
`.trim();
}
