import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { adminClasses } from "@/components/admin/admin-theme";

export function AdminPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("overflow-hidden rounded-xl border border-white/[0.06] bg-[#2C2D33]", className)}>
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
        "flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.06] px-5 py-4 sm:px-6",
        className
      )}
    >
      <div>
        <h2 className="text-sm font-semibold tracking-tight text-white">{title}</h2>
        {description && <p className="mt-1 text-sm text-[#9CA3AF]">{description}</p>}
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
  delta,
  className,
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: LucideIcon;
  delta?: { value: string; positive?: boolean };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.06] bg-[#2C2D33] p-5",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#9CA3AF]">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-white">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-[#9CA3AF]">{hint}</p>}
          {delta && (
            <span
              className={cn(
                "mt-2 inline-flex rounded-full px-2 py-0.5 text-[0.65rem] font-semibold",
                delta.positive
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-red-500/15 text-red-400"
              )}
            >
              {delta.value}
            </span>
          )}
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-[#1e1f24] text-[#9CA3AF]">
          <Icon className="size-4" />
        </span>
      </div>
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
        "flex flex-wrap items-center gap-2 rounded-xl border border-white/[0.06] bg-[#2C2D33] px-4 py-3",
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
  tone?: "success" | "warning" | "danger" | "neutral" | "info";
  children: React.ReactNode;
}) {
  const tones = {
    success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
    warning: "border-amber-500/25 bg-amber-500/10 text-amber-400",
    danger: "border-red-500/25 bg-red-500/10 text-red-400",
    info: "border-[#3B82F6]/25 bg-[#3B82F6]/10 text-blue-400",
    neutral: "border-white/[0.08] bg-[#1e1f24] text-[#9CA3AF]",
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
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-[#9CA3AF]">{description}</p>
        {action && <div className="mt-5">{action}</div>}
      </AdminPanelBody>
    </AdminPanel>
  );
}

export function AdminPrimaryButton({
  href,
  onClick,
  children,
  className,
  type = "button",
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
}) {
  const classes = cn(adminClasses.primaryBtn, className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export function AdminSectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h2 className="text-base font-semibold text-white">{title}</h2>
      {description && <p className="mt-1 text-sm text-[#9CA3AF]">{description}</p>}
    </div>
  );
}

export function AdminLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium text-[#9CA3AF] transition-colors hover:text-[#3B82F6]",
        className
      )}
    >
      {children}
    </Link>
  );
}

export function AdminAlert({
  children,
  tone = "warning",
}: {
  children: React.ReactNode;
  tone?: "warning" | "danger" | "info";
}) {
  const tones = {
    warning: "border-amber-500/25 bg-amber-500/10 text-amber-200",
    danger: "border-red-500/25 bg-red-500/10 text-red-200",
    info: "border-[#3B82F6]/25 bg-[#3B82F6]/10 text-blue-200",
  };

  return (
    <div className={cn("rounded-xl border px-4 py-3 text-sm", tones[tone])}>{children}</div>
  );
}
