"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { MegaNavLink, MegaNavPanel } from "@/config/mega-navigation";
import { smoothEase } from "@/components/animations/motion-presets";
import { cn } from "@/lib/utils";

export function MegaMenuSimpleLink({ link }: { link: MegaNavLink }) {
  return (
    <Link
      href={link.href}
      className="group flex flex-col gap-0.5 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-muted/80"
    >
      <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
        {link.label}
        <ArrowRight
          className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-60"
        />
      </span>
      {link.description && (
        <span className="text-xs leading-snug text-muted-foreground line-clamp-2">
          {link.description}
        </span>
      )}
    </Link>
  );
}

type ContextMegaMenuProps = {
  panel: MegaNavPanel;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onEnter: () => void;
  onLeave: () => void;
};

export function ContextMegaMenu({
  panel,
  open,
  onOpen,
  onClose,
  onEnter,
  onLeave,
}: ContextMegaMenuProps) {
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        ref={buttonRef}
        type="button"
        id={`${menuId}-trigger`}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={`${menuId}-panel`}
        onClick={() => (open ? onClose() : onOpen())}
        onFocus={onOpen}
        className={cn(
          "relative flex items-center gap-1 rounded-md px-1 py-1 text-[0.95rem] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          open ? "text-foreground" : "text-foreground/80 hover:text-foreground"
        )}
      >
        {panel.label}
        <ChevronDown
          className={cn(
            "size-3.5 opacity-60 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
        <span
          className={cn(
            "absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-primary transition-transform duration-200",
            open && "scale-x-100"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={`${menuId}-panel`}
            role="menu"
            aria-labelledby={`${menuId}-trigger`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: smoothEase }}
            className="fixed left-1/2 top-14 z-[60] mt-1 w-[min(52rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-foreground/5 sm:top-16"
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          >
            <div className="grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
              <div className="border-b border-border bg-surface/50 p-6 md:border-b-0 md:border-r md:p-8">
                <p className="text-base font-semibold tracking-tight text-foreground">
                  {panel.context.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {panel.context.description}
                </p>
                {panel.context.cta && (
                  <Link
                    href={panel.context.cta.href}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                    onClick={onClose}
                  >
                    {panel.context.cta.label}
                    <ArrowRight className="size-4" />
                  </Link>
                )}
              </div>
              <div className="p-6 md:p-8">
                <div
                  className={cn(
                    "grid gap-6",
                    panel.columns.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"
                  )}
                >
                  {panel.columns.map((col) => (
                    <div key={col.title ?? "col"}>
                      {col.title && (
                        <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          {col.title}
                        </p>
                      )}
                      <ul className="space-y-0.5">
                        {col.links.map((link) => (
                          <li key={link.href + link.label}>
                            <MegaMenuSimpleLink link={link} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function useMegaMenuHover() {
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);

  const handleEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const openMenu = useCallback(() => setOpen(true), []);

  return { open, handleEnter, handleLeave, close, openMenu };
}

/** @deprecated Legacy shell — kept for reference; new nav uses ContextMegaMenu */
export function MegaMenuFooter({ children }: { children: ReactNode }) {
  return (
    <div className="border-t border-border bg-muted px-8 py-5 lg:px-14">
      <div className="mx-auto flex max-w-350 flex-wrap items-center gap-x-8 gap-y-2">
        {children}
      </div>
    </div>
  );
}
