"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Mail, Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";
import { ContactForm } from "@/components/forms/contact-form";
import {
  CardReveal,
  StaggerItem,
  StaggerReveal,
} from "@/components/animations/scroll-reveal";
import { SectionHeader } from "@/components/animations/section-header";
import { smoothEase } from "@/components/animations/motion-presets";
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
        <SectionHeader
          eyebrow="Get in touch"
          title="Ready to automate your QA workflow?"
          description="Tell us about your release goals. We'll help you design an agentic testing strategy that scales with your team."
          delay={0.15}
        />

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
          <StaggerReveal className="flex flex-col gap-6" stagger={0.12} delay={0.35}>
            {methods.map((m) => {
              const Icon = m.icon;
              const isExternal = m.href.startsWith("http");
              return (
                <StaggerItem key={m.label}>
                  <motion.a
                    href={m.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-2xl border border-brand-orange/20 bg-card/90 p-5 shadow-sm backdrop-blur-sm transition-all duration-500 hover:border-brand-orange/40 hover:shadow-lg"
                    whileHover={
                      prefersReducedMotion
                        ? undefined
                        : { y: -4, transition: { duration: 0.3, ease: smoothEase } }
                    }
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange transition-transform duration-500 group-hover:scale-110">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">{m.label}</p>
                      <p className="truncate text-sm text-foreground/80">{m.value}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{m.description}</p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-brand-orange opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </motion.a>
                </StaggerItem>
              );
            })}

            <StaggerItem>
              <motion.div
                className="rounded-2xl border border-brand-orange/20 bg-brand-orange-muted/60 p-6"
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : { scale: 1.01, transition: { duration: 0.3, ease: smoothEase } }
                }
              >
                <p className="text-sm font-medium text-brand-orange-foreground">
                  Prefer a live walkthrough?
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Book a demo and see our agents in action on your use cases.
                </p>
                <Button asChild size="lg" className="mt-4">
                  <Link href={tryItCta.href}>{tryItCta.label}</Link>
                </Button>
              </motion.div>
            </StaggerItem>
          </StaggerReveal>

          <CardReveal delay={0.4}>
            <div className="relative overflow-hidden rounded-3xl border border-brand-orange/20 bg-card p-8 shadow-lg transition-shadow duration-500 hover:shadow-xl sm:p-10">
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
            </div>
          </CardReveal>
        </div>
      </div>
    </section>
  );
}
