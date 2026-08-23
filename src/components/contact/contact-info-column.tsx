import Link from "next/link";
import { contactMethods, officeHours, socialLinks } from "@/config/contact";
import { Logo } from "@/components/navigation/logo";
import { cn } from "@/lib/utils";

const socialLabels: Record<string, string> = {
  LinkedIn: "in",
  X: "X",
  YouTube: "YT",
};

type ContactInfoColumnProps = {
  showLogo?: boolean;
  showBadge?: boolean;
  className?: string;
};

export function ContactInfoColumn({
  showLogo = true,
  showBadge = true,
  className,
}: ContactInfoColumnProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {showLogo && (
        <div className="mb-8 flex items-center justify-between gap-4">
          <Logo />
          {showBadge && (
            <span className="rounded-full border border-brand-orange/25 bg-brand-orange/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-orange">
              Chennai HQ
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {contactMethods.map((method) => {
          const Icon = method.icon;
          return (
            <a
              key={method.id}
              href={method.href}
              target={method.external ? "_blank" : undefined}
              rel={method.external ? "noopener noreferrer" : undefined}
              className="group flex items-start gap-4 rounded-2xl border border-transparent px-3 py-4 transition-all duration-300 hover:border-border/80 hover:bg-background/80 hover:shadow-sm"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-foreground text-background shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Icon className="size-4" strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">{method.label}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  {method.headline}
                </span>
                <span className="mt-2 inline-block text-sm font-medium text-foreground underline-offset-4 transition-colors group-hover:text-brand-orange group-hover:underline">
                  {method.value}
                </span>
              </span>
            </a>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-border/70 bg-background/70 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Response time
        </p>
        <p className="mt-1 text-sm font-medium text-foreground">Under 24 hours on business days</p>
        <p className="mt-1 text-xs text-muted-foreground">{officeHours}</p>
      </div>

      <div className="mt-auto flex items-center gap-2.5 pt-8">
        {socialLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold text-muted-foreground transition-all duration-300 hover:border-brand-orange/40 hover:bg-brand-orange/10 hover:text-brand-orange"
            aria-label={link.label}
          >
            {socialLabels[link.label] ?? link.label.slice(0, 2)}
          </Link>
        ))}
      </div>
    </div>
  );
}
