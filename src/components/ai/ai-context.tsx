"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnswerPanel } from "@/components/ai/answer-panel";

type AiContextValue = {
  openWithQuestion: (question: string) => void;
  openPanel: () => void;
  closePanel: () => void;
  isOpen: boolean;
};

const AiContext = createContext<AiContextValue | null>(null);

export function AiProvider({
  children,
  pageContext,
}: {
  children: ReactNode;
  pageContext: { pathname: string; title?: string };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [seedQuestion, setSeedQuestion] = useState("");
  const [panelKey, setPanelKey] = useState(0);

  const openWithQuestion = useCallback((question: string) => {
    setSeedQuestion(question);
    setPanelKey((k) => k + 1);
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
    <AiContext.Provider value={value}>
      {children}
      <AnswerPanel
        key={panelKey}
        open={isOpen}
        onClose={closePanel}
        initialQuestion={seedQuestion}
        pageContext={pageContext}
      />
    </AiContext.Provider>
  );
}

export function useAiAssistant() {
  const ctx = useContext(AiContext);
  if (!ctx) {
    throw new Error("useAiAssistant must be used within AiProvider");
  }
  return ctx;
}

export function useAiAssistantOptional() {
  return useContext(AiContext);
}
