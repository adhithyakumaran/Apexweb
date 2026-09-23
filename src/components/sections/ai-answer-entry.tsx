"use client";

import { Search } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { AgentOrb } from "@/components/ai/agent-orb";
import { useAiAgent } from "@/components/ai/ai-agent-context";
import { smoothEase } from "@/components/animations/motion-presets";
import { cn } from "@/lib/utils";

export function AiAnswerEntry() {
  const { openPanel } = useAiAgent();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="relative z-20 w-full px-3 pb-4 sm:px-6 sm:pb-6 lg:px-10"
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
            "rounded-2xl border border-white/80 bg-white/92 px-5 py-8 sm:rounded-3xl sm:px-10 sm:py-10",
            "shadow-[0_24px_60px_-20px_rgba(99,102,241,0.35),0_8px_24px_-12px_rgba(15,23,42,0.12)]",
            "backdrop-blur-xl"
          )}
        >
          <div className="text-center">
            <h2
              id="ai-answer-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]"
            >
              Have tech questions?
            </h2>
            <p className="mt-2 text-base text-muted-foreground sm:text-lg">
              Our{" "}
              <span className="bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text font-semibold text-transparent">
                AI answer engine
              </span>{" "}
              can help.
            </p>
          </div>

          <div className="mt-7 sm:mt-8">
            <button
              type="button"
              onClick={() => openPanel()}
              className={cn(
                "group flex w-full items-center gap-3 rounded-2xl bg-white p-2 pl-3 sm:gap-4 sm:p-2.5 sm:pl-3.5",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_40px_-12px_rgba(99,102,241,0.28)]",
                "ring-1 ring-violet-100/90 transition-all duration-300",
                "hover:-translate-y-0.5 hover:shadow-[0_16px_48px_-14px_rgba(99,102,241,0.38)] hover:ring-violet-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
              )}
              aria-label="Open Apex Node AI answer engine"
            >
              <span
                className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-50 via-white to-indigo-50 ring-1 ring-violet-100/80 sm:size-[3.25rem]"
                aria-hidden
              >
                <AgentOrb size="md" />
              </span>
              <span className="min-w-0 flex-1 truncate text-left text-sm text-muted-foreground sm:text-base">
                Please ask a question or initiate a search
              </span>
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform duration-300 group-hover:scale-[1.02] sm:size-12"
                aria-hidden
              >
                <Search className="size-[1.125rem]" strokeWidth={2.25} />
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
