"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { ContactInfoColumn } from "@/components/contact/contact-info-column";
import { ContactMap } from "@/components/contact/contact-map";
import { ContactShell } from "@/components/contact/contact-shell";
import { CardReveal, StaggerItem, StaggerReveal } from "@/components/animations/scroll-reveal";
import { Button } from "@/components/ui/button";
import { contactMethods, officeHours } from "@/config/contact";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";
import { tryItCta } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { smoothEase } from "@/components/animations/motion-presets";

const quickActions = [
  {
    label: "Call us",
    description: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`,
    icon: Phone,
    accent: "from-brand-orange/20 to-brand-orange/5",
  },
  {
    label: "WhatsApp",
    description: "Instant chat with our QA team",
    href: getWhatsAppLink(),
    icon: MessageCircle,
    external: true,
    accent: "from-emerald-500/15 to-emerald-500/5",
  },
  {
    label: "Email",
    description: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    icon: Mail,
    accent: "from-primary/15 to-primary/5",
  },
  {
    label: "Visit",
    description: "Chennai office · Tidel Park",
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Tidel Park, Chennai")}`,
    icon: MapPin,
    external: true,
    accent: "from-foreground/10 to-foreground/5",
  },
];

const trustPoints = [
  "Enterprise QA automation",
  "Agentic test coverage",
  "India & global delivery",
];

export function ContactPageContent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="overflow-x-hidden">
      <section className="relative overflow-hidden bg-foreground px-4 py-20 text-background sm:px-6 lg:px-10 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--brand-orange)_28%,transparent),transparent_48%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.35))]" />

        <div className="relative mx-auto max-w-350">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="max-w-3xl"
          >
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">
              <Sparkles className="size-4" />
              Contact Apex Node
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Every channel. One team. Zero runaround.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-background/75 sm:text-lg">
              Demos, partnerships, enterprise rollouts — reach us the way that works for you.
              Our Chennai team responds within one business day.
            </p>
          </motion.div>

          <StaggerReveal
            className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            stagger={0.08}
            delay={0.15}
          >
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <StaggerItem key={action.label}>
                  <a
                    href={action.href}
                    target={action.external ? "_blank" : undefined}
                    rel={action.external ? "noopener noreferrer" : undefined}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:border-brand-orange/40 hover:bg-white/8"
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 bg-linear-to-br ${action.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                    />
                    <span className="relative flex size-11 items-center justify-center rounded-xl bg-brand-orange text-foreground shadow-lg">
                      <Icon className="size-5" />
                    </span>
                    <span className="relative mt-5 block text-sm font-semibold">{action.label}</span>
                    <span className="relative mt-1 block text-sm text-background/70">
                      {action.description}
                    </span>
                    <ArrowRight className="relative mt-4 size-4 text-brand-orange opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </a>
                </StaggerItem>
              );
            })}
          </StaggerReveal>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: smoothEase }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-background/80">
              <Clock className="size-4 text-brand-orange" />
              {officeHours}
            </span>
            {trustPoints.map((point) => (
              <span
                key={point}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-background/70"
              >
                {point}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative bg-background px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
        <div className="mx-auto max-w-350">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">
              Start a conversation
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Tell us about your quality goals
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Pick a channel on the left or send a message — we&apos;ll route you to the right
              specialist from day one.
            </p>
          </div>

          <CardReveal delay={0.1}>
            <ContactShell
              info={<ContactInfoColumn showBadge={false} />}
              form={<ContactForm variant="panel" showHelpOptions />}
            />
          </CardReveal>
        </div>
      </section>

      <section className="bg-surface px-4 pb-20 sm:px-6 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-350">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">
                Find us
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                Our Chennai office
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Based in Tidel Park with teams supporting clients across India and worldwide.
            </p>
          </div>

          <CardReveal delay={0.1}>
            <ContactMap />
          </CardReveal>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border bg-foreground px-4 py-16 text-background sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute -right-20 top-0 size-64 rounded-full bg-brand-orange/15 blur-3xl" />
        <div className="relative mx-auto flex max-w-350 flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">
              See it live
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Watch our agents run on your workflows
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-background/75 sm:text-base">
              Book a demo and we&apos;ll map coverage across your stack. {contactMethods.length}{" "}
              ways to reach us if you need anything before then.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="shrink-0 bg-brand-orange text-foreground hover:bg-brand-orange/90"
          >
            <Link href={tryItCta.href}>{tryItCta.label}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
