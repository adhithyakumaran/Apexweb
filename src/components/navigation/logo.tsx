import Link from "next/link";
import localFont from "next/font/local";
import { ChevronsRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const jakarta = localFont({
  src: "../../../public/fonts/plus-jakarta-sans/PlusJakartaSans.ttf",
  weight: "200 800",
  display: "swap",
});

const sizeStyles = {
  sm: { text: "text-xl", icon: "size-4 translate-y-[1px]" },
  md: { text: "text-3xl", icon: "size-6 translate-y-[2px]" },
  lg: { text: "text-4xl", icon: "size-7 translate-y-[2px]" },
} as const;

type LogoProps = {
  variant?: "default" | "light";
  className?: string;
  href?: string | false;
  size?: keyof typeof sizeStyles;
};

export function Logo({
  variant = "default",
  className,
  href = "/",
  size = "md",
}: LogoProps) {
  const styles = sizeStyles[size];

  const content = (
    <>
      <span
        className={cn(
          `${jakarta.className} font-extrabold tracking-tight leading-none`,
          styles.text,
          variant === "light" ? "text-white" : "text-foreground"
        )}
      >
        ant
      </span>
      <ChevronsRight
        className={cn(
          "stroke-[3] shrink-0 text-brand-orange transition-transform duration-300 group-hover:translate-x-0.5",
          styles.icon
        )}
      />
    </>
  );

  if (href === false) {
    return (
      <span
        className={cn("group inline-flex items-center gap-1.5", className)}
        aria-label={siteConfig.name}
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 transition-opacity duration-300 hover:opacity-80",
        className
      )}
      aria-label={siteConfig.name}
    >
      {content}
    </Link>
  );
}
