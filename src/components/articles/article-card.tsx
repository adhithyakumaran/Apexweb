"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Clock } from "lucide-react";
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
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay: index * 0.06, ease: smoothEase }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : { y: -4, transition: { duration: 0.3, ease: smoothEase } }
      }
      className="h-full"
    >
      <Link
        href={`/articles/${article.slug}`}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-border/80 bg-card transition-all duration-500 hover:border-brand-orange/30 hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)]",
          isFeatured && "lg:flex-row"
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-linear-to-br",
            article.cover.accent,
            isFeatured ? "min-h-56 lg:min-h-0 lg:w-[42%] lg:shrink-0" : isCompact ? "h-36" : "h-44 sm:h-48"
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
          <div className="absolute left-5 top-5">
            <span className="rounded-full border border-foreground/10 bg-background/80 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-foreground backdrop-blur-sm">
              {articleTemplateLabels[article.template]}
            </span>
          </div>
          {article.template === "case-study" && article.content.results?.[0] && (
            <div className="absolute bottom-5 left-5 rounded-2xl border border-foreground/10 bg-background/90 px-4 py-3 backdrop-blur-sm">
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {article.content.results[0].value}
              </p>
              <p className="text-xs text-muted-foreground">{article.content.results[0].label}</p>
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex flex-1 flex-col p-6 sm:p-7",
            isFeatured && "lg:justify-center lg:p-10"
          )}
        >
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-brand-orange">{article.topic}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {article.readTime} min read
            </span>
            <span aria-hidden>·</span>
            <span>{formatArticleDate(article.publishedAt)}</span>
          </div>

          <h3
            className={cn(
              "mt-3 font-semibold tracking-tight text-foreground transition-colors group-hover:text-brand-orange",
              isFeatured ? "text-2xl sm:text-3xl lg:text-4xl" : isCompact ? "text-lg" : "text-xl sm:text-2xl"
            )}
          >
            {article.title}
          </h3>

          <p
            className={cn(
              "mt-3 leading-relaxed text-muted-foreground",
              isCompact ? "line-clamp-2 text-sm" : "line-clamp-3 text-sm sm:text-base"
            )}
          >
            {article.excerpt}
          </p>

          <div className="mt-auto flex items-center justify-between pt-6">
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2.5 py-1 text-[0.7rem] font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-all group-hover:gap-2 group-hover:text-brand-orange">
              Read
              <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
