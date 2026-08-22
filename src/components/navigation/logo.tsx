import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
      aria-label={siteConfig.name}
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
        AN
      </span>
      <span className="hidden text-base font-semibold tracking-tight text-foreground sm:inline">
        {siteConfig.shortName}
      </span>
    </Link>
  );
}