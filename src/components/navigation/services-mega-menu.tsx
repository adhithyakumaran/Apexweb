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

function ServiceLink({ item, compact = false }: { item: ServiceItem; compact?: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex gap-3 rounded-xl p-3 transition-colors duration-200 hover:bg-muted/60",
        compact && "p-2.5"
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background text-primary transition-colors group-hover:border-primary/30 group-hover:bg-primary/5">
        <Icon className="size-4" strokeWidth={1.75} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-foreground">{item.title}</span>
        <span
          className={cn(
            "mt-0.5 block text-xs leading-relaxed text-muted-foreground",
            compact ? "line-clamp-2" : "line-clamp-2"
          )}
        >
          {item.description}
        </span>
      </span>
    </Link>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
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
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, []);

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Link
        href="/what-we-do"
        className={cn(
          "relative group flex items-center gap-1 text-base font-medium transition-colors duration-200",
          open ? "text-foreground" : "text-foreground/80 hover:text-foreground"
        )}
      >
        Services
        <ChevronDown
          className={cn(
            "size-4 opacity-70 transition-transform duration-300",
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
              className="fixed inset-0 top-16 z-40 bg-foreground/5 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: smoothEase }}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            />

            <motion.div
              className="fixed inset-x-0 top-16 z-50"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.32, ease: smoothEase }}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              <div className="border-y border-border/60 bg-background/80 shadow-xl backdrop-blur-2xl supports-[backdrop-filter]:bg-background/70">
                <div className="mx-auto grid max-w-350 lg:grid-cols-[1.65fr_1fr]">
                  <div className="border-border/60 p-8 lg:border-r">
                    <SectionLabel>Core Service Options</SectionLabel>
                    <div className="mt-4 grid gap-1 sm:grid-cols-2">
                      {coreServices.map((item) => (
                        <ServiceLink key={item.title} item={item} />
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted/25 p-8">
                    <SectionLabel>Proprietary AI Accelerator Platforms</SectionLabel>
                    <div className="mt-3 flex flex-col gap-0.5">
                      {aiPlatforms.map((item) => (
                        <ServiceLink key={item.title} item={item} compact />
                      ))}
                    </div>

                    <div className="my-5 h-px bg-border/70" />

                    <SectionLabel>Functional & Industry-Specific Agents</SectionLabel>
                    <div className="mt-3 flex flex-col gap-0.5">
                      {industryAgents.map((item) => (
                        <ServiceLink key={item.title} item={item} compact />
                      ))}
                    </div>

                    <div className="my-5 h-px bg-border/70" />

                    <SectionLabel>Testing Agents</SectionLabel>
                    <div className="mt-3 flex flex-col gap-0.5">
                      {testingAgents.map((item) => (
                        <ServiceLink key={item.title} item={item} compact />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/60 bg-muted/20 px-8 py-4">
                  <div className="mx-auto flex max-w-350 flex-wrap items-center gap-x-6 gap-y-2">
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
