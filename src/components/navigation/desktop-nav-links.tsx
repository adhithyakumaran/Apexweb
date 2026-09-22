"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { PrimaryMegaMenuItem } from "@/components/navigation/primary-mega-menu-item";
import {
  primaryNavDirectLinks,
  primaryNavPanels,
} from "@/config/mega-navigation";

export function DesktopNavLinks() {
  const [activeMegaId, setActiveMegaId] = useState<string | null>(null);

  const openMega = useCallback((id: string) => {
    setActiveMegaId(id);
  }, []);

  const closeMega = useCallback(() => {
    setActiveMegaId(null);
  }, []);

  return (
    <nav
      className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex xl:gap-2"
      aria-label="Primary"
    >
      {primaryNavPanels.map((panel) => (
        <PrimaryMegaMenuItem
          key={panel.id}
          panel={panel}
          isOpen={activeMegaId === panel.id}
          onOpen={() => openMega(panel.id)}
          onClose={closeMega}
        />
      ))}

      {primaryNavDirectLinks.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="rounded-md px-2 py-1 text-[0.95rem] font-medium text-foreground/80 transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
