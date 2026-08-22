"use client";

import { motion, useReducedMotion } from "motion/react";
import { Mail, Phone, MessageCircle } from "lucide-react";
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

const methods = [
  {
    label: "Email us",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    icon: Mail,
  },
  {
    label: "Call us",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`,
    icon: Phone,
  },
  {
    label: "WhatsApp",
    value: "Chat with us instantly",
    href: getWhatsAppLink(),
    icon: MessageCircle,
  },
];

export function Contact() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden bg-brand-orange-light px-4 py-24 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -right-20 top-10 size-72 rounded-full bg-brand-orange/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 size-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-350">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: smoothEase }}
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-orange-foreground">
            Get in touch
          </p>
          <h2 className="mt-4 text-3xl font-normal tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Let&apos;s talk about your QA
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Reach out however works best for you — we&apos;ll get back to you fast.
          </p>
        </motion.div>

        <StaggerReveal className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {methods.map((m) => {
            const Icon = m.icon;
            const isExternal = m.href.startsWith("http");
            return (
              <StaggerItem key={m.label}>
                <a
                  href={m.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-brand-orange/15 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/35 hover:shadow-md"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange transition-transform duration-300 group-hover:scale-110">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{m.label}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{m.value}</p>
                  </div>
                </a>
              </StaggerItem>
            );
          })}
        </StaggerReveal>

        <motion.div
          className="mx-auto mt-16 max-w-2xl rounded-2xl border border-brand-orange/15 bg-card p-8 shadow-sm sm:p-10"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ ...defaultTransition, delay: 0.15 }}
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}
