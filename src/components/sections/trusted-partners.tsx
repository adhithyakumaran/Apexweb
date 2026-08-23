"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { partners } from "@/config/partners";
import { smoothEase } from "@/components/animations/motion-presets";

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
              <div
                key={partner.name}
                className="group flex h-28 items-center justify-center px-6 sm:h-32"
              >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={partner.width ?? 140}
                    height={partner.height ?? 40}
                    className="max-h-10 w-auto object-contain opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 sm:max-h-12"
                  />
                </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
