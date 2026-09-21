"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiAnswerEngineCard } from "@/components/sections/ai-answer-engine";
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
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: smoothEase },
        };

  return (
    <section className="w-full px-4 pt-6 sm:px-6 lg:px-10 lg:pt-10">
      <div className="mx-auto grid max-w-350 grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <motion.div
          className="flex flex-col gap-6"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1 }}
          transition={{ duration: 0.6, ease: smoothEase }}
        >
          <motion.p
            {...fadeUp(0.05)}
            className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground"
          >
            Enterprise agentic QA
          </motion.p>
          <motion.h1
            {...fadeUp(0.12)}
            className="text-4xl font-semibold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]"
          >
            Accelerate software quality with AI-powered testing agents.
          </motion.h1>

          <motion.p
            {...fadeUp(0.22)}
            className="max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Autonomous testing agents that turn complex QA workflows into faster,
            smarter, and more reliable validation—built for modern delivery teams.
          </motion.p>

          <motion.div
            {...fadeUp(0.32)}
            className="flex flex-wrap items-center gap-4"
          >
            <Button asChild size="xl">
              <Link href={tryItCta.href}>
                Book a demo
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                {whatsappCta.label}
              </a>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          {...fadeUp(0.2)}
          className="w-full lg:max-w-lg lg:justify-self-end"
        >
          <AiAnswerEngineCard />
        </motion.div>
      </div>
    </section>
  );
}
