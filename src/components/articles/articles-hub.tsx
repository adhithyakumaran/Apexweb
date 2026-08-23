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
  const featured = getFeaturedArticle();
  const filtered = useMemo(
    () => filterArticles(articles, activeFilter),
    [articles, activeFilter]
  );
  const gridArticles = filtered.filter((article) => article.slug !== featured?.slug);

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <section className="relative overflow-hidden px-4 pb-8 pt-20 sm:px-6 lg:px-10 lg:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,color-mix(in_oklab,var(--brand-orange)_22%,transparent),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_50%)]" />

        <div className="relative mx-auto max-w-350">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: smoothEase }}
          >
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.28em] text-brand-orange">
              Knowledge Hub
            </p>
            <h1 className="mt-5 max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-tight">
              Stories that{" "}
              <span className="text-brand-orange">ship</span> faster.
            </h1>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: smoothEase }}
            className="mt-10 flex flex-wrap gap-2 border-b border-white/10 pb-8"
          >
            {filters.map((filter) => {
              const active = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors duration-300",
                    active ? "text-brand-orange" : "text-white/50 hover:text-white/80"
                  )}
                >
                  {filter.id === "all" ? filter.label : articleCategoryLabels[filter.id]}
                  {active && (
                    <motion.span
                      layoutId="article-filter"
                      className="absolute inset-x-2 -bottom-8 h-0.5 bg-brand-orange"
                      transition={{ duration: 0.35, ease: smoothEase }}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-350">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: smoothEase }}
            >
              {activeFilter === "all" && featured && (
                <div className="mb-6">
                  <ArticleCard article={featured} variant="featured" />
                </div>
              )}

              {gridArticles.length > 0 ? (
                <div className="grid grid-cols-12 gap-4 lg:gap-5">
                  {gridArticles.map((article, index) => (
                    <ArticleCard key={article.slug} article={article} index={index} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/15 px-6 py-20 text-center">
                  <p className="text-lg font-medium text-white/80">Nothing here yet.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
