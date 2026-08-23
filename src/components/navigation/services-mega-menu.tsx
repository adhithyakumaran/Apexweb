"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import {
  aiPlatforms,
  coreServices,
  industryAgents,
  serviceQuickLinks,
  testingAgents,
  type ServiceItem,
} from "@/config/services";
import { smoothEase } from "@/components/animations/motion-presets";
import { cn } from "@/lib/utils";

function ServiceLink({ item }: { item: ServiceItem }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="group flex items-start gap-3 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-muted/60"
    >
      <Icon className="mt-1 size-3.5 shrink-0 text-foreground" strokeWidth={1.75} />
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-snug text-foreground">
          {item.title}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
          {item.description}
        </span>
      </span>
    </Link>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </p>
  );
}

export function ServicesMegaMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }, []);

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Link
        href="/what-we-do"
        className={cn(
          "relative group flex items-center gap-1 text-[0.95rem] font-medium transition-colors duration-200",
          open ? "text-foreground" : "text-foreground/80 hover:text-foreground"
        )}
      >
        Services
        <ChevronDown
          className={cn(
            "size-3.5 opacity-60 transition-transform duration-300",
            open && "rotate-180"
          )}
        />
        <span
          className={cn(
            "absolute -bottom-4 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-300",
            open && "scale-x-100"
          )}
        />
      </Link>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 top-16 z-40 bg-foreground/20 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: smoothEase }}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            />

            <motion.div
              className="fixed inset-x-0 top-16 z-50 min-h-[calc(100vh-4rem)] overflow-y-auto"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.32, ease: smoothEase }}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              <div className="min-h-[calc(100vh-4rem)] bg-background/98 shadow-2xl backdrop-blur-2xl supports-[backdrop-filter]:bg-background/96">
                <div className="mx-auto grid max-w-350 gap-10 px-8 py-12 lg:grid-cols-12 lg:gap-12 lg:px-14 lg:py-14">
                  <div className="lg:col-span-5 lg:border-r lg:border-border/50 lg:pr-10">
                    <SectionLabel>Core Service Options</SectionLabel>
                    <div className="grid gap-1 sm:grid-cols-2">
                      {coreServices.map((item) => (
                        <ServiceLink key={item.title} item={item} />
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-3 lg:border-r lg:border-border/50 lg:pr-8">
                    <SectionLabel>AI Accelerator Platforms</SectionLabel>
                    <div className="flex flex-col gap-1">
                      {aiPlatforms.map((item) => (
                        <ServiceLink key={item.title} item={item} />
                      ))}
                    </div>

                    <div className="mt-10 border-t border-border/50 pt-10">
                      <SectionLabel>Testing Agents</SectionLabel>
                      <div className="flex flex-col gap-1">
                        {testingAgents.map((item) => (
                          <ServiceLink key={item.title} item={item} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 lg:pl-2">
                    <SectionLabel>Industry-Specific Agents</SectionLabel>
                    <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      {industryAgents.map((item) => (
                        <ServiceLink key={item.title} item={item} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/50 bg-muted/25 px-8 py-5 lg:px-14">
                  <div className="mx-auto flex max-w-350 flex-wrap items-center gap-x-8 gap-y-2">
                    {serviceQuickLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                      >
                        {link.label} →
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
