import { articles, type Article, type ArticleCategory, type ArticleTemplate } from "@/config/articles";

export type HubFilter = "all" | ArticleCategory;

export function getAllArticlesSync(): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getFeaturedArticle(items?: Article[]): Article | undefined {
  const list = items ?? getAllArticlesSync();
  return list.find((article) => article.featured) ?? list[0];
}

export function getRelatedArticles(current: Article, all: Article[], limit = 3): Article[] {
  return all
    .filter((article) => article.slug !== current.slug)
    .filter(
      (article) =>
        article.category === current.category ||
        article.topic === current.topic ||
        article.tags.some((tag) => current.tags.includes(tag))
    )
    .slice(0, limit);
}

export function filterArticles(items: Article[], filter: HubFilter): Article[] {
  if (filter === "all") return items;
  return items.filter((article) => article.category === filter);
}

export function getArticlesByTemplate(items: Article[], template: ArticleTemplate): Article[] {
  return items.filter((article) => article.template === template);
}

export function formatArticleDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
