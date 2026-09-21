"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { DesktopMegaNav } from "@/components/navigation/mega-menu";
import { Logo } from "@/components/navigation/logo";
import { tryItCta, whatsappCta } from "@/config/navigation";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";
import { useAiAssistantOptional } from "@/components/ai/ai-context";

export function Navbar() {
  const whatsappHref = getWhatsAppLink();
  const ai = useAiAssistantOptional();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-350 items-center gap-4 px-4 lg:px-8">
        <Logo />

        <div className="hidden flex-1 justify-center md:flex">
          <DesktopMegaNav />
        </div>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          {ai && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={() => ai.openPanel()}
            >
              <Sparkles className="size-4 text-primary" />
              <span className="hidden lg:inline">Ask AI</span>
            </Button>
          )}
          <Button asChild variant="default" size="lg">
            <Link href={tryItCta.href}>{tryItCta.label}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              {whatsappCta.label}
            </a>
          </Button>
          <ThemeToggle />
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
