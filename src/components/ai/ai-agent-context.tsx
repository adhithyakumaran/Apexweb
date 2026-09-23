"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { AiFullPageAgent } from "@/components/ai/ai-full-page-agent";

type AiAgentContextValue = {
  openWithQuestion: (question: string) => void;
  openPanel: () => void;
  closePanel: () => void;
  isOpen: boolean;
};

const AiAgentContext = createContext<AiAgentContextValue | null>(null);

export function AiAgentProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const [isOpen, setIsOpen] = useState(false);
  const [seedQuestion, setSeedQuestion] = useState("");
  const [sessionKey, setSessionKey] = useState(0);

  const openWithQuestion = useCallback((question: string) => {
    setSeedQuestion(question.trim());
    setSessionKey((k) => k + 1);
    setIsOpen(true);
  }, []);

  const openPanel = useCallback(() => {
    setSeedQuestion("");
    setIsOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    setSeedQuestion("");
  }, []);

  const value = useMemo(
    () => ({ openWithQuestion, openPanel, closePanel, isOpen }),
    [openWithQuestion, openPanel, closePanel, isOpen]
  );

  return (
    <AiAgentContext.Provider value={value}>
      {children}
      <AiFullPageAgent
        key={sessionKey}
        open={isOpen}
        onClose={closePanel}
        initialQuestion={seedQuestion}
        pagePathname={pathname}
      />
    </AiAgentContext.Provider>
  );
}

export function useAiAgent() {
  const ctx = useContext(AiAgentContext);
  if (!ctx) throw new Error("useAiAgent must be used within AiAgentProvider");
  return ctx;
}
