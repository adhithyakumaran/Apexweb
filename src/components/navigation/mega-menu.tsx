"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { megaNav } from "@/config/navigation";

const PANEL_WIDTH = "min(58rem, calc(100vw - 2rem))";

type MegaMenuProps = {
  onOpenChange?: (open: boolean) => void;
};

export function DesktopMegaNav({ onOpenChange }: MegaMenuProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const activePanel = megaNav.find((p) => p.id === activeId && !p.directLink);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => {
      setActiveId(null);
      onOpenChange?.(false);
    }, 120);
  };

  const openPanel = (id: string) => {
    clearCloseTimer();
    setActiveId(id);
    onOpenChange?.(true);
  };

  const closePanel = useCallback(() => {
    setActiveId(null);
    onOpenChange?.(false);
  }, [onOpenChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePanel]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) {
        closePanel();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [closePanel]);

  return (
    <div ref={navRef} className="relative hidden md:block">
      <ul className="flex items-center gap-1 lg:gap-2" role="menubar">
        {megaNav.map((item) => {
          if (item.directLink && item.href) {
            return (
              <li key={item.id} role="none">
                <Link
                  href={item.href}
                  role="menuitem"
                  className="rounded-lg px-3 py-2 text-[0.9375rem] font-medium text-foreground/85 transition-colors hover:bg-muted/80 hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          const isOpen = activeId === item.id;
          return (
            <li
              key={item.id}
              role="none"
              className="relative"
              onMouseEnter={() => openPanel(item.id)}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={isOpen}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3 py-2 text-[0.9375rem] font-medium transition-colors",
                  isOpen
                    ? "bg-muted/90 text-foreground"
                    : "text-foreground/85 hover:bg-muted/80 hover:text-foreground"
                )}
                onFocus={() => openPanel(item.id)}
              >
                {item.label}
                <ChevronDown
                  className={cn(
                    "size-4 opacity-60 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {activePanel && (
          <motion.div
            key={activePanel.id}
            role="menu"
            aria-label={activePanel.label}
            initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: PANEL_WIDTH }}
            className="absolute left-1/2 top-full z-50 mt-0 -translate-x-1/2 rounded-2xl border border-border bg-card/95 p-0 shadow-lg shadow-foreground/5 backdrop-blur-md"
            onMouseEnter={clearCloseTimer}
            onMouseLeave={scheduleClose}
          >
            <div className="grid grid-cols-1 gap-0 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1.4fr)]">
              <div className="border-b border-border p-8 md:border-b-0 md:border-r">
                <p className="text-lg font-semibold tracking-tight text-foreground">
                  {activePanel.context.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {activePanel.context.description}
                </p>
                {activePanel.context.cta && (
                  <Link
                    href={activePanel.context.cta.href}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    {activePanel.context.cta.label}
                    <ArrowRight className="size-4" />
                  </Link>
                )}
              </div>
              <div className="p-6 sm:p-8">
                <ul className="grid gap-1 sm:grid-cols-2">
                  {activePanel.columns.flatMap((col) =>
                    col.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="group flex flex-col gap-0.5 rounded-xl px-3 py-3 transition-colors hover:bg-muted/70"
                          onClick={closePanel}
                        >
                          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            {link.label}
                            <ArrowRight
                              className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-70"
                            />
                          </span>
                          {link.description && (
                            <span className="text-xs leading-snug text-muted-foreground">
                              {link.description}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
