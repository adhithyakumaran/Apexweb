import type { Article } from "@/config/articles";
import { ArticleCard } from "@/components/articles/article-card";

type RelatedArticlesProps = {
  articles: Article[];
};

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="border-t border-border/70 bg-surface/30 px-4 py-12 sm:px-6 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-350">
        <h2 className="text-sm font-medium text-foreground">Related reading</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {articles.map((article, index) => (
            <ArticleCard key={article.slug} article={article} variant="compact" index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
