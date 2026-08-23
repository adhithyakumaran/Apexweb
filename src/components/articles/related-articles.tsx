import type { Article } from "@/config/articles";
import { ArticleCard } from "@/components/articles/article-card";

type RelatedArticlesProps = {
  articles: Article[];
};

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="border-t border-border bg-surface/40 px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-350">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">
          Continue reading
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Related insights
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <ArticleCard key={article.slug} article={article} variant="compact" index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
