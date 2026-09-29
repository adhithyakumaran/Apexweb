"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentCursor } from "@/components/hero/agent-cursor";
import { Hero3DVisual } from "@/components/hero/hero-3d-visual";
import { tryItCta, whatsappCta } from "@/config/navigation";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";
import { smoothEase } from "@/components/animations/motion-presets";

export function Hero() {
  const whatsappHref = getWhatsAppLink();
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
    <section className="w-full px-4 pt-2 sm:px-6 sm:pt-3 lg:px-10 lg:pt-4">
      <motion.div
        className="relative flex h-[85vh] min-h-140 w-full cursor-none overflow-hidden rounded-3xl bg-[#070d18]"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: smoothEase }}
      >
        <AgentCursor />

        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_85%,rgba(34,211,238,0.55),transparent_55%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_92%_12%,rgba(59,130,246,0.5),transparent_50%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(147,197,253,0.25),transparent_60%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-linear-to-b from-transparent via-[#070d18]/20 to-background"
          aria-hidden="true"
        />

        <div className="relative z-10 grid h-full w-full grid-cols-1 items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:gap-8 lg:px-14 lg:py-16">
          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            <motion.h1
              {...fadeUp(0.15)}
              className="text-4xl font-semibold leading-[1.15] tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-6xl"
            >
              Accelerate Software Quality with AI-Powered Testing Agents.
            </motion.h1>

            <motion.p
              {...fadeUp(0.3)}
              className="max-w-xl text-lg text-white/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.35)]"
            >
              Autonomous testing agents that turn complex QA workflows into
              faster, smarter, and more reliable validation.
            </motion.p>

            <motion.div
              {...fadeUp(0.45)}
              className="mt-2 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            >
              <Button
                asChild
                size="xl"
                className="border-2 border-white bg-transparent text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
              >
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  {whatsappCta.label}
                </a>
              </Button>
              <Button
                asChild
                size="xl"
                className="gap-3 border-0 bg-white pr-2 text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
              >
                <Link href={tryItCta.href}>
                  Book a demo
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary text-white transition-transform duration-300 group-hover/button:translate-x-0.5">
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            {...fadeUp(0.55)}
            className="relative flex h-full min-h-[260px] w-full items-center justify-center lg:min-h-0"
          >
            <Hero3DVisual />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
