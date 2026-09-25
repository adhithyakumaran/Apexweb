"use client";

import { motion, useReducedMotion } from "motion/react";
import { partners, type PartnerWordmark } from "@/config/partners";
import { PartnerWordmark as PartnerWordmarkVisual } from "@/components/sections/partner-wordmark";
import { SectionHeader } from "@/components/animations/section-header";
import { smoothEase } from "@/components/animations/motion-presets";
import { cn } from "@/lib/utils";

function MarqueeRow({
  items,
  direction,
}: {
  items: PartnerWordmark[];
  direction: "left" | "right";
}) {
  const prefersReducedMotion = useReducedMotion();
  const track = [...items, ...items];

  return (
    <div className="relative overflow-hidden" aria-hidden="true">
      <div
        className={cn(
          "flex w-max items-center gap-16 py-2 will-change-transform sm:gap-24 md:gap-28",
          !prefersReducedMotion &&
            (direction === "left" ? "animate-partner-marquee-left" : "animate-partner-marquee-right")
        )}
      >
        {track.map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="flex shrink-0 items-center justify-center px-2 sm:px-4"
          >
            <div className="flex min-w-[9rem] flex-col items-center sm:min-w-[11rem]">
              <PartnerWordmarkVisual id={partner.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TrustedPartners() {
  const prefersReducedMotion = useReducedMotion();
  const rowOne = partners;
  const rowTwo = [...partners].reverse();

  return (
    <section
      className="relative w-full overflow-hidden bg-background px-4 py-24 sm:px-6 lg:px-10"
      aria-labelledby="trusted-partners-heading"
    >
      <div className="relative mx-auto max-w-350">
        <SectionHeader
          delay={0.2}
          title={
            <>
              <span id="trusted-partners-heading">
                Built for modern, client-obsessed,{" "}
                <br className="hidden sm:block" />
                revenue-responsible delivery teams
              </span>
            </>
          }
        />
        <p className="sr-only">
          Partner brands: {partners.map((p) => p.name).join(", ")}
        </p>

        <motion.div
          className="group/marquee relative mt-14 sm:mt-16"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, delay: 0.2, ease: smoothEase }}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-background to-transparent sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-background to-transparent sm:w-20" />

          <div
            className="space-y-12 sm:space-y-16 md:space-y-[4.5rem] motion-reduce:space-y-8 [&_.animate-partner-marquee-left]:group-hover/marquee:[animation-play-state:paused] [&_.animate-partner-marquee-right]:group-hover/marquee:[animation-play-state:paused]"
          >
            <MarqueeRow items={rowOne} direction="left" />
            <MarqueeRow items={rowTwo} direction="right" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
