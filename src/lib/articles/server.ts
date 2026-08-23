import {
  getPublishedArticlesMerged,
  getArticleBySlugMerged,
} from "@/lib/cms/articles-repository";
import type { Article } from "@/config/articles";

export async function getAllArticles(): Promise<Article[]> {
  return getPublishedArticlesMerged();
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const article = await getArticleBySlugMerged(slug);
  return article ?? undefined;
}
