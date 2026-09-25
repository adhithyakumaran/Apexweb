import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContactShellProps = {
  info: ReactNode;
  form: ReactNode;
  className?: string;
};

export function ContactShell({ info, form, className }: ContactShellProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-border/80 bg-card shadow-[0_20px_60px_rgba(15,23,42,0.08)]",
        className
      )}
    >
      <div className="pointer-events-none absolute -left-20 top-0 size-56 rounded-full bg-brand-orange/8 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 size-48 rounded-full bg-primary/6 blur-3xl" />

      <div className="relative grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="border-b border-border/70 bg-surface/40 px-8 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:py-12">
          {info}
        </div>

        <div className="p-4 sm:p-5 lg:p-6">
          <div className="relative h-full overflow-hidden rounded-[1.35rem] bg-brand-orange px-8 py-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-8 size-36 rounded-full bg-foreground/8 blur-2xl" />
            <div className="relative">{form}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
