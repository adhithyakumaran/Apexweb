"use client";

import { ChevronDown } from "lucide-react";
import type { MegaNavPanel } from "@/config/mega-navigation";
import { cn } from "@/lib/utils";

type Props = {
  panel: MegaNavPanel;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export function PrimaryMegaMenuTrigger({ panel, isOpen, onOpen, onClose }: Props) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-haspopup="true"
      onClick={() => (isOpen ? onClose() : onOpen())}
      onMouseEnter={onOpen}
      onFocus={onOpen}
      className={cn(
        "relative flex items-center gap-1 rounded-md px-2 py-1.5 text-[0.95rem] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        isOpen ? "text-foreground" : "text-foreground/80 hover:text-foreground"
      )}
    >
      {panel.label}
      <ChevronDown
        className={cn(
          "size-3.5 opacity-60 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
      <span
        className={cn(
          "absolute -bottom-1 left-2 right-2 h-0.5 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-200",
          isOpen && "scale-x-100"
        )}
      />
    </button>
  );
}
