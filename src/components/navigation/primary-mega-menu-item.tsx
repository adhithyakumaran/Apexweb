"use client";

import { useCallback, useRef } from "react";
import { ContextMegaMenu } from "@/components/navigation/mega-menu-primitives";
import type { MegaNavPanel } from "@/config/mega-navigation";

type Props = {
  panel: MegaNavPanel;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export function PrimaryMegaMenuItem({ panel, isOpen, onOpen, onClose }: Props) {
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const handleEnter = useCallback(() => {
    clearCloseTimer();
    onOpen();
  }, [clearCloseTimer, onOpen]);

  const handleLeave = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(onClose, 120);
  }, [clearCloseTimer, onClose]);

  return (
    <ContextMegaMenu
      panel={panel}
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      onEnter={handleEnter}
      onLeave={handleLeave}
    />
  );
}
