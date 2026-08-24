"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { tryItCta, whatsappCta } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function StickyBottomBar() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))]"
      aria-hidden={false}
    >
      <div
        className={cn(
          "pointer-events-auto flex w-full max-w-md items-center gap-1.5 rounded-2xl border border-white/25 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
          "bg-background/55 backdrop-blur-2xl backdrop-saturate-150",
          "dark:border-white/10 dark:bg-background/65 dark:shadow-[0_8px_40px_rgba(0,0,0,0.45)]",
          "sm:max-w-lg sm:gap-2 sm:rounded-full sm:p-2"
        )}
      >
        <Link
          href="/contact"
          className="flex flex-1 items-center justify-center rounded-xl px-3 py-2.5 text-center text-[13px] font-medium text-foreground transition-colors hover:bg-foreground/5 sm:rounded-full sm:py-2 sm:text-sm"
        >
          {whatsappCta.label}
        </Link>
        <Link
          href={tryItCta.href}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:rounded-full sm:py-2 sm:text-sm"
        >
          Book a demo
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
            <ArrowRight className="size-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}
