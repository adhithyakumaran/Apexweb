"use client";

import Link from "next/link";
import { ArrowRight, Clock, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { ContactInfoColumn } from "@/components/contact/contact-info-column";
import { ContactMap } from "@/components/contact/contact-map";
import { ContactShell } from "@/components/contact/contact-shell";
import { CardReveal, StaggerItem, StaggerReveal } from "@/components/animations/scroll-reveal";
import { SectionHeader } from "@/components/animations/section-header";
import { Button } from "@/components/ui/button";
import { contactMethods, officeHours } from "@/config/contact";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";
import { tryItCta } from "@/config/navigation";
import { siteConfig } from "@/config/site";

const quickActions = [
  {
    label: "Call us",
    description: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`,
    icon: Phone,
  },
  {
    label: "WhatsApp",
    description: "Chat with our team instantly",
    href: getWhatsAppLink(),
    icon: MessageCircle,
    external: true,
  },
];

export function ContactPageContent() {
  return (
    <main className="overflow-x-hidden">
      <section className="border-b border-border bg-surface px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-350">
          <SectionHeader
            eyebrow="Contact"
            title="Let's build your next quality milestone together"
            description="Reach out for demos, partnerships, or enterprise QA automation. Every channel below connects you directly with our team."
            align="left"
            delay={0.1}
          />

          <StaggerReveal className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08} delay={0.2}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <StaggerItem key={action.label}>
                  <a
                    href={action.href}
                    target={action.external ? "_blank" : undefined}
                    rel={action.external ? "noopener noreferrer" : undefined}
                    className="group flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-brand-orange/30 hover:shadow-md"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/12 text-brand-orange">
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-foreground">{action.label}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">{action.description}</span>
                    </span>
                    <ArrowRight className="ml-auto size-4 shrink-0 text-brand-orange opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </a>
                </StaggerItem>
              );
            })}

            <StaggerItem>
              <div className="flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
                  <Clock className="size-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">Office hours</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{officeHours}</span>
                </span>
              </div>
            </StaggerItem>
          </StaggerReveal>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-350">
          <CardReveal delay={0.15}>
            <ContactShell
              info={<ContactInfoColumn />}
              form={<ContactForm variant="panel" showHelpOptions />}
            />
          </CardReveal>
        </div>
      </section>

      <section className="bg-background px-4 pb-20 sm:px-6 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-350">
          <CardReveal delay={0.15}>
            <ContactMap />
          </CardReveal>
        </div>
      </section>

      <section className="border-t border-border bg-foreground px-4 py-16 text-background sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-350 flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-orange">
              Prefer a live walkthrough?
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              See our agents run on your workflows
            </h2>
            <p className="mt-2 max-w-xl text-sm text-background/75 sm:text-base">
              Book a demo and we&apos;ll map coverage across your stack with {contactMethods.length} ways to reach us if you need anything before then.
            </p>
          </div>
          <Button asChild size="lg" className="bg-brand-orange text-foreground hover:bg-brand-orange/90">
            <Link href={tryItCta.href}>{tryItCta.label}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
