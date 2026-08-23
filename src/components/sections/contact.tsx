"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Mail, Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";
import { ContactForm } from "@/components/forms/contact-form";
import {
  StaggerItem,
  StaggerReveal,
} from "@/components/animations/scroll-reveal";
import {
  defaultTransition,
  smoothEase,
} from "@/components/animations/motion-presets";
import { Button } from "@/components/ui/button";
import { tryItCta } from "@/config/navigation";

const methods = [
  {
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    icon: Mail,
    description: "We reply within one business day",
  },
  {
    label: "Phone",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`,
    icon: Phone,
    description: "Talk to our QA specialists",
  },
  {
    label: "WhatsApp",
    value: "Instant chat",
    href: getWhatsAppLink(),
    icon: MessageCircle,
    description: "Fastest way to reach us",
  },
];

export function Contact() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="contact" className="relative w-full overflow-hidden bg-brand-orange-light px-4 py-24 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--brand-orange)_18%,transparent),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_50%)]" />

      <div className="relative mx-auto max-w-350">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: smoothEase }}
        >
          <span className="inline-flex items-center rounded-full border border-brand-orange/25 bg-card/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange-foreground backdrop-blur-sm">
            Get in touch
          </span>
          <h2 className="mt-5 text-3xl font-normal tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Ready to automate your QA workflow?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tell us about your release goals. We&apos;ll help you design an
            agentic testing strategy that scales with your team.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: -24 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: smoothEase }}
            className="flex flex-col gap-6"
          >
            <StaggerReveal className="flex flex-col gap-4" stagger={0.1}>
              {methods.map((m) => {
                const Icon = m.icon;
                const isExternal = m.href.startsWith("http");
                return (
                  <StaggerItem key={m.label}>
                    <a
                      href={m.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-4 rounded-2xl border border-brand-orange/20 bg-card/90 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-orange/40 hover:shadow-md"
                    >
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange transition-transform duration-300 group-hover:scale-105">
                        <Icon className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">{m.label}</p>
                        <p className="truncate text-sm text-foreground/80">{m.value}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{m.description}</p>
                      </div>
                      <ArrowRight className="size-4 shrink-0 text-brand-orange opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </a>
                  </StaggerItem>
                );
              })}
            </StaggerReveal>

            <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange-muted/60 p-6">
              <p className="text-sm font-medium text-brand-orange-foreground">
                Prefer a live walkthrough?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Book a demo and see our agents in action on your use cases.
              </p>
              <Button asChild size="lg" className="mt-4">
                <Link href={tryItCta.href}>{tryItCta.label}</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-3xl border border-brand-orange/20 bg-card p-8 shadow-lg sm:p-10"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...defaultTransition, delay: 0.1 }}
          >
            <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-brand-orange/10 blur-3xl" />
            <div className="relative mb-6">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                Send us a message
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Share your stack, timeline, and testing challenges.
              </p>
            </div>
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
