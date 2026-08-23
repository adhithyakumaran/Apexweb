"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/config/articles";
import { articleTemplateLabels } from "@/config/articles";
import { formatArticleDate, getBentoSpan } from "@/lib/articles";
import { smoothEase } from "@/components/animations/motion-presets";
import { cn } from "@/lib/utils";

type ArticleCardProps = {
  article: Article;
  variant?: "featured" | "bento" | "compact";
  index?: number;
};

export function ArticleCard({ article, variant = "bento", index = 0 }: ArticleCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";
  const metric = article.content.results?.[0];
  const takeaways = article.content.keyTakeaways;

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 28, scale: 0.98 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: smoothEase }}
      className={cn("h-full", variant === "bento" && getBentoSpan(article.template, index))}
    >
      <Link
        href={`/articles/${article.slug}`}
        className={cn(
          "group relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-500 hover:border-brand-orange/50 hover:bg-white/[0.06] sm:p-7",
          isFeatured && "min-h-[320px] rounded-[1.75rem] p-8 sm:min-h-[380px] sm:p-10 lg:min-h-[420px]",
          isCompact && "min-h-[200px] p-5"
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-br opacity-50 transition-opacity duration-500 group-hover:opacity-80",
            article.cover.accent
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-brand-orange/10 blur-3xl transition-all duration-500 group-hover:bg-brand-orange/20",
            isFeatured && "size-56"
          )}
        />

        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-orange">
              {articleTemplateLabels[article.template]}
            </span>
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-white/40">
              {article.readTime} min
            </span>
          </div>

          {isFeatured && metric && (
            <p className="mt-6 text-6xl font-semibold tracking-tighter text-brand-orange sm:text-7xl lg:text-8xl">
              {metric.value}
            </p>
          )}

          {!isFeatured && article.template === "case-study" && metric && (
            <p className="mt-4 text-4xl font-semibold tracking-tight text-brand-orange sm:text-5xl">
              {metric.value}
            </p>
          )}

          {!isFeatured && article.template === "agent-spotlight" && (
            <p className="mt-4 font-mono text-3xl font-semibold uppercase tracking-tight text-white/90 sm:text-4xl">
              {article.topic}
            </p>
          )}

          {!isFeatured && article.template === "insight" && takeaways?.[0] && (
            <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-white/50">
              01 — {takeaways[0]}
            </p>
          )}

          <h3
            className={cn(
              "font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-brand-orange",
              isFeatured
                ? "mt-4 max-w-3xl text-3xl sm:text-4xl lg:text-5xl lg:leading-[1.1]"
                : isCompact
                  ? "mt-3 text-lg leading-snug"
                  : "mt-4 text-xl leading-snug sm:text-2xl"
            )}
          >
            {article.title}
          </h3>

          <p
            className={cn(
              "mt-3 font-medium text-brand-orange/90",
              isFeatured ? "text-lg sm:text-xl" : "text-sm sm:text-base"
            )}
          >
            {article.hook}
          </p>
        </div>

        <div className="relative mt-8 flex items-end justify-between gap-4">
          <span className="text-xs text-white/35">{formatArticleDate(article.publishedAt)}</span>
          <span className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all duration-300 group-hover:border-brand-orange group-hover:bg-brand-orange group-hover:text-black">
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-12" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
