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

export function getBentoSpan(template: Article["template"], index: number): string {
  const patterns: Record<Article["template"], string[]> = {
    "case-study": ["col-span-12 lg:col-span-7", "col-span-12 md:col-span-6 lg:col-span-5"],
    "agent-spotlight": ["col-span-12 md:col-span-6 lg:col-span-5", "col-span-12 lg:col-span-7"],
    insight: ["col-span-12 sm:col-span-6 lg:col-span-4", "col-span-12 sm:col-span-6 lg:col-span-4"],
    standard: ["col-span-12 md:col-span-6 lg:col-span-5", "col-span-12 md:col-span-6 lg:col-span-7"],
  };
  const options = patterns[template];
  return options[index % options.length];
}

export function formatArticleDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
