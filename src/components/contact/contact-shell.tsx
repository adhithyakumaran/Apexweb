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
        "overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm",
        className
      )}
    >
      <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="border-b border-border px-8 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:py-12">
          {info}
        </div>
        <div className="bg-brand-orange px-8 py-10 text-brand-orange-foreground sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          {form}
        </div>
      </div>
    </div>
  );
}
