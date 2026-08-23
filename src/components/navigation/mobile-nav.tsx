"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { mainNav, tryItCta, whatsappCta } from "@/config/navigation";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";
import { siteConfig } from "@/config/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const whatsappHref = getWhatsAppLink();
  const phoneHref = `tel:${siteConfig.whatsapp.number}`;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1 px-4">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}

          <div className="mt-4 rounded-2xl border border-border bg-surface p-3">
            <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {whatsappCta.label}
            </p>
            <a
              href={phoneHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Phone className="size-4" />
              </span>
              <span className="text-sm font-medium">Call us</span>
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
                <MessageCircle className="size-4" />
              </span>
              <span className="text-sm font-medium">Chat us</span>
            </a>
          </div>

          <div className="mt-4">
            <Button asChild variant="default" size="lg" className="w-full">
              <Link href={tryItCta.href} onClick={() => setOpen(false)}>
                {tryItCta.label}
              </Link>
            </Button>
          </div>

          <div className="mt-6 flex justify-center">
            <ThemeToggle />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
