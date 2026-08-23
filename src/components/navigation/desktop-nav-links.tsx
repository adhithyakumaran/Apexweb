"use client";

import Link from "next/link";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { AgentsMegaMenu } from "@/components/navigation/agents-mega-menu";
import { ServicesMegaMenu } from "@/components/navigation/services-mega-menu";
import { mainNav } from "@/config/navigation";

export function DesktopNavLinks() {
  return (
    <nav className="hidden items-center gap-6 lg:gap-7 md:flex">
      {mainNav.map((item) => {
        if (item.label === "Services") {
          return <ServicesMegaMenu key={item.href} />;
        }

        if (item.label === "Agents") {
          return <AgentsMegaMenu key={item.href} />;
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-1 text-[0.95rem] font-medium text-foreground/80 transition-colors duration-200 hover:text-foreground"
          >
            {item.label}
            {item.label === "Articles" && (
              <ArrowUpRight className="size-3.5 opacity-60 transition-transform group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-100" />
            )}
            {item.label === "Pricing" && (
              <ChevronDown className="size-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
