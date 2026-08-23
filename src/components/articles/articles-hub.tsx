"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import type { Article } from "@/config/articles";
import { articleCategoryLabels } from "@/config/articles";
import { filterArticles, getFeaturedArticle, type HubFilter } from "@/lib/articles";
import { ArticleCard } from "@/components/articles/article-card";
import { smoothEase } from "@/components/animations/motion-presets";
import { cn } from "@/lib/utils";

const filters: { id: HubFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "articles", label: "Articles" },
  { id: "case-studies", label: "Case Studies" },
  { id: "insights", label: "Insights" },
  { id: "agents", label: "Agents" },
];

type ArticlesHubProps = {
  articles: Article[];
};

export function ArticlesHub({ articles }: ArticlesHubProps) {
  const [activeFilter, setActiveFilter] = useState<HubFilter>("all");
  const prefersReducedMotion = useReducedMotion();
  const featured = getFeaturedArticle(articles);
  const filtered = useMemo(
    () => filterArticles(articles, activeFilter),
    [articles, activeFilter]
  );
  const gridArticles = filtered.filter((article) => article.slug !== featured?.slug);

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/70 bg-surface/40 px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-350">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="max-w-2xl"
          >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">
              Knowledge Hub
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Articles & case studies
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Practical notes on QA automation, agents, and enterprise quality — each piece on its
              own page for easy reading and sharing.
            </p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {filters.map((filter) => {
              const active = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm transition-all duration-200",
                    active
                      ? "border-brand-orange/40 bg-brand-orange/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-border hover:text-foreground"
                  )}
                >
                  {filter.id === "all" ? filter.label : articleCategoryLabels[filter.id]}
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-350">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.25, ease: smoothEase }}
              className="space-y-8"
            >
              {activeFilter === "all" && featured && (
                <ArticleCard article={featured} variant="featured" />
              )}

              {gridArticles.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {gridArticles.map((article, index) => (
                    <ArticleCard key={article.slug} article={article} index={index} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border px-6 py-14 text-center">
                  <p className="text-sm text-muted-foreground">No articles in this category yet.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
