"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { PrimaryMegaMenuTrigger } from "@/components/navigation/primary-mega-menu-item";
import { FullWidthMegaPanel } from "@/components/navigation/full-width-mega-panel";
import {
  primaryNavDirectLinks,
  primaryNavPanels,
} from "@/config/mega-navigation";

export function DesktopNavLinks() {
  const [activeMegaId, setActiveMegaId] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activePanel =
    primaryNavPanels.find((p) => p.id === activeMegaId) ?? null;

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openMega = useCallback(
    (id: string) => {
      clearCloseTimer();
      setActiveMegaId(id);
    },
    [clearCloseTimer]
  );

  const closeMega = useCallback(() => {
    setActiveMegaId(null);
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(closeMega, 140);
  }, [clearCloseTimer, closeMega]);

  return (
    <div
      className="relative hidden min-w-0 lg:block"
      onMouseLeave={scheduleClose}
    >
      <nav
        className="flex min-w-0 items-center gap-1 xl:gap-2"
        aria-label="Primary"
      >
        {primaryNavPanels.map((panel) => (
          <PrimaryMegaMenuTrigger
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
            className="rounded-md px-2 py-1.5 text-[0.95rem] font-medium text-foreground/80 transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <FullWidthMegaPanel
        panel={activePanel}
        open={activeMegaId !== null}
        onClose={closeMega}
        onEnter={clearCloseTimer}
        onLeave={scheduleClose}
      />
    </div>
  );
}
