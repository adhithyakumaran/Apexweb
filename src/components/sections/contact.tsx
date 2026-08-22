import { Mail, Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";
import { ContactForm } from "@/components/forms/contact-form";

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
  return (
    <section className="w-full px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-350">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Get in touch
          </p>
          <h2 className="mt-4 text-3xl font-normal tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Let&apos;s talk about your QA
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Reach out however works best for you — we&apos;ll get back to you fast.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {methods.map((m) => {
            const Icon = m.icon;
            const isExternal = m.href.startsWith("http");
            return (
              <a
                key={m.label}
                href={m.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{m.label}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{m.value}</p>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-border bg-card p-8 sm:p-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}