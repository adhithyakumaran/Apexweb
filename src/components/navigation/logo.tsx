import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ChevronsRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["700", "800"],
});

type LogoProps = {
  variant?: "default" | "light";
  className?: string;
};

export function Logo({ variant = "default", className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-1.5 transition-opacity duration-300 hover:opacity-80",
        className
      )}
      aria-label={siteConfig.name}
    >
      <span
        className={cn(
          `${jakarta.className} text-3xl font-extrabold tracking-tight leading-none`,
          variant === "light" ? "text-white" : "text-foreground"
        )}
      >
        ant
      </span>
      <ChevronsRight
        className={cn(
          "size-6 stroke-[3] translate-y-[2px] shrink-0 text-brand-orange transition-transform duration-300 group-hover:translate-x-0.5"
        )}
      />
    </Link>
  );
}
