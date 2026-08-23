"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/config/articles";
import { articleTemplateLabels } from "@/config/articles";
import { formatArticleDate } from "@/lib/articles";
import { smoothEase } from "@/components/animations/motion-presets";
import { cn } from "@/lib/utils";

type ArticleCardProps = {
  article: Article;
  variant?: "default" | "featured" | "compact";
  index?: number;
};

export function ArticleCard({ article, variant = "default", index = 0 }: ArticleCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: smoothEase }}
      className="h-full"
    >
      <Link
        href={`/articles/${article.slug}`}
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card transition-all duration-300 hover:border-brand-orange/30 hover:shadow-sm",
          isFeatured ? "sm:flex-row sm:items-stretch" : "",
          isCompact && "p-4",
          !isFeatured && !isCompact && "p-0"
        )}
      >
        {article.heroImageUrl && !isCompact && (
          <div className={cn(isFeatured ? "sm:w-2/5" : "w-full")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.heroImageUrl}
              alt=""
              className={cn(
                "h-full w-full object-cover",
                isFeatured ? "min-h-48 sm:min-h-full" : "aspect-[16/9]"
              )}
            />
          </div>
        )}

        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col",
            isFeatured ? "p-6 sm:p-7" : isCompact ? "" : "p-5"
          )}
        >
        {isFeatured && !article.heroImageUrl && (
          <div className="mb-4 h-1 w-10 rounded-full bg-brand-orange sm:mb-0 sm:hidden" />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="font-medium text-brand-orange">
              {articleTemplateLabels[article.template]}
            </span>
            <span aria-hidden>·</span>
            <span>{formatArticleDate(article.publishedAt)}</span>
            <span aria-hidden>·</span>
            <span>{article.readTime} min read</span>
          </div>

          <h3
            className={cn(
              "mt-2 font-medium tracking-tight text-foreground transition-colors group-hover:text-brand-orange",
              isFeatured ? "text-xl sm:text-2xl" : isCompact ? "text-base" : "text-lg"
            )}
          >
            {article.title}
          </h3>

          <p
            className={cn(
              "mt-2 text-muted-foreground",
              isCompact ? "line-clamp-2 text-xs" : "line-clamp-2 text-sm leading-relaxed"
            )}
          >
            {article.hook}
          </p>
        </div>

        <span
          className={cn(
            "mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground/70 transition-all group-hover:gap-2 group-hover:text-brand-orange",
            isFeatured && "sm:mt-4"
          )}
        >
          Read article
          <ArrowRight className="size-3.5" />
        </span>
        </div>
      </Link>
    </motion.article>
  );
}
