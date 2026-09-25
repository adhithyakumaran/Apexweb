import { articles } from "@/config/articles";
import { agents } from "@/config/agents";
import { coreServices, aiPlatforms, industryAgents } from "@/config/services";
import { mainNav } from "@/config/navigation";
import type { CmsContentMeta, CmsStats, ContentProvider } from "@/cms/types";

export const localContentProvider: ContentProvider = {
  async listArticles() {
    return articles.map((article) => ({
      id: article.slug,
      type: "article" as const,
      title: article.title,
      slug: article.slug,
      status: "published" as const,
      updatedAt: article.publishedAt,
      template: article.template,
    }));
  },

  async getStats() {
    return {
      articles: articles.length,
      services: coreServices.length + aiPlatforms.length + industryAgents.length,
      agents: agents.length,
      pages: mainNav.length + 2,
    };
  },
};

export async function listAllContent(): Promise<CmsContentMeta[]> {
  const articleItems = await localContentProvider.listArticles();

  const serviceItems: CmsContentMeta[] = [...coreServices, ...aiPlatforms, ...industryAgents].map(
    (service, index) => ({
      id: `service-${index}`,
      type: "service",
      title: service.title,
      slug: service.href,
      status: "published",
      updatedAt: "2026-01-01",
    })
  );

  const agentItems: CmsContentMeta[] = agents.map((agent) => ({
    id: agent.slug,
    type: "agent",
    title: agent.codename,
    slug: agent.slug,
    status: "published",
    updatedAt: "2026-01-01",
  }));

  return [...articleItems, ...serviceItems, ...agentItems];
}
