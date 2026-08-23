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
    <section className={cn("overflow-hidden rounded-md border border-[#333] bg-black", className)}>
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
        "flex flex-wrap items-center justify-between gap-3 border-b border-[#333] px-4 py-3",
        className
      )}
    >
      <div>
        <h2 className="text-[13px] font-medium text-[#ededed]">{title}</h2>
        {description && <p className="mt-0.5 text-[13px] text-[#666]">{description}</p>}
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
  return <div className={cn("p-4", className)}>{children}</div>;
}

export function AdminStatCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon?: LucideIcon;
  delta?: { value: string; positive?: boolean };
  className?: string;
}) {
  return (
    <div className={cn("rounded-md border border-[#333] bg-black px-4 py-3", className)}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-[#666]">{label}</p>
      <p className="mt-1 text-2xl font-medium tabular-nums tracking-tight text-[#ededed]">
        {value}
      </p>
      {hint && <p className="mt-0.5 text-[12px] text-[#666]">{hint}</p>}
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
        "flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[#333] pb-4 text-[13px]",
        className
      )}
    >
      {children}
    </div>
  );
}

type StatusTone = "success" | "warning" | "danger" | "neutral" | "info";

const statusDotColors: Record<StatusTone, string> = {
  success: "bg-[#50e3c2]",
  warning: "bg-[#f5a623]",
  danger: "bg-[#e00]",
  info: "bg-[#0070f3]",
  neutral: "bg-[#666]",
};

/** Vercel-style status: dot + plain text. No pill backgrounds. */
export function AdminStatusDot({
  tone = "neutral",
  children,
  className,
}: {
  tone?: StatusTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[13px] text-[#ededed]", className)}>
      <span className={cn("size-2 shrink-0 rounded-full", statusDotColors[tone])} />
      <span className="capitalize">{children}</span>
    </span>
  );
}

/** @deprecated Use AdminStatusDot for status display. Kept for compatibility. */
export function AdminStatusPill({
  tone = "neutral",
  children,
}: {
  tone?: StatusTone;
  children: React.ReactNode;
}) {
  return <AdminStatusDot tone={tone}>{children}</AdminStatusDot>;
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
    <div className="rounded-md border border-[#333] bg-black px-6 py-16 text-center">
      <p className="text-[13px] font-medium text-[#ededed]">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-[13px] text-[#666]">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
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

export function AdminSecondaryButton({
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
  const classes = cn(adminClasses.secondaryBtn, className);

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
      <h2 className="text-[15px] font-medium text-[#ededed]">{title}</h2>
      {description && <p className="mt-0.5 text-[13px] text-[#666]">{description}</p>}
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
        "text-[13px] text-[#a1a1a1] underline-offset-4 transition-colors hover:text-white hover:underline",
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
    warning: "border-[#f5a623]/30 text-[#f5a623]",
    danger: "border-[#e00]/30 text-[#ff6666]",
    info: "border-[#0070f3]/30 text-[#3291ff]",
  };

  return (
    <div className={cn("rounded-md border bg-black px-4 py-3 text-[13px]", tones[tone])}>
      {children}
    </div>
  );
}

export function AdminFilterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-[#333] pb-4">{children}</div>
  );
}

export function AdminFilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="inline-flex items-center gap-2">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 cursor-pointer appearance-none rounded border border-[#333] bg-black px-2.5 pr-7 text-[13px] text-[#ededed] outline-none transition-colors hover:border-[#666] focus:border-[#666]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
