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
    <main className="bg-black text-white">
      <ArticleHeader article={article} />

      <motion.article
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: smoothEase }}
        className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16 [&_h2]:text-white [&_p]:text-white/65 [&_blockquote]:text-white"
      >
        <ArticleTemplateRenderer article={article} />

        <div className="mt-12 flex flex-wrap gap-2 border-t border-white/10 pt-8">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/50"
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
