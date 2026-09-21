"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Mail, Phone, MessageCircle, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";
import {
  StaggerItem,
  StaggerReveal,
} from "@/components/animations/scroll-reveal";
import { smoothEase } from "@/components/animations/motion-presets";
import { Button } from "@/components/ui/button";
import { tryItCta } from "@/config/navigation";
import { useAiAssistantOptional } from "@/components/ai/ai-context";
import { AiAnswerEngineCard } from "@/components/sections/ai-answer-engine";

const methods = [
  {
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    icon: Mail,
  },
  {
    label: "Phone",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`,
    icon: Phone,
  },
  {
    label: "WhatsApp",
    value: "Message us",
    href: getWhatsAppLink(),
    icon: MessageCircle,
  },
];

export function Contact() {
  const prefersReducedMotion = useReducedMotion();
  const ai = useAiAssistantOptional();

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden px-4 py-24 sm:px-6 lg:px-10"
    >
      <div className="relative mx-auto max-w-350">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: smoothEase }}
        >
          <h2 className="text-3xl font-normal tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Ship faster with a QA partner that moves at your pace
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Let&apos;s discuss your QA workflow, current testing stack, and where
            agentic automation can help.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <StaggerReveal className="flex flex-col gap-4" stagger={0.08}>
            {methods.map((m) => {
              const Icon = m.icon;
              const isExternal = m.href.startsWith("http");
              return (
                <StaggerItem key={m.label}>
                  <a
                    href={m.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">{m.label}</p>
                      <p className="truncate text-sm text-muted-foreground">{m.value}</p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-primary opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </a>
                </StaggerItem>
              );
            })}

            <StaggerItem>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg">
                  <Link href={tryItCta.href}>Talk to Apex Node</Link>
                </Button>
                {ai && (
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    onClick={() => ai.openPanel()}
                  >
                    <Sparkles className="size-4" />
                    Ask AI
                  </Button>
                )}
              </div>
            </StaggerItem>
          </StaggerReveal>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: smoothEase }}
          >
            <AiAnswerEngineCard compact />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
