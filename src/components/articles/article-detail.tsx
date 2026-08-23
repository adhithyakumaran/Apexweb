"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Article } from "@/config/articles";
import { ArticleHeader } from "@/components/articles/article-header";
import { RelatedArticles } from "@/components/articles/related-articles";
import { ArticleTemplateRenderer } from "@/components/articles/templates";
import { smoothEase } from "@/components/animations/motion-presets";

type ArticleDetailProps = {
  article: Article;
  related: Article[];
};

export function ArticleDetail({ article, related }: ArticleDetailProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="bg-background">
      <ArticleHeader article={article} />

      <motion.article
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: smoothEase }}
        className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-10 lg:py-12"
      >
        <ArticleTemplateRenderer article={article} />

        <div className="mt-10 flex flex-wrap gap-2 border-t border-border/70 pt-8">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.article>

      <RelatedArticles articles={related} />
    </main>
  );
}
