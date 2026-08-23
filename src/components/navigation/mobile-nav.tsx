"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Phone, MessageCircle, ChevronDown, ArrowUpRight } from "lucide-react";
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
import {
  aiPlatforms,
  coreServices,
  industryAgents,
  serviceQuickLinks,
  testingAgents,
  type ServiceItem,
} from "@/config/services";
import { cn } from "@/lib/utils";

function MobileServiceItem({ item, onNavigate }: { item: ServiceItem; onNavigate: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="flex items-start gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-muted"
    >
      <Icon className="mt-0.5 size-3.5 shrink-0 text-foreground" strokeWidth={1.75} />
      <span>
        <span className="block text-sm font-medium text-foreground">{item.title}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground line-clamp-2">
          {item.description}
        </span>
      </span>
    </Link>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
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
      <SheetContent side="right" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1 px-2">
          {mainNav.map((item) => {
            if (item.label === "Services") {
              return (
                <div key={item.href} className="rounded-lg">
                  <button
                    type="button"
                    onClick={() => setServicesOpen((v) => !v)}
                    className="flex w-full items-center justify-between rounded-md px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Services
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform duration-200",
                        servicesOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {servicesOpen && (
                    <div className="mb-2 ml-1 space-y-4 border-l border-border pl-3">
                      <div>
                        <p className="px-2 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                          Core Services
                        </p>
                        {coreServices.map((s) => (
                          <MobileServiceItem key={s.title} item={s} onNavigate={close} />
                        ))}
                      </div>
                      <div>
                        <p className="px-2 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                          AI Platforms
                        </p>
                        {aiPlatforms.map((s) => (
                          <MobileServiceItem key={s.title} item={s} onNavigate={close} />
                        ))}
                      </div>
                      <div>
                        <p className="px-2 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                          Industry Agents
                        </p>
                        {industryAgents.map((s) => (
                          <MobileServiceItem key={s.title} item={s} onNavigate={close} />
                        ))}
                      </div>
                      <div>
                        <p className="px-2 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                          Testing Agents
                        </p>
                        {testingAgents.map((s) => (
                          <MobileServiceItem key={s.title} item={s} onNavigate={close} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="flex items-center gap-1 rounded-md px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
              >
                {item.label}
                {item.label === "Articles" && (
                  <ArrowUpRight className="size-3.5 opacity-60" />
                )}
              </Link>
            );
          })}

          <div className="mt-2 space-y-1 border-t border-border pt-3">
            {serviceQuickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="block px-3 py-2 text-sm font-medium text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

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

          <div className="mt-6 flex justify-center">
            <ThemeToggle />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
