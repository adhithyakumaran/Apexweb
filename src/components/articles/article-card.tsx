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
          "group flex h-full gap-4 overflow-hidden rounded-xl border border-border/80 bg-card p-4 transition-all duration-300 hover:border-brand-orange/30 hover:shadow-sm",
          isFeatured && "flex-col sm:flex-row sm:items-stretch sm:p-5",
          isCompact && "gap-3 p-3"
        )}
      >
        {article.heroImageUrl && !isCompact && (
          <div
            className={cn(
              "shrink-0 overflow-hidden rounded-lg bg-muted",
              isFeatured ? "h-36 w-full sm:h-auto sm:w-44" : "size-20 sm:size-24"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.heroImageUrl}
              alt=""
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          {isFeatured && !article.heroImageUrl && (
            <div className="mb-3 h-1 w-8 rounded-full bg-brand-orange" />
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span className="font-medium text-brand-orange">
                {articleTemplateLabels[article.template]}
              </span>
              <span aria-hidden>·</span>
              <span>{formatArticleDate(article.publishedAt)}</span>
              {!isCompact && (
                <>
                  <span aria-hidden>·</span>
                  <span>{article.readTime} min read</span>
                </>
              )}
            </div>

            <h3
              className={cn(
                "mt-1.5 font-medium tracking-tight text-foreground transition-colors group-hover:text-brand-orange",
                isFeatured ? "text-xl sm:text-2xl" : isCompact ? "text-base" : "text-lg"
              )}
            >
              {article.title}
            </h3>

            <p
              className={cn(
                "mt-1.5 text-muted-foreground",
                isCompact ? "line-clamp-2 text-xs" : "line-clamp-2 text-sm leading-relaxed"
              )}
            >
              {article.hook}
            </p>
          </div>

          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-foreground/70 transition-all group-hover:gap-2 group-hover:text-brand-orange">
            Read article
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
