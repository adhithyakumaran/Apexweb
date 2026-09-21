"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Copy,
  RefreshCw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import type { AskAiResponse, PageContext } from "@/lib/ai/types";
import { AnswerMarkdown } from "@/components/ai/answer-markdown";
import { SourceList } from "@/components/ai/source-list";
import { RelatedQuestions } from "@/components/ai/related-questions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

export function AnswerPanel({
  open,
  onClose,
  initialQuestion,
  pageContext,
}: {
  open: boolean;
  onClose: () => void;
  initialQuestion?: string;
  pageContext: PageContext;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<AskAiResponse | null>(null);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const askedInitial = useRef(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const ask = useCallback(
    async (question: string, regenerate = false) => {
      const q = question.trim();
      if (!q || loading) return;

      setLoading(true);
      if (!regenerate) {
        setMessages((m) => [...m, { role: "user", content: q }]);
      }
      setInput("");

      try {
        const res = await fetch("/api/ai/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: q,
            conversationId,
            history: messages,
            pageContext,
            regenerate,
          }),
        });
        if (!res.ok) throw new Error("Request failed");
        const data = (await res.json()) as AskAiResponse;
        setConversationId(data.conversationId);
        setLastResponse(data);
        setMessages((m) => {
          if (regenerate && m.length && m[m.length - 1].role === "assistant") {
            return [...m.slice(0, -1), { role: "assistant", content: data.answer }];
          }
          return [...m, { role: "assistant", content: data.answer }];
        });
      } catch {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "Sorry—we couldn’t reach the answer engine. Please try again or [contact us](/contact).",
          },
        ]);
      } finally {
        setLoading(false);
        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        });
      }
    },
    [conversationId, loading, messages, pageContext]
  );

  useEffect(() => {
    if (!open) {
      askedInitial.current = false;
      return;
    }
    if (initialQuestion && !askedInitial.current) {
      askedInitial.current = true;
      void ask(initialQuestion);
    }
  }, [open, initialQuestion, ask]);

  const copyAnswer = async () => {
    const last = messages.filter((m) => m.role === "assistant").pop();
    if (!last) return;
    await navigator.clipboard.writeText(last.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lastUserQuestion =
    [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close AI assistant"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-foreground/20 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-panel-title"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 top-[4.5rem] z-[90] mx-auto flex max-h-[calc(100vh-5.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:inset-x-6 md:top-[5.5rem]"
          >
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="size-4" />
                </span>
                <div>
                  <h2 id="ai-panel-title" className="text-base font-semibold text-foreground">
                    Apex Node AI
                  </h2>
                  <p className="text-xs text-muted-foreground">Answer engine</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close"
                onClick={onClose}
              >
                <X className="size-5" />
              </Button>
            </header>

            <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
              {messages.length === 0 && !loading && (
                <p className="text-center text-sm text-muted-foreground">
                  Ask anything about Apex Node services, agents, pricing, or integrations.
                </p>
              )}
              <div className="space-y-6">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-xl px-4 py-3",
                      msg.role === "user"
                        ? "ml-auto max-w-[92%] bg-primary/10 text-foreground"
                        : "mr-auto max-w-full bg-muted/50"
                    )}
                  >
                    {msg.role === "user" ? (
                      <p className="text-sm font-medium">{msg.content}</p>
                    ) : (
                      <AnswerMarkdown content={msg.content} />
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Generating answer…
                  </div>
                )}
              </div>

              {lastResponse && !loading && (
                <>
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => ask(lastUserQuestion, true)}
                    >
                      <RefreshCw className="size-3.5" />
                      Regenerate
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => void copyAnswer()}
                    >
                      <Copy className="size-3.5" />
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button type="button" variant="ghost" size="icon-sm" aria-label="Helpful">
                      <ThumbsUp className="size-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon-sm" aria-label="Not helpful">
                      <ThumbsDown className="size-4" />
                    </Button>
                  </div>
                  {lastResponse.fallbackMode && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Development mode: answers use structured site content, not a live LLM.
                    </p>
                  )}
                  <SourceList sources={lastResponse.sources} />
                  {lastResponse.ctas && lastResponse.ctas.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {lastResponse.ctas.map((cta) => (
                        <Button key={cta.href} asChild size="sm" variant="default">
                          <Link href={cta.href}>{cta.label}</Link>
                        </Button>
                      ))}
                    </div>
                  )}
                  <RelatedQuestions
                    questions={lastResponse.relatedQuestions}
                    onSelect={(q) => void ask(q)}
                  />
                </>
              )}
            </div>

            <footer className="shrink-0 border-t border-border bg-card p-4 sm:p-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void ask(input);
                }}
                className="flex gap-2 rounded-full border border-border bg-background px-4 py-2 shadow-sm"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15">
                  <Sparkles className="size-4 text-primary" />
                </span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Please ask a question or initiate a search"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  aria-label="Ask Apex Node AI"
                />
                <Button type="submit" size="sm" disabled={loading || !input.trim()}>
                  Send
                </Button>
              </form>
              <p className="mt-2 text-center text-[0.65rem] text-muted-foreground">
                Results from our AI-powered Answer Engine may be inaccurate; please verify.
              </p>
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
