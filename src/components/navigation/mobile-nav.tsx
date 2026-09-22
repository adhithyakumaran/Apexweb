"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Phone, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MobileSearch } from "@/components/navigation/mobile-search";
import { tryItCta, whatsappCta } from "@/config/navigation";
import {
  primaryNavDirectLinks,
  primaryNavPanels,
} from "@/config/mega-navigation";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const whatsappHref = getWhatsAppLink();
  const phoneHref = `tel:${siteConfig.whatsapp.number}`;

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="safe-bottom w-[min(100vw-1rem,24rem)] overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <MobileSearch onNavigate={close} />
        <nav className="flex flex-col gap-1 px-2" aria-label="Mobile primary">
          {primaryNavPanels.map((panel) => {
            const isExp = expandedId === panel.id;
            return (
              <div key={panel.id} className="rounded-lg border border-border/60">
                <button
                  type="button"
                  aria-expanded={isExp}
                  onClick={() => setExpandedId(isExp ? null : panel.id)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {panel.label}
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform duration-200",
                      isExp && "rotate-180"
                    )}
                  />
                </button>
                {isExp && (
                  <ul className="border-t border-border px-2 pb-2 pt-1">
                    {panel.columns.flatMap((col) =>
                      col.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link
                            href={link.href}
                            onClick={close}
                            className="block rounded-md px-2 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))
                    )}
                    {panel.context.cta && (
                      <li>
                        <Link
                          href={panel.context.cta.href}
                          onClick={close}
                          className="mt-1 block px-2 py-2 text-sm font-medium text-primary"
                        >
                          {panel.context.cta.label}
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            );
          })}

          {primaryNavDirectLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={close}
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
              onClick={close}
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
              onClick={close}
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
              <Link href={tryItCta.href} onClick={close}>
                {tryItCta.label}
              </Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
