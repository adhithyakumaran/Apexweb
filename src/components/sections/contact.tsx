"use client";

import { ContactForm } from "@/components/forms/contact-form";
import { ContactInfoColumn } from "@/components/contact/contact-info-column";
import { ContactShell } from "@/components/contact/contact-shell";
import { CardReveal } from "@/components/animations/scroll-reveal";
import { SectionHeader } from "@/components/animations/section-header";

export function Contact() {
  return (
    <section id="contact" className="w-full bg-background px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-350">
        <SectionHeader
          eyebrow="Get in touch"
          title="Ready to automate your QA workflow?"
          description="Tell us about your release goals. We'll help you design an agentic testing strategy that scales with your team."
          align="left"
          delay={0.15}
        />

        <CardReveal delay={0.3} className="mt-14">
          <ContactShell
            info={<ContactInfoColumn />}
            form={<ContactForm variant="panel" />}
          />
        </CardReveal>
      </div>
    </section>
  );
}
