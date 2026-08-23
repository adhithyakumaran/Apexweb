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
    <header className="border-b border-border/70 bg-surface/30">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          All articles
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-brand-orange/10 px-2.5 py-1 font-medium text-brand-orange">
            {articleTemplateLabels[article.template]}
          </span>
          <span>{article.topic}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {article.readTime} min read
          </span>
          <span aria-hidden>·</span>
          <span>{formatArticleDate(article.publishedAt)}</span>
        </div>

        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl lg:leading-tight">
          {article.title}
        </h1>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{article.hook}</p>

        <div className="mt-6 flex items-center gap-3 text-sm">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
            {article.author.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </div>
          <div>
            <p className="font-medium text-foreground">{article.author.name}</p>
            <p className="text-xs text-muted-foreground">{article.author.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
