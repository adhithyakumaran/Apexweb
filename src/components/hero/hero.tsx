"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentCursor } from "@/components/hero/agent-cursor";
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
    <section className="w-full px-3 pt-2 sm:px-6 sm:pt-3 lg:px-10 lg:pt-4">
      <motion.div
        className="relative flex min-h-[min(72dvh,40rem)] w-full max-w-full items-center justify-center overflow-hidden rounded-2xl bg-secondary sm:min-h-[min(80dvh,44rem)] sm:rounded-3xl md:cursor-none lg:min-h-[min(85dvh,48rem)]"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: smoothEase }}
      >
        <AgentCursor />

        <Image
          src="/images/hero/hero-new-bg.png"
          alt=""
          fill
          priority
          className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-105"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/5 to-black/25" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-black/45" />

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-4 px-4 text-center sm:gap-6 sm:px-6">
          <motion.h1
            {...fadeUp(0.15)}
            className="text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.35)] sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Accelerate Software Quality with AI-Powered Testing Agents.
          </motion.h1>

          <motion.p
            {...fadeUp(0.3)}
            className="max-w-2xl text-base text-white/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.35)] sm:text-lg"
          >
            Autonomous testing agents that turn complex QA workflows into
            faster, smarter, and more reliable validation.
          </motion.p>

          <motion.div
            {...fadeUp(0.45)}
            className="mt-2 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <Button
              asChild
              size="xl"
              className="border-2 border-white bg-transparent text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
            >
              <Link href="/contact">{whatsappCta.label}</Link>
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
      </motion.div>
    </section>
  );
}
