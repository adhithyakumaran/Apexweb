"use client";

import { motion, useReducedMotion } from "motion/react";
import { CheckCheck } from "lucide-react";
import { testimonials } from "@/config/testimonials";
import { SectionHeader } from "@/components/animations/section-header";
import { StaggerItem, StaggerReveal } from "@/components/animations/scroll-reveal";
import { smoothEase } from "@/components/animations/motion-presets";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Testimonials() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-350">
        <SectionHeader
          eyebrow="What our partners say"
          title="Straight from the people we work with"
          delay={0.15}
        />

        <StaggerReveal className="mx-auto mt-16 flex max-w-2xl flex-col gap-8" stagger={0.14} delay={0.3}>
          {testimonials.map((t) => (
            <StaggerItem key={t.company}>
              <motion.div
                className="flex items-start gap-3"
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : { x: 4, transition: { duration: 0.3, ease: smoothEase } }
                }
              >
                <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary transition-transform duration-300">
                  {initials(t.contact)}
                </span>

                <div className="flex-1">
                  <div className="relative w-fit max-w-full rounded-2xl rounded-tl-sm bg-muted px-5 py-4 shadow-sm transition-all duration-500 hover:shadow-md">
                    <p className="text-sm leading-relaxed text-foreground sm:text-base">
                      {t.quote}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-2 pl-1">
                    <p className="text-xs font-medium text-foreground">{t.contact}</p>
                    <span className="text-xs text-muted-foreground">· {t.company}</span>
                    <CheckCheck className="size-3.5 text-brand-orange" />
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
