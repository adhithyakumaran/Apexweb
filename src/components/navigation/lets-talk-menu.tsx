"use client";

import { Phone, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { siteConfig } from "@/config/site";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";
import { whatsappCta } from "@/config/navigation";

const phoneHref = `tel:${siteConfig.whatsapp.number}`;
const whatsappHref = getWhatsAppLink();

type LetsTalkMenuProps = {
  size?: "default" | "lg" | "xl";
  variant?: "invert" | "outline";
  className?: string;
  align?: "start" | "center" | "end";
};

export function LetsTalkMenu({
  size = "lg",
  variant = "invert",
  className,
  align = "end",
}: LetsTalkMenuProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          {whatsappCta.label}
          <ChevronDown className="size-4 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-72 rounded-2xl border-border p-2 shadow-xl">
        <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Get in touch
        </p>
        <a
          href={phoneHref}
          className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
            <Phone className="size-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-foreground">Call us</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Speak with our QA team directly
            </span>
          </span>
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-1 flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange transition-transform duration-300 group-hover:scale-105">
            <MessageCircle className="size-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-foreground">Chat us</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Message us instantly on WhatsApp
            </span>
          </span>
        </a>
      </PopoverContent>
    </Popover>
  );
}
