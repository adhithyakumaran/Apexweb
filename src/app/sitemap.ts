import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { agents } from "@/config/agents";
import { getAllArticles } from "@/lib/articles/server";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles();
  return [
    ...["/", "/what-we-do", "/agents", "/articles", "/contact"].map((path) => ({
      url: new URL(path, siteConfig.url).toString(),
    })),
    ...agents.map((agent) => ({ url: `${siteConfig.url}/agents/${agent.slug}` })),
    ...articles.map((article) => ({ url: `${siteConfig.url}/articles/${article.slug}` })),
  ];
}
