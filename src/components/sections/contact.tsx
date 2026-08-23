"use client";

import { ContactForm } from "@/components/forms/contact-form";
import { ContactInfoColumn } from "@/components/contact/contact-info-column";
import { ContactShell } from "@/components/contact/contact-shell";
import { CardReveal } from "@/components/animations/scroll-reveal";
import { motion, useReducedMotion } from "motion/react";
import { smoothEase } from "@/components/animations/motion-presets";

export function Contact() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-surface px-4 py-24 sm:px-6 lg:px-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--brand-orange)_14%,transparent),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.35))] dark:bg-[linear-gradient(to_bottom,transparent,rgba(10,14,23,0.35))]" />

      <div className="relative mx-auto max-w-350">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, ease: smoothEase }}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">
            Get in touch
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Ship faster with a QA partner that moves at your pace
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            From agentic test coverage to enterprise rollout — tell us where you are today and
            we&apos;ll map the shortest path to reliable releases.
          </p>
        </motion.div>

        <CardReveal delay={0.25} className="mt-14">
          <ContactShell
            info={<ContactInfoColumn />}
            form={<ContactForm variant="panel" />}
          />
        </CardReveal>
      </div>
    </section>
  );
}
