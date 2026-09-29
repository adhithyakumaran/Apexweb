"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroAgentFlow } from "@/components/hero/hero-agent-flow";
import { tryItCta, whatsappCta } from "@/config/navigation";
import { smoothEase } from "@/components/animations/motion-presets";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 36 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.75, delay, ease: smoothEase },
        };

  return (
    <section className="relative z-10 w-full px-3 pt-2 pb-0 sm:px-6 sm:pt-3 lg:px-10 lg:pt-4">
      <motion.div
        className="relative flex min-h-[min(72dvh,40rem)] w-full max-w-full overflow-hidden rounded-2xl sm:min-h-[min(80dvh,44rem)] sm:rounded-3xl lg:min-h-[min(85dvh,48rem)]"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: smoothEase }}
      >
        <div
          className="absolute inset-0 bg-linear-to-br from-violet-700 via-violet-500 to-white"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_20%,rgba(255,255,255,0.45),transparent_55%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_90%_80%,rgba(255,255,255,0.55),transparent_50%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-b from-transparent to-background/80 sm:h-24"
          aria-hidden
        />

        <div className="relative z-10 grid w-full grid-cols-1 items-center gap-8 px-4 py-10 sm:px-8 sm:py-12 lg:grid-cols-2 lg:gap-6 lg:px-12 lg:py-14">
          <div className="flex flex-col items-center gap-4 text-center sm:gap-6 lg:items-start lg:text-left">
            <motion.h1
              {...fadeUp(0.15)}
              className="text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-white [text-shadow:0_2px_16px_rgba(76,29,149,0.35)] sm:text-4xl md:text-5xl lg:text-6xl"
            >
              Accelerate Software Quality with AI-Powered Testing Agents.
            </motion.h1>

            <motion.p
              {...fadeUp(0.3)}
              className="max-w-xl text-base text-white/95 [text-shadow:0_1px_10px_rgba(76,29,149,0.25)] sm:text-lg"
            >
              Autonomous testing agents that turn complex QA workflows into
              faster, smarter, and more reliable validation.
            </motion.p>

            <motion.div
              {...fadeUp(0.45)}
              className="mt-2 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 lg:justify-start"
            >
              <Button
                asChild
                size="xl"
                className="border-2 border-white/90 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
              >
                <Link href="/contact">{whatsappCta.label}</Link>
              </Button>
              <Button
                asChild
                size="xl"
                className="gap-3 border-0 bg-white pr-2 text-violet-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
              >
                <Link href={tryItCta.href}>
                  Book a demo
                  <span className="flex size-8 items-center justify-center rounded-full bg-violet-600 text-white transition-transform duration-300 group-hover/button:translate-x-0.5">
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            {...fadeUp(0.55)}
            className="flex w-full items-center justify-center lg:justify-end"
          >
            <HeroAgentFlow />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
