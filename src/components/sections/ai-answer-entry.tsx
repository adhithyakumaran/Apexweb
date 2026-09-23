"use client";

import { Search } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { AgentOrb } from "@/components/ai/agent-orb";
import { useAiAgent } from "@/components/ai/ai-agent-context";
import { smoothEase } from "@/components/animations/motion-presets";
import { cn } from "@/lib/utils";

function GradientSearchIcon({ className }: { className?: string }) {
  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id="ai-entry-search-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
        </defs>
      </svg>
      <Search
        className={className}
        stroke="url(#ai-entry-search-gradient)"
        strokeWidth={2.25}
      />
    </>
  );
}

export function AiAnswerEntry() {
  const { openPanel } = useAiAgent();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="relative z-20 w-full px-3 pb-3 sm:px-6 sm:pb-5 lg:px-10"
      aria-labelledby="ai-answer-heading"
    >
      <motion.div
        className="mx-auto max-w-5xl -mt-10 sm:-mt-14 lg:-mt-[4.5rem]"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: smoothEase }}
      >
        <div
          className={cn(
            "rounded-2xl border border-white/80 bg-white/92 px-4 py-5 sm:rounded-3xl sm:px-8 sm:py-6",
            "shadow-[0_24px_60px_-20px_rgba(99,102,241,0.35),0_8px_24px_-12px_rgba(15,23,42,0.12)]",
            "backdrop-blur-xl"
          )}
        >
          <div className="text-center">
            <h2
              id="ai-answer-heading"
              className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
            >
              Have tech questions?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Our{" "}
              <span className="bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text font-semibold text-transparent">
                AI answer engine
              </span>{" "}
              can help.
            </p>
          </div>

          <div className="mt-4 sm:mt-5">
            <button
              type="button"
              onClick={() => openPanel()}
              className={cn(
                "group flex h-12 w-full items-center gap-2.5 rounded-lg border border-border/70 bg-white px-2.5 sm:h-[3.25rem] sm:gap-3 sm:px-3",
                "shadow-sm transition-all duration-300",
                "hover:border-violet-200 hover:shadow-md",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
              )}
              aria-label="Open Apex Node AI answer engine"
            >
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-violet-50/80 to-indigo-50/50 sm:size-10"
                aria-hidden
              >
                <AgentOrb size="sm" />
              </span>
              <span className="min-w-0 flex-1 truncate text-left text-sm text-muted-foreground">
                Please ask a question or initiate a search
              </span>
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border/50 bg-white sm:size-10"
                aria-hidden
              >
                <GradientSearchIcon className="size-[1.125rem]" />
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
