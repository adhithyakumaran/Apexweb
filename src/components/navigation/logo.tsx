import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ChevronsRight } from "lucide-react";
import { siteConfig } from "@/config/site";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["700", "800"],
});

export function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-80"
      aria-label={siteConfig.name}
    >
      <span className={`${jakarta.className} text-3xl font-extrabold tracking-tight leading-none`}>
        ant
      </span>
      <ChevronsRight className="size-6 text-orange-500 stroke-[3] translate-y-[2px] shrink-0" />
    </Link>
  );
}