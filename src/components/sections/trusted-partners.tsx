"use client";

import { motion, useReducedMotion } from "motion/react";
import { partners } from "@/config/partners";
import { PartnerWordmark } from "@/components/sections/partner-wordmark";
import { SectionHeader } from "@/components/animations/section-header";
import { smoothEase } from "@/components/animations/motion-presets";

const cellAccents = [
  "from-primary/5 to-transparent",
  "from-brand-orange/5 to-transparent",
  "from-success/5 to-transparent",
  "from-primary/5 to-transparent",
  "from-brand-orange/5 to-transparent",
  "from-success/5 to-transparent",
];

export function TrustedPartners() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden bg-surface px-4 py-24 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--primary)_6%,transparent),transparent_50%)]" />

      <div className="relative mx-auto max-w-350">
        <SectionHeader
          delay={0.2}
          title={
            <>
              Built for modern, client-obsessed,{" "}
              <br className="hidden sm:block" />
              revenue-responsible delivery teams
            </>
          }
        />

        <motion.div
          className="relative mt-16 overflow-hidden rounded-3xl border border-border/80 bg-background p-3 shadow-[0_20px_60px_-24px_color-mix(in_oklab,var(--foreground)_18%,transparent)] sm:p-4"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 40, scale: 0.98 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.45, ease: smoothEase }}
        >
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border md:grid-cols-3">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.id}
                className={`group relative flex h-32 items-center justify-center bg-linear-to-br ${cellAccents[index]} bg-background px-4 transition-colors duration-500 hover:bg-muted/40 sm:h-36`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.75,
                  delay: 0.55 + index * 0.1,
                  ease: smoothEase,
                }}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : { y: -3, transition: { duration: 0.25, ease: smoothEase } }
                }
              >
                <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-brand-orange/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <PartnerWordmark id={partner.id} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
