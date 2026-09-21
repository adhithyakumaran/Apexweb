import { readFile } from "fs/promises";
import path from "path";

const PAGE_SNIPPETS: Record<string, string> = {
  "/": "Homepage: AI-powered testing agents, enterprise QA automation, agentic end-to-end coverage.",
  "/what-we-do":
    "Services: AI-Powered QA, Agentic Testing, Enterprise QA, Automation, Security testing, Analytics.",
  "/who-we-are":
    "About Apex Node: mission to accelerate software quality; approach, leadership, careers.",
  "/insights":
    "Insights on QA engineering, agentic AI, enterprise AI, testing trends, case studies, resources.",
  "/pricing":
    "Pricing plans for teams and enterprise; contact for custom enterprise QA packages.",
  "/contact":
    "Contact Apex Node via email, phone, WhatsApp, or book a demo.",
  "/book-demo": "Book a demo of the Apex Node agentic QA platform.",
  "/agents": "Suite of QA agents: Sentinel, TestBuddy, Hermes, Prism, Atlas.",
};

export async function getWebsiteChunksForPath(pathname: string): Promise<string[]> {
  const normalized = pathname.split("?")[0] || "/";
  const chunks: string[] = [];

  if (PAGE_SNIPPETS[normalized]) {
    chunks.push(PAGE_SNIPPETS[normalized]);
  }

  if (normalized.startsWith("/agents/")) {
    const slug = normalized.replace("/agents/", "");
    chunks.push(`Agent page: ${slug} — specialized QA agent on the Apex Node platform.`);
  }

  try {
    const configDir = path.join(process.cwd(), "src/config");
    const files = ["site.ts", "agents.ts", "moat.ts", "knowledge.ts"];
    for (const file of files) {
      const content = await readFile(path.join(configDir, file), "utf-8");
      chunks.push(content.slice(0, 4000));
    }
  } catch {
    // optional enrichment
  }

  return chunks;
}
