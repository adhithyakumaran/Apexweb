"use client";

import { motion, useReducedMotion } from "motion/react";
import { CheckCheck } from "lucide-react";
import { testimonials } from "@/config/testimonials";
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
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: smoothEase }}
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            What our partners say
          </p>
          <h2 className="mt-4 text-3xl font-normal tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Straight from the people we work with
          </h2>
        </motion.div>

        <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.company}
              initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: smoothEase }}
              className="flex items-start gap-3"
            >
              <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {initials(t.contact)}
              </span>

              <div className="flex-1">
                <div className="relative w-fit max-w-full rounded-2xl rounded-tl-sm bg-muted px-5 py-4 transition-shadow duration-300 hover:shadow-md">
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
          ))}
        </div>
      </div>
    </section>
  );
}