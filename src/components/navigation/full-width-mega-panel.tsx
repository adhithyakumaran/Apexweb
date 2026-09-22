"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { MegaNavPanel } from "@/config/mega-navigation";
import { smoothEase } from "@/components/animations/motion-presets";
import { cn } from "@/lib/utils";

type Props = {
  panel: MegaNavPanel | null;
  open: boolean;
  onClose: () => void;
  onEnter: () => void;
  onLeave: () => void;
};

export function FullWidthMegaPanel({ panel, open, onClose, onEnter, onLeave }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const categories = panel?.categories ?? [];
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  useEffect(() => {
    if (open && categories.length > 0) {
      setActiveCategoryId(categories[0].id);
    }
  }, [open, panel?.id, categories]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const activeCategory =
    categories.find((c) => c.id === activeCategoryId) ?? categories[0];

  const linkColumns = activeCategory?.links ?? [];
  const mid = Math.ceil(linkColumns.length / 2);
  const colA = linkColumns.slice(0, mid);
  const colB = linkColumns.slice(mid);

  return (
    <AnimatePresence>
      {open && panel && (
        <motion.div
          role="menu"
          aria-label={panel.label}
          initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -2 }}
          transition={{ duration: 0.22, ease: smoothEase }}
          className="fixed inset-x-0 top-14 z-[60] h-[70dvh] min-h-[28rem] max-h-[42rem] border-t border-border bg-card shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:top-16"
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          <div className="mx-auto grid h-full max-w-350 grid-cols-1 gap-0 px-6 py-8 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:py-10">
            <div className="lg:col-span-3 lg:border-r lg:border-border/60 lg:pr-8">
              <p className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {panel.context.title}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                {panel.context.description}
              </p>
              {panel.context.cta && (
                <Link
                  href={panel.context.cta.href}
                  onClick={onClose}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  {panel.context.cta.label}
                  <ArrowRight className="size-4" />
                </Link>
              )}
            </div>

            {categories.length > 0 && (
              <>
                <div className="mt-6 border-t border-border/60 pt-6 lg:col-span-2 lg:mt-0 lg:border-t-0 lg:border-r lg:border-border/60 lg:pt-0 lg:pr-4">
                  <ul className="space-y-0.5">
                    {categories.map((cat) => {
                      const active = cat.id === activeCategory?.id;
                      return (
                        <li key={cat.id}>
                          <button
                            type="button"
                            className={cn(
                              "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                              active
                                ? "bg-muted text-foreground"
                                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                            )}
                            onMouseEnter={() => setActiveCategoryId(cat.id)}
                            onFocus={() => setActiveCategoryId(cat.id)}
                          >
                            {cat.label}
                            {active && (
                              <ChevronRight className="size-4 shrink-0 opacity-70" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-4 overflow-y-auto lg:col-span-7 lg:mt-0">
                  <div className="grid gap-x-10 gap-y-1 sm:grid-cols-2">
                    <ul className="space-y-1">
                      {colA.map((link) => (
                        <li key={link.href + link.label}>
                          <Link
                            href={link.href}
                            onClick={onClose}
                            className="block rounded-md px-2 py-2 text-sm font-medium text-foreground/90 transition-colors hover:bg-muted hover:text-foreground"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <ul className="space-y-1">
                      {colB.map((link) => (
                        <li key={link.href + link.label}>
                          <Link
                            href={link.href}
                            onClick={onClose}
                            className="block rounded-md px-2 py-2 text-sm font-medium text-foreground/90 transition-colors hover:bg-muted hover:text-foreground"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
