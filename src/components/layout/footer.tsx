"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Logo } from "@/components/navigation/logo";
import { siteConfig } from "@/config/site";
import { mainNav } from "@/config/navigation";
import { agents } from "@/config/agents";
import { coreServices } from "@/config/services";
import { helpOptions, officeAddress, officeHours, socialLinks } from "@/config/contact";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";
import {
  defaultTransition,
  defaultViewport,
  fadeUp,
  smoothEase,
} from "@/components/animations/motion-presets";

const resourceLinks = [
  { label: "Articles & insights", href: "/articles" },
  { label: "What we do", href: "/what-we-do" },
  { label: "Book a demo", href: "/contact" },
  { label: "Try it free", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socialIcons = {
  LinkedIn: LinkedInIcon,
  X: XIcon,
  YouTube: YouTubeIcon,
} as const;

export function Footer() {
  const year = new Date().getFullYear();
  const prefersReducedMotion = useReducedMotion();

  const container = prefersReducedMotion
    ? undefined
    : {
        hidden: {},
        visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
      };

  const item = prefersReducedMotion ? undefined : fadeUp;

  return (
    <footer className="relative w-full overflow-hidden bg-footer text-footer-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute -top-32 right-0 size-[28rem] rounded-full bg-brand-orange/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 size-80 rounded-full bg-brand-orange/5 blur-3xl" />

      <div className="relative mx-auto max-w-350 px-6 pt-24 pb-10 lg:px-10 lg:pt-28">
        <motion.div
          className="mb-16 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm lg:flex lg:items-center lg:justify-between lg:p-10"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={defaultViewport}
          transition={{ duration: 0.6, ease: smoothEase }}
        >
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
              Stay in the loop
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-footer-foreground sm:text-3xl">
              Ship quality faster with agentic QA
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-footer-muted">
              Talk to our Chennai team about automation strategy, rollout, or a proof of concept.
              {officeHours ? ` ${officeHours}.` : ""}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
            >
              Talk to us
              <ArrowUpRight className="size-4" />
            </Link>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-footer-foreground transition-colors hover:border-brand-orange/50 hover:text-brand-orange"
            >
              <MessageCircle className="size-4" />
              WhatsApp
            </a>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-12 xl:gap-10"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={defaultViewport}
          variants={container}
        >
          <motion.div className="xl:col-span-4" variants={item} transition={defaultTransition}>
            <Logo variant="light" className="group" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-footer-muted">
              {siteConfig.description}
            </p>

            <div className="mt-6 space-y-3">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-3 text-sm text-footer-muted transition-colors hover:text-footer-foreground"
              >
                <span className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <Mail className="size-4" />
                </span>
                {siteConfig.contact.email}
              </a>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-3 text-sm text-footer-muted transition-colors hover:text-footer-foreground"
              >
                <span className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <Phone className="size-4" />
                </span>
                {siteConfig.contact.phone}
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeAddress.mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-footer-muted transition-colors hover:text-footer-foreground"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <MapPin className="size-4" />
                </span>
                <span>{officeAddress.lines.join(", ")}</span>
              </a>
            </div>

            <div className="mt-6 flex gap-2">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.label as keyof typeof socialIcons];
                if (!Icon) return null;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-footer-muted transition-colors hover:border-brand-orange/40 hover:text-brand-orange"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          <motion.div className="xl:col-span-2" variants={item} transition={defaultTransition}>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-orange">Platform</p>
            <ul className="mt-5 space-y-3">
              {mainNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-footer-muted transition-colors hover:text-footer-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="xl:col-span-2" variants={item} transition={defaultTransition}>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-orange">Services</p>
            <ul className="mt-5 space-y-3">
              <li>
                <Link href="/what-we-do" className="text-sm font-medium text-footer-foreground hover:text-brand-orange">
                  All services
                </Link>
              </li>
              {coreServices.map((service) => (
                <li key={service.title}>
                  <Link href={service.href} className="text-sm text-footer-muted hover:text-footer-foreground">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="xl:col-span-2" variants={item} transition={defaultTransition}>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-orange">AI Agents</p>
            <ul className="mt-5 space-y-3">
              <li>
                <Link href="/agents" className="text-sm font-medium text-footer-foreground hover:text-brand-orange">
                  All agents
                </Link>
              </li>
              {agents.map((agent) => (
                <li key={agent.slug}>
                  <Link href={`/agents/${agent.slug}`} className="text-sm text-footer-muted hover:text-footer-foreground">
                    {agent.codename}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="xl:col-span-2" variants={item} transition={defaultTransition}>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-orange">Resources</p>
            <ul className="mt-5 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-sm text-footer-muted hover:text-footer-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.15em] text-brand-orange">We help with</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {helpOptions.slice(0, 4).map((topic) => (
                <li key={topic}>
                  <span className="inline-block rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-footer-muted">
                    {topic}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.15em] text-brand-orange">Legal</p>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-footer-muted hover:text-footer-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={defaultViewport}
          transition={{ duration: 0.6, ease: smoothEase, delay: 0.1 }}
        >
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-xs text-footer-muted">
              © {year} {siteConfig.name}. All rights reserved.
            </p>
            <span className="hidden h-3 w-px bg-white/15 sm:inline" />
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              All systems operational
            </span>
          </div>

          <p className="flex items-center gap-1.5 text-xs text-footer-muted">
            Made with
            <Heart className="size-3.5 fill-brand-orange text-brand-orange animate-heartbeat" aria-hidden />
            in Chennai, India
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
