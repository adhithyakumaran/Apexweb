import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import type { Article } from "@/config/articles";
import { articleTemplateLabels } from "@/config/articles";
import { formatArticleDate } from "@/lib/articles";

type ArticleHeaderProps = {
  article: Article;
};

export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="relative overflow-hidden border-b border-white/10 bg-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklab,var(--brand-orange)_18%,transparent),transparent_55%)]" />
      <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-brand-orange"
        >
          <ArrowLeft className="size-4" />
          Hub
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
          <span className="font-bold uppercase tracking-[0.16em] text-brand-orange">
            {articleTemplateLabels[article.template]}
          </span>
          <span className="text-white/30">/</span>
          <span className="text-white/50">{article.topic}</span>
          <span className="inline-flex items-center gap-1 text-white/40">
            <Clock className="size-3.5" />
            {article.readTime} min
          </span>
        </div>

        <p className="mt-6 text-lg font-medium text-brand-orange sm:text-xl">{article.hook}</p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.08]">
          {article.title}
        </h1>

        <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
          <div className="flex size-10 items-center justify-center rounded-full bg-brand-orange text-sm font-bold text-black">
            {article.author.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{article.author.name}</p>
            <p className="text-xs text-white/45">
              {article.author.role} · {formatArticleDate(article.publishedAt)}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
