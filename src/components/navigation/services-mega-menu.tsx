"use client";

import Link from "next/link";
import { aiPlatforms, coreServices, serviceQuickLinks } from "@/config/services";
import {
  MegaMenuFooter,
  MegaMenuLink,
  MegaMenuSectionLabel,
  MegaMenuShell,
  useMegaMenuHover,
} from "@/components/navigation/mega-menu-primitives";

export function ServicesMegaMenu() {
  const { open, handleEnter, handleLeave } = useMegaMenuHover();

  return (
    <MegaMenuShell
      label="Services"
      href="/what-we-do"
      open={open}
      onEnter={handleEnter}
      onLeave={handleLeave}
      footer={
        <MegaMenuFooter>
          {serviceQuickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {link.label} →
            </Link>
          ))}
        </MegaMenuFooter>
      }
    >
      <div className="mx-auto grid max-w-350 gap-10 px-8 py-12 lg:grid-cols-12 lg:gap-12 lg:px-14 lg:py-14">
        <div className="lg:col-span-7 lg:border-r lg:border-border/50 lg:pr-10">
          <MegaMenuSectionLabel>Core Service Options</MegaMenuSectionLabel>
          <div className="grid gap-1 sm:grid-cols-2">
            {coreServices.map((item) => (
              <MegaMenuLink key={item.title} item={item} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 lg:pl-2">
          <MegaMenuSectionLabel>AI Accelerator Platforms</MegaMenuSectionLabel>
          <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
            {aiPlatforms.map((item) => (
              <MegaMenuLink key={item.title} item={item} />
            ))}
          </div>
        </div>
      </div>
    </MegaMenuShell>
  );
}
