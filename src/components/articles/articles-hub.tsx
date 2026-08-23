"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, BookOpen, FileText, Lightbulb, Sparkles } from "lucide-react";
import type { Article } from "@/config/articles";
import { articleCategoryLabels } from "@/config/articles";
import { filterArticles, getFeaturedArticle, type HubFilter } from "@/lib/articles";
import { ArticleCard } from "@/components/articles/article-card";
import { Button } from "@/components/ui/button";
import { tryItCta } from "@/config/navigation";
import { smoothEase } from "@/components/animations/motion-presets";
import { cn } from "@/lib/utils";

const filters: { id: HubFilter; label: string; icon: typeof BookOpen }[] = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "articles", label: "Articles", icon: FileText },
  { id: "case-studies", label: "Case Studies", icon: BookOpen },
  { id: "insights", label: "Insights", icon: Lightbulb },
  { id: "agents", label: "Agents", icon: Sparkles },
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
    <main className="overflow-x-hidden">
      <section className="relative overflow-hidden bg-foreground px-4 py-20 text-background sm:px-6 lg:px-10 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--brand-orange)_30%,transparent),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.4))]" />

        <div className="relative mx-auto max-w-350">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="max-w-3xl"
          >
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">
              <BookOpen className="size-4" />
              Knowledge Hub
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Articles & case studies
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-background/75 sm:text-lg">
              Deep dives on agentic QA, enterprise rollouts, and real outcomes from teams using
              Apex Node — designed for multiple content templates as your CMS grows.
            </p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: smoothEase }}
            className="mt-10 flex flex-wrap gap-2"
          >
            {filters.map((filter) => {
              const Icon = filter.icon;
              const active = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                    active
                      ? "border-brand-orange bg-brand-orange text-foreground"
                      : "border-white/15 bg-white/5 text-background/80 hover:border-white/30 hover:bg-white/10"
                  )}
                >
                  <Icon className="size-3.5" />
                  {filter.id === "all" ? filter.label : articleCategoryLabels[filter.id]}
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-350">
          {activeFilter === "all" && featured && (
            <div className="mb-12">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">
                Featured
              </p>
              <ArticleCard article={featured} variant="featured" />
            </div>
          )}

          <motion.div
            key={activeFilter}
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1 }}
            transition={{ duration: 0.4, ease: smoothEase }}
          >
            {gridArticles.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {gridArticles.map((article, index) => (
                  <ArticleCard key={article.slug} article={article} index={index} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
                <p className="text-lg font-medium text-foreground">No pieces in this category yet.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Check back soon — new articles and case studies are added regularly.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="border-t border-border bg-surface px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-350 flex-col items-start justify-between gap-6 rounded-[1.75rem] border border-border bg-card p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">
              CMS-ready templates
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              Standard articles, case studies, insights & agent spotlights
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Each piece maps to a template your future CMS can assign on publish — same layout,
              consistent brand, zero rework.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0 gap-2">
            <Link href={tryItCta.href}>
              Talk to our team
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
