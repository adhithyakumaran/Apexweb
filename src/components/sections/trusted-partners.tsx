"use client";

import { motion, useReducedMotion } from "motion/react";
import { smoothEase } from "@/components/animations/motion-presets";
import { cn } from "@/lib/utils";

const partners = [
  "Geetham Enterprises",
  "SwayUp Software Agency",
  "Prowess IQ Pvt Ltd",
  "BorrowBox",
  "Grewbie Technologies",
];

const rowOne = [...partners, ...partners];
const rowTwo = [...partners.slice().reverse(), ...partners.slice().reverse()];

function MarqueeRow({
  items,
  direction,
  className,
}: {
  items: string[];
  direction: "left" | "right";
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      aria-hidden="true"
    >
      <div
        className={cn(
          "flex w-max items-center gap-12 sm:gap-16",
          !prefersReducedMotion &&
            (direction === "left" ? "animate-marquee-left" : "animate-marquee-right"),
          "motion-reduce:transform-none"
        )}
      >
        {items.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="shrink-0 text-xl font-semibold tracking-tight text-foreground/65 sm:text-2xl"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TrustedPartners() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full overflow-hidden pb-28 pt-20" aria-labelledby="partners-heading">
      <div className="mx-auto max-w-350 px-4 text-center sm:px-6 lg:px-10">
        <motion.p
          id="partners-heading"
          className="mx-auto max-w-2xl text-2xl font-normal leading-snug tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          Built for modern, client-obsessed, <br className="hidden sm:block" />
          revenue-responsible delivery teams
        </motion.p>
        <p className="sr-only">
          Partner organizations: {partners.join(", ")}
        </p>
      </div>

      <motion.div
        className="group relative mt-16 space-y-6"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-background to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-background to-transparent sm:w-24" />

        <div className="transition-[filter] duration-300 group-hover:[&_.animate-marquee-left]:[animation-play-state:paused] group-hover:[&_.animate-marquee-right]:[animation-play-state:paused]">
          <MarqueeRow items={rowOne} direction="left" />
          <MarqueeRow items={rowTwo} direction="right" className="mt-4 opacity-80" />
        </div>
      </motion.div>
    </section>
  );
}
