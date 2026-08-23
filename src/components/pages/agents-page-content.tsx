"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Shield, Bug, Gauge, BarChart3, Compass } from "lucide-react";
import { agents } from "@/config/agents";
import { industryAgents } from "@/config/services";
import { tryItCta } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { smoothEase } from "@/components/animations/motion-presets";

const icons = {
  sentinel: Shield,
  testbuddy: Bug,
  hermes: Gauge,
  prism: BarChart3,
  atlas: Compass,
};

export function AgentsPageContent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="bg-background">
      <section className="border-b border-border/70 bg-surface/40 px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="mx-auto max-w-350"
        >
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">Agents</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Your AI-powered QA team
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Testing, security, performance, and architecture agents that plan, run, and report on
            quality across your stack.
          </p>
          <Button asChild className="mt-6">
            <Link href={tryItCta.href}>{tryItCta.label}</Link>
          </Button>
        </motion.div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-350">
          <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-brand-orange">
            Testing agents
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => {
              const Icon = icons[agent.slug as keyof typeof icons];
              return (
                <Link
                  key={agent.slug}
                  href={`/agents/${agent.slug}`}
                  className={`group flex min-h-64 flex-col justify-between rounded-xl border border-border/80 p-5 transition-shadow hover:shadow-md ${agent.bg}`}
                >
                  <div className="flex items-start justify-between">
                    <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${agent.accent} opacity-70`}>
                      {agent.role}
                    </p>
                    <Icon className={`size-5 ${agent.accent} opacity-80`} />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-semibold ${agent.accent} ${agent.font}`}>
                      {agent.codename}
                    </h3>
                    <p className={`mt-2 text-sm leading-relaxed ${agent.accent} opacity-80`}>
                      {agent.tagline}
                    </p>
                    <span className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${agent.accent}`}>
                      Learn more
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <h2 className="mt-14 text-sm font-medium uppercase tracking-[0.16em] text-brand-orange">
            Industry agents
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {industryAgents.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-start gap-4 rounded-xl border border-border/80 bg-card p-5 transition-colors hover:border-brand-orange/30"
                >
                  <Icon className="mt-0.5 size-4 shrink-0 text-brand-orange" strokeWidth={1.75} />
                  <span>
                    <span className="block text-sm font-medium text-foreground">{item.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{item.description}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
