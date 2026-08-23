"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { partners, PARTNER_CYCLE_S } from "@/config/partners";
import { PartnerWordmark } from "@/components/sections/partner-wordmark";
import { smoothEase } from "@/components/animations/motion-presets";

function PartnerCell({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="flex h-28 items-center justify-center px-6 sm:h-32">{children}</div>
    );
  }

  return (
    <div className="relative flex h-28 items-center justify-center overflow-hidden px-6 sm:h-32">
      <motion.div
        className="flex w-full items-center justify-center"
        animate={{
          y: [18, 0, 0, 18],
          opacity: [0, 1, 1, 0],
          scale: [0.94, 1, 1, 0.94],
        }}
        transition={{
          duration: PARTNER_CYCLE_S,
          times: [0, 0.18, 0.72, 1],
          repeat: Infinity,
          ease: smoothEase,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function TrustedPartners() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-surface px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-350">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          <h2 className="text-2xl font-normal leading-snug tracking-tight text-foreground sm:text-3xl sm:leading-snug lg:text-4xl lg:leading-normal">
            Built for modern, client-obsessed,{" "}
            <br className="hidden sm:block" />
            revenue-responsible delivery teams
          </h2>
        </motion.div>

        <motion.div
          className="mt-16 overflow-hidden rounded-2xl border border-border bg-background"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, delay: 0.1, ease: smoothEase }}
        >
          <div className="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-3">
            {partners.map((partner) => (
              <PartnerCell key={partner.id}>
                <PartnerWordmark id={partner.id} />
              </PartnerCell>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
