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
    <header className="border-b border-border bg-surface/50">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Knowledge Hub
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span className="rounded-full border border-brand-orange/25 bg-brand-orange/10 px-3 py-1 font-semibold uppercase tracking-[0.12em] text-brand-orange">
            {articleTemplateLabels[article.template]}
          </span>
          <span className="text-muted-foreground">{article.topic}</span>
          <span className="text-muted-foreground" aria-hidden>
            ·
          </span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Clock className="size-3.5" />
            {article.readTime} min read
          </span>
          <span className="text-muted-foreground" aria-hidden>
            ·
          </span>
          <span className="text-muted-foreground">{formatArticleDate(article.publishedAt)}</span>
        </div>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {article.title}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {article.excerpt}
        </p>

        <div className="mt-8 flex items-center gap-3 border-t border-border/70 pt-6">
          <div className="flex size-10 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
            {article.author.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{article.author.name}</p>
            <p className="text-xs text-muted-foreground">{article.author.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
