"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  aiPlatforms,
  coreServices,
  industryAgents,
  type ServiceItem,
} from "@/config/services";
import { tryItCta } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { smoothEase } from "@/components/animations/motion-presets";

function ServiceBlock({ item }: { item: ServiceItem }) {
  const Icon = item.icon;
  const id = item.href.split("#")[1];

  return (
    <article id={id} className="scroll-mt-24 rounded-xl border border-border/80 bg-card p-6">
      <div className="flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
        <div>
          <h3 className="text-lg font-medium text-foreground">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        </div>
      </div>
    </article>
  );
}

function ServiceSection({ title, items }: { title: string; items: ServiceItem[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-brand-orange">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <ServiceBlock key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}

export function ServicesPageContent() {
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
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">Services</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            What we do
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Enterprise modernization, AI platforms, and quality engineering — built to scale with
            your product roadmap.
          </p>
          <Button asChild className="mt-6">
            <Link href={tryItCta.href}>{tryItCta.label}</Link>
          </Button>
        </motion.div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-350 space-y-14">
          <ServiceSection title="Core services" items={coreServices} />
          <ServiceSection title="AI accelerator platforms" items={aiPlatforms} />
          <ServiceSection title="Industry-specific agents" items={industryAgents} />
        </div>
      </section>
    </main>
  );
}
