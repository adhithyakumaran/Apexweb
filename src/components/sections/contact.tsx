"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { smoothEase } from "@/components/animations/motion-presets";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { tryItCta } from "@/config/navigation";
import {
  contactMethods,
  officeHours,
  socialLinks,
} from "@/config/contact";
const socialLabels: Record<string, string> = {
  LinkedIn: "in",
  X: "X",
  YouTube: "YT",
};

export function Contact() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="contact"
      className="relative w-full overflow-x-clip px-3 py-16 sm:px-6 sm:py-24 lg:px-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--primary)_8%,transparent),transparent_50%)]" />

      <div className="relative mx-auto max-w-350">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, ease: smoothEase }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">
            Get in touch
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Ship faster with a QA partner that moves at your pace
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Let&apos;s discuss your QA workflow, current testing stack, and where agentic
            automation can help.
          </p>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, delay: 0.1, ease: smoothEase }}
          className="mt-12 rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm sm:mt-14 sm:p-7 lg:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <a
                  key={method.id}
                  href={method.href}
                  target={method.external ? "_blank" : undefined}
                  rel={method.external ? "noopener noreferrer" : undefined}
                  className="group flex h-full min-h-[8.5rem] flex-col rounded-xl border border-border/70 bg-background/60 p-4 transition-all duration-300 hover:border-primary/25 hover:bg-background hover:shadow-sm sm:p-5"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg bg-foreground text-background shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <span className="mt-3 text-sm font-semibold text-foreground">{method.label}</span>
                  <span className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {method.headline}
                  </span>
                  <span className="mt-auto pt-3 text-sm font-medium leading-snug text-foreground underline-offset-4 transition-colors group-hover:text-brand-orange group-hover:underline">
                    {method.value}
                  </span>
                </a>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 border-t border-border/70 pt-6 lg:grid-cols-12 lg:items-center lg:gap-6">
            <div className="rounded-xl border border-border/70 bg-muted/40 px-4 py-3.5 lg:col-span-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Response time
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                Under 24 hours on business days
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{officeHours}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:col-span-3">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold text-muted-foreground transition-all duration-300 hover:border-brand-orange/40 hover:bg-brand-orange/10 hover:text-brand-orange"
                  aria-label={link.label}
                >
                  {socialLabels[link.label] ?? link.label.slice(0, 2)}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href={tryItCta.href}>
                  Talk to Apex Node
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/contact">Send a message</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
