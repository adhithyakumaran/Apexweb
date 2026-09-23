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
    <section className="relative w-full px-3 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div
        className="pointer-events-none absolute inset-x-3 top-0 -z-10 h-full rounded-3xl bg-linear-to-b from-[#0f172a] via-[#312e81]/25 to-transparent sm:inset-x-6 lg:inset-x-10"
        aria-hidden
      />

      <motion.div
        className="mx-auto max-w-5xl rounded-2xl border border-white/40 bg-white/55 px-5 py-10 shadow-[0_24px_80px_rgba(49,46,129,0.12)] backdrop-blur-md sm:rounded-3xl sm:px-10 sm:py-12"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.65, ease: smoothEase }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Have tech questions?
          </h2>
          <p className="mt-2 text-base text-muted-foreground sm:text-lg">
            Our{" "}
            <span className="font-semibold text-primary">AI answer engine</span> can help.
          </p>
        </div>

        <div className="mt-8 sm:mt-10">
          <button
            type="button"
            onClick={() => openPanel()}
            className={cn(
              "group flex w-full items-center gap-3 rounded-full border border-border/80 bg-muted/50 px-3 py-2.5 text-left shadow-sm transition-colors",
              "hover:border-primary/30 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            )}
            aria-label="Open Apex Node AI answer engine"
          >
            <AgentOrb size="md" />
            <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground sm:text-base">
              Please ask a question or initiate a search
            </span>
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
              aria-hidden
            >
              <Search className="size-4" />
            </span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}
