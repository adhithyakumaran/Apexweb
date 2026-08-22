"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Heart, Mail, Phone, MessageCircle } from "lucide-react";
import { Logo } from "@/components/navigation/logo";
import { siteConfig } from "@/config/site";
import { mainNav } from "@/config/navigation";
import { agents } from "@/config/agents";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";
import {
  defaultTransition,
  defaultViewport,
  fadeUp,
  smoothEase,
} from "@/components/animations/motion-presets";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const contactLinks = [
  {
    label: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    icon: Mail,
  },
  {
    label: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`,
    icon: Phone,
  },
  {
    label: "Chat on WhatsApp",
    href: getWhatsAppLink(),
    icon: MessageCircle,
    external: true,
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  const prefersReducedMotion = useReducedMotion();

  const container = prefersReducedMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.08, delayChildren: 0.05 },
        },
      };

  const item = prefersReducedMotion ? undefined : fadeUp;

  return (
    <footer className="w-full bg-footer text-footer-foreground">
      <div className="mx-auto max-w-350 px-6 py-20 lg:px-10">
        <motion.div
          className="grid grid-cols-1 gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={defaultViewport}
          variants={container}
        >
          <motion.div variants={item} transition={defaultTransition}>
            <Logo variant="light" className="group" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-footer-muted">
              {siteConfig.description}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {contactLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="group/link flex items-center gap-2.5 text-sm text-footer-muted transition-colors duration-300 hover:text-footer-foreground"
                  >
                    <span className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors duration-300 group-hover/link:border-brand-orange/40 group-hover/link:bg-brand-orange/10">
                      <Icon className="size-3.5" />
                    </span>
                    {link.label}
                  </a>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={item} transition={defaultTransition}>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-orange">
              Platform
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {agents.map((agent) => (
                <li key={agent.slug}>
                  <Link
                    href={`/agents/${agent.slug}`}
                    className="text-sm text-footer-muted transition-all duration-300 hover:translate-x-1 hover:text-footer-foreground"
                  >
                    {agent.codename}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={item} transition={defaultTransition}>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-orange">
              Company
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-footer-muted transition-all duration-300 hover:translate-x-1 hover:text-footer-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={item} transition={defaultTransition}>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-orange">
              Legal
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-footer-muted transition-all duration-300 hover:translate-x-1 hover:text-footer-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 sm:flex-row"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={defaultViewport}
          transition={{ duration: 0.6, ease: smoothEase, delay: 0.15 }}
        >
          <p className="text-xs text-footer-muted">
            © {year} {siteConfig.name}. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-xs text-footer-muted">
            Made with
            <Heart
              className="size-3.5 fill-brand-orange text-brand-orange animate-heartbeat"
              aria-hidden
            />
            in India
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
