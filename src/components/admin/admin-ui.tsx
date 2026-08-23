import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-neutral-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        className
      )}
    >
      {children}
    </section>
  );
}

export function AdminPanelHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-neutral-100 px-5 py-4 sm:px-6",
        className
      )}
    >
      <div>
        <h2 className="text-sm font-semibold tracking-tight text-neutral-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function AdminPanelBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("p-5 sm:p-6", className)}>{children}</div>;
}

export function AdminStatCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-neutral-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-neutral-900">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
        </div>
        <span className="flex size-10 items-center justify-center rounded-lg border border-neutral-200/80 bg-neutral-50 text-neutral-600">
          <Icon className="size-4" />
        </span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-orange/25 to-transparent" />
    </div>
  );
}

export function AdminStatusStrip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200/90 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AdminStatusPill({
  tone = "neutral",
  children,
}: {
  tone?: "success" | "warning" | "danger" | "neutral";
  children: React.ReactNode;
}) {
  const tones = {
    success: "border-emerald-200/80 bg-emerald-50 text-emerald-800",
    warning: "border-amber-200/80 bg-amber-50 text-amber-800",
    danger: "border-red-200/80 bg-red-50 text-red-700",
    neutral: "border-neutral-200/80 bg-neutral-50 text-neutral-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em]",
        tones[tone]
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
}

export function AdminEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <AdminPanel>
      <AdminPanelBody className="px-6 py-16 text-center">
        <p className="text-sm font-semibold text-neutral-900">{title}</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">{description}</p>
        {action && <div className="mt-5">{action}</div>}
      </AdminPanelBody>
    </AdminPanel>
  );
}
