"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import type { ServiceItem } from "@/config/services";
import { smoothEase } from "@/components/animations/motion-presets";
import { cn } from "@/lib/utils";

export function MegaMenuLink({ item }: { item: ServiceItem }) {
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

export function MegaMenuSectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </p>
  );
}

type MegaMenuShellProps = {
  label: string;
  href: string;
  open: boolean;
  onEnter: () => void;
  onLeave: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function MegaMenuShell({
  label,
  href,
  open,
  onEnter,
  onLeave,
  children,
  footer,
}: MegaMenuShellProps) {
  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <Link
        href={href}
        className={cn(
          "relative group flex items-center gap-1 text-[0.95rem] font-medium transition-colors duration-200",
          open ? "text-foreground" : "text-foreground/80 hover:text-foreground"
        )}
      >
        {label}
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
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
            />

            <motion.div
              className="fixed inset-x-0 top-16 z-50 min-h-[calc(100vh-4rem)] overflow-y-auto"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.32, ease: smoothEase }}
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
            >
              <div className="min-h-[calc(100vh-4rem)] bg-background/98 shadow-2xl backdrop-blur-2xl supports-[backdrop-filter]:bg-background/96">
                {children}
                {footer}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MegaMenuFooter({ children }: { children: ReactNode }) {
  return (
    <div className="border-t border-border/50 bg-muted/25 px-8 py-5 lg:px-14">
      <div className="mx-auto flex max-w-350 flex-wrap items-center gap-x-8 gap-y-2">
        {children}
      </div>
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
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }, []);

  return { open, handleEnter, handleLeave };
}
