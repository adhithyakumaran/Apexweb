import Link from "next/link";
import { Download } from "lucide-react";
import type { Article } from "@/config/articles";

type ArticleMediaProps = {
  article: Article;
};

export function ArticleHeroImage({ article }: ArticleMediaProps) {
  if (!article.heroImageUrl) return null;

  return (
    <div className="border-b border-border/70 bg-surface/20">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.heroImageUrl}
          alt={article.title}
          className="aspect-[2/1] w-full rounded-2xl border border-border/80 bg-muted object-cover shadow-sm"
          loading="eager"
        />
      </div>
    </div>
  );
}

export function ArticleAttachment({ article }: ArticleMediaProps) {
  if (!article.attachmentUrl) return null;

  return (
    <div className="mt-8 rounded-xl border border-border/80 bg-surface/40 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Download
      </p>
      <Link
        href={article.attachmentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-brand-orange hover:underline"
      >
        <Download className="size-4" />
        {article.attachmentName || "Download file"}
      </Link>
    </div>
  );
}
