import Link from "next/link";
import { Download } from "lucide-react";
import type { Article } from "@/config/articles";

type ArticleMediaProps = {
  article: Article;
};

export function ArticleHeroImage({ article }: ArticleMediaProps) {
  if (!article.heroImageUrl) return null;

  return (
    <figure className="mt-6 sm:mt-8">
      <div className="inline-block max-w-full overflow-hidden rounded-xl border border-border/60 bg-muted/20 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:max-w-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.heroImageUrl}
          alt={article.title}
          className="aspect-[5/3] w-full max-h-[11rem] object-cover sm:max-h-[12.5rem]"
          loading="eager"
        />
      </div>
    </figure>
  );
}

export function ArticleAttachment({ article }: ArticleMediaProps) {
  if (!article.attachmentUrl) return null;

  return (
    <div className="mt-8 flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-surface/30 px-4 py-3">
      <div>
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Resource
        </p>
        <p className="mt-0.5 text-sm text-foreground">
          {article.attachmentName || "Downloadable file"}
        </p>
      </div>
      <Link
        href={article.attachmentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand-orange/40 hover:text-brand-orange"
      >
        <Download className="size-3.5" />
        Download
      </Link>
    </div>
  );
}
