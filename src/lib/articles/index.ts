import { articles, type Article, type ArticleCategory, type ArticleTemplate } from "@/config/articles";

export function getAllArticles(): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getFeaturedArticle(): Article | undefined {
  return articles.find((article) => article.featured) ?? getAllArticles()[0];
}

export function getRelatedArticles(current: Article, limit = 3): Article[] {
  return getAllArticles()
    .filter((article) => article.slug !== current.slug)
    .filter(
      (article) =>
        article.category === current.category ||
        article.topic === current.topic ||
        article.tags.some((tag) => current.tags.includes(tag))
    )
    .slice(0, limit);
}

export type HubFilter = "all" | ArticleCategory;

export function filterArticles(items: Article[], filter: HubFilter): Article[] {
  if (filter === "all") return items;
  return items.filter((article) => article.category === filter);
}

export function getArticlesByTemplate(template: ArticleTemplate): Article[] {
  return getAllArticles().filter((article) => article.template === template);
}

export function formatArticleDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
