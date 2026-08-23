"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ServicesMegaMenu } from "@/components/navigation/services-mega-menu";
import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function DesktopNavLinks() {
  return (
    <nav className="hidden items-center gap-8 md:flex">
      {mainNav.map((item) => {
        if (item.label === "Services") {
          return <ServicesMegaMenu key={item.href} />;
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-1 text-base font-medium text-foreground/80 transition-colors duration-200 hover:text-foreground"
          >
            {item.label}
            {item.label === "Pricing" && (
              <ChevronDown className="size-4 opacity-70 transition-transform duration-200 group-hover:rotate-180" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
