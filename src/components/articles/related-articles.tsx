import type { Article } from "@/config/articles";
import { ArticleCard } from "@/components/articles/article-card";

type RelatedArticlesProps = {
  articles: Article[];
};

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="border-t border-white/10 bg-black px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-350">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-brand-orange">
          More
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Keep reading
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {articles.map((article, index) => (
            <ArticleCard key={article.slug} article={article} variant="compact" index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
