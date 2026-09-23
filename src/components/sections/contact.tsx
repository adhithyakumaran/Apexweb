"use client";

import Link from "next/link";
import { ContactInfoColumn } from "@/components/contact/contact-info-column";
import { motion, useReducedMotion } from "motion/react";
import { smoothEase } from "@/components/animations/motion-presets";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { tryItCta } from "@/config/navigation";

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
          className="mt-12 rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm sm:mt-14 sm:p-8 lg:p-10"
        >
          <ContactInfoColumn showLogo={false} showBadge={false} />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-border/70 pt-8">
            <Button asChild size="lg">
              <Link href={tryItCta.href}>
                Talk to Apex Node
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Send a message</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
