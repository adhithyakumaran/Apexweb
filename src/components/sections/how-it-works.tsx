"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Bot,
  Workflow,
  GitBranch,
  FileCheck2,
  ArrowRight,
} from "lucide-react";
import { smoothEase } from "@/components/animations/motion-presets";

const workflow = [
  {
    icon: Workflow,
    title: "Map the workflow",
    text: "Give Apex the application, user journey, or critical release path you want to validate.",
  },
  {
    icon: Bot,
    title: "Let agents explore",
    text: "AI agents discover scenarios, exercise the product, and turn real workflows into repeatable coverage.",
  },
  {
    icon: GitBranch,
    title: "Run with every change",
    text: "Bring automated validation into your development cycle so regressions are found closer to the moment they are introduced.",
  },
  {
    icon: FileCheck2,
    title: "Understand the result",
    text: "Get structured evidence and actionable signals instead of a pile of disconnected test output.",
  },
];

const outcomes = [
  "Less repetitive manual QA",
  "Broader end-to-end coverage",
  "Faster feedback on releases",
  "A clearer view of product quality",
];

export function HowItWorks() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-surface px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-350">
        <motion.div
          className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: smoothEase }}
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-orange-foreground">
              From intent to evidence
            </p>
            <h2 className="mt-4 text-3xl font-normal tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              QA that works with your delivery cycle, not around it.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Apex Node brings AI agents into the parts of testing that consume
            the most team attention: understanding workflows, creating
            coverage, executing scenarios, and turning results into decisions.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {workflow.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                  ease: smoothEase,
                }}
                className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-[0.15em] text-muted-foreground">
                    0{index + 1}
                  </span>
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                </div>
                <h3 className="mt-10 text-lg font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          className="mt-8 flex flex-col gap-6 rounded-3xl bg-secondary p-7 text-secondary-foreground sm:p-9 lg:flex-row lg:items-center lg:justify-between"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: smoothEase }}
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand-orange">
              The outcome
            </p>
            <h3 className="mt-2 text-2xl font-normal tracking-tight sm:text-3xl">
              Spend less time maintaining tests. Spend more time improving the product.
            </h3>
          </div>

          <div className="grid shrink-0 gap-2 sm:grid-cols-2">
            {outcomes.map((outcome) => (
              <div key={outcome} className="flex items-center gap-2 text-sm text-secondary-foreground/80">
                <ArrowRight className="size-4 shrink-0 text-brand-orange" />
                <span>{outcome}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
