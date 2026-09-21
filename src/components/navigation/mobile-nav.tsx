"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { megaNav, tryItCta, whatsappCta } from "@/config/navigation";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";
import { useAiAssistantOptional } from "@/components/ai/ai-context";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const whatsappHref = getWhatsAppLink();
  const ai = useAiAssistantOptional();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100vw-2rem,20rem)] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-4 flex flex-col gap-1 px-2" aria-label="Mobile">
          {megaNav.map((item) => {
            if (item.directLink && item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-muted"
                >
                  {item.label}
                </Link>
              );
            }

            const isExp = expanded === item.id;
            return (
              <div key={item.id} className="rounded-lg border border-border/60">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-3 py-3 text-left text-base font-medium"
                  aria-expanded={isExp}
                  onClick={() => setExpanded(isExp ? null : item.id)}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform",
                      isExp && "rotate-180"
                    )}
                  />
                </button>
                {isExp && (
                  <ul className="border-t border-border px-2 pb-2">
                    {item.columns.flatMap((c) =>
                      c.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-md px-2 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            );
          })}

          {ai && (
            <Button
              type="button"
              variant="outline"
              className="mt-2 gap-2"
              onClick={() => {
                setOpen(false);
                ai.openPanel();
              }}
            >
              <Sparkles className="size-4" />
              Ask Apex Node AI
            </Button>
          )}

          <div className="mt-4 flex flex-col gap-2">
            <Button asChild variant="default" size="lg">
              <Link href={tryItCta.href} onClick={() => setOpen(false)}>
                {tryItCta.label}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
              >
                {whatsappCta.label}
              </a>
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
