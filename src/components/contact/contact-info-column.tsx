import Link from "next/link";
import { contactMethods, socialLinks } from "@/config/contact";
import { Logo } from "@/components/navigation/logo";
import { cn } from "@/lib/utils";

type ContactInfoColumnProps = {
  showLogo?: boolean;
  className?: string;
};

export function ContactInfoColumn({ showLogo = true, className }: ContactInfoColumnProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {showLogo && (
        <div className="mb-10">
          <Logo />
        </div>
      )}

      <div className="flex flex-col gap-8">
        {contactMethods.map((method) => {
          const Icon = method.icon;
          return (
            <div key={method.id}>
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 size-5 shrink-0 text-foreground" strokeWidth={1.75} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{method.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{method.headline}</p>
                  <a
                    href={method.href}
                    target={method.external ? "_blank" : undefined}
                    rel={method.external ? "noopener noreferrer" : undefined}
                    className="mt-2 inline-block text-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-brand-orange hover:underline"
                  >
                    {method.value}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto flex items-center gap-4 pt-10">
        {socialLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            aria-label={link.label}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
