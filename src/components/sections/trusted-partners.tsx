"use client";

import { motion, useReducedMotion } from "motion/react";
import { partners } from "@/config/partners";
import { PartnerWordmark } from "@/components/sections/partner-wordmark";
import { SectionHeader } from "@/components/animations/section-header";
import { smoothEase } from "@/components/animations/motion-presets";

export function TrustedPartners() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative w-full bg-background px-4 py-24 sm:px-6 lg:px-10">
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
          className="mt-16"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 36 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, delay: 0.45, ease: smoothEase }}
        >
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-surface/40">
            <div className="grid grid-cols-2 divide-x divide-y divide-border/70 md:grid-cols-3">
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.id}
                  className="group flex h-36 items-center justify-center bg-background px-5 transition-colors duration-500 hover:bg-surface sm:h-40"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.75,
                    delay: 0.55 + index * 0.1,
                    ease: smoothEase,
                  }}
                >
                  <PartnerWordmark id={partner.id} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
