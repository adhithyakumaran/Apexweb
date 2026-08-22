"use client";

import { motion } from "motion/react";
import { CheckCheck } from "lucide-react";
import { testimonials } from "@/config/testimonials";

const BRAND_ORANGE = "#f97316";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Testimonials() {
  return (
    <section className="w-full px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-350">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            What our partners say
          </p>
          <h2 className="mt-4 text-3xl font-normal tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Straight from the people we work with
          </h2>
        </div>

        <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.company}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              className="flex items-start gap-3"
            >
              <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {initials(t.contact)}
              </span>

              <div className="flex-1">
                <div className="relative w-fit max-w-full rounded-2xl rounded-tl-sm bg-muted px-5 py-4">
                  <p className="text-sm leading-relaxed text-foreground sm:text-base">
                    {t.quote}
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-2 pl-1">
                  <p className="text-xs font-medium text-foreground">{t.contact}</p>
                  <span className="text-xs text-muted-foreground">· {t.company}</span>
                  <CheckCheck className="size-3.5" style={{ color: BRAND_ORANGE }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}