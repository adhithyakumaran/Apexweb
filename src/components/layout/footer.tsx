import Link from "next/link";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { mainNav } from "@/config/navigation";
import { agents } from "@/config/agents";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";

// TODO: legal pages not built yet — links are placeholders until /privacy
// and /terms exist (not in the current roadmap's Phase 6 list, add them)
const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="dark relative w-full overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-[#050810] to-black" />

      <div className="relative mx-auto max-w-350 px-6 py-20 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                AN
              </span>
              <span className="text-base font-semibold tracking-tight text-white">
                {siteConfig.shortName}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              {siteConfig.description}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
              >
                <Mail className="size-4" />
                {siteConfig.contact.email}
              </a>

              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
              >
                <Phone className="size-4" />
                {siteConfig.contact.phone}
              </a>

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
              >
                <MessageCircle className="size-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Platform
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {agents.map((agent) => (
                <li key={agent.slug}>
                  <Link
                    href={`/agents/${agent.slug}`}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {agent.codename}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Company
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Legal
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          {/* TODO: social links — client has not provided any yet (handover Section 15) */}
          <p className="text-xs text-slate-500">Built for enterprise QA teams.</p>
        </div>
      </div>
    </footer>
  );
}