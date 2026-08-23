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

function ServiceLink({
  item,
  variant = "default",
}: {
  item: ServiceItem;
  variant?: "default" | "compact";
}) {
  const Icon = item.icon;
  const isCompact = variant === "compact";

  return (
    <Link
      href={item.href}
      className="group flex items-start gap-2.5 rounded-lg px-2 py-1.5 transition-colors duration-200 hover:bg-muted/70"
    >
      <Icon
        className="mt-0.5 size-3.5 shrink-0 text-foreground"
        strokeWidth={1.75}
      />
      <span className="min-w-0">
        <span className="block text-[0.82rem] font-semibold leading-snug text-foreground">
          {item.title}
        </span>
        {!isCompact && (
          <span className="mt-0.5 block text-[0.72rem] leading-snug text-muted-foreground line-clamp-2">
            {item.description}
          </span>
        )}
      </span>
    </Link>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
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
              className="fixed inset-0 top-16 z-40 bg-foreground/15 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: smoothEase }}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            />

            <motion.div
              className="fixed inset-x-0 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease: smoothEase }}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              <div className="border-b border-border bg-background/97 shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:bg-background/95">
                <div className="mx-auto grid max-w-350 gap-0 px-6 py-6 lg:grid-cols-12 lg:px-8 lg:py-7">
                  <div className="lg:col-span-5 lg:border-r lg:border-border/60 lg:pr-6">
                    <SectionLabel>Core Service Options</SectionLabel>
                    <div className="grid gap-0.5 sm:grid-cols-2">
                      {coreServices.map((item) => (
                        <ServiceLink key={item.title} item={item} />
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-border/60 pt-6 lg:col-span-3 lg:mt-0 lg:border-t-0 lg:border-r lg:pt-0 lg:pr-5">
                    <SectionLabel>AI Accelerator Platforms</SectionLabel>
                    <div className="flex flex-col gap-0.5">
                      {aiPlatforms.map((item) => (
                        <ServiceLink key={item.title} item={item} variant="compact" />
                      ))}
                    </div>

                    <div className="mt-5 border-t border-border/50 pt-5">
                      <SectionLabel>Testing Agents</SectionLabel>
                      <div className="flex flex-col gap-0.5">
                        {testingAgents.map((item) => (
                          <ServiceLink key={item.title} item={item} variant="compact" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-border/60 pt-6 lg:col-span-4 lg:mt-0 lg:border-t-0 lg:pl-2 lg:pt-0">
                    <SectionLabel>Industry-Specific Agents</SectionLabel>
                    <div className="grid gap-0.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      {industryAgents.map((item) => (
                        <ServiceLink key={item.title} item={item} variant="compact" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/60 bg-muted/30 px-6 py-3.5 lg:px-8">
                  <div className="mx-auto flex max-w-350 flex-wrap items-center gap-x-5 gap-y-1.5">
                    {serviceQuickLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
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
