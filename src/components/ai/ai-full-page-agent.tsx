"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Copy, RefreshCw, Search, ThumbsDown, ThumbsUp, X } from "lucide-react";
import Link from "next/link";
import { AgentOrb } from "@/components/ai/agent-orb";
import { AnswerContent } from "@/components/ai/answer-content";
import type { AnswerCta, AnswerSource } from "@/lib/chatbot/answer-envelope";
import { Button } from "@/components/ui/button";
type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  needsHuman?: boolean;
  relatedQuestions?: string[];
  ctas?: AnswerCta[];
  sources?: AnswerSource[];
};

type ChatApiResponse = {
  message?: string;
  needsHuman?: boolean;
  error?: string;
  relatedQuestions?: string[];
  ctas?: AnswerCta[];
  sources?: AnswerSource[];
};

export function AiFullPageAgent({
  open,
  onClose,
  initialQuestion,
  pagePathname,
}: {
  open: boolean;
  onClose: () => void;
  initialQuestion?: string;
  pagePathname: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
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
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    fetch("/api/chat/config")
      .then((r) => r.json())
      .then((d: { suggestions?: string[] }) => setSuggestions(d.suggestions ?? []))
      .catch(() => undefined);
  }, []);

  const sendMessage = useCallback(
    async (text: string, replaceLastAssistant = false) => {
      if (loading) return;

      setError("");
      let queryText = text.trim();
      let nextMessages: ChatMessage[];

      if (replaceLastAssistant) {
        const lastUser = [...messages].reverse().find((m) => m.role === "user");
        if (!lastUser) return;
        queryText = lastUser.content;
        nextMessages = messages.slice(0, -1);
        setMessages(nextMessages);
      } else {
        if (!queryText) return;
        nextMessages = [...messages, { role: "user", content: queryText }];
        setMessages(nextMessages);
        setInput("");
      }

      setLoading(true);

      try {
        const history = nextMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            structured: true,
            pageContext: { pathname: pagePathname },
          }),
        });

        const data = (await response.json()) as ChatApiResponse;
        if (!response.ok) throw new Error(data.error ?? "Failed to get answer");

        const assistant: ChatMessage = {
          role: "assistant",
          content: data.message ?? "",
          needsHuman: data.needsHuman,
          relatedQuestions: data.relatedQuestions,
          ctas: data.ctas,
          sources: data.sources,
        };

        setMessages((prev) =>
          replaceLastAssistant ? [...prev.slice(0, -1), assistant] : [...prev, assistant]
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        });
      }
    },
    [loading, messages, pagePathname]
  );

  useEffect(() => {
    if (!open) {
      askedInitial.current = false;
      return;
    }
    if (initialQuestion && !askedInitial.current) {
      askedInitial.current = true;
      void sendMessage(initialQuestion);
    }
  }, [open, initialQuestion, sendMessage]);

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");

  const copyLast = async () => {
    if (!lastAssistant) return;
    await navigator.clipboard.writeText(lastAssistant.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const related =
    lastAssistant?.relatedQuestions?.length
      ? lastAssistant.relatedQuestions
      : suggestions;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Apex Node AI answer engine"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-background"
        >
          <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <AgentOrb size="sm" />
              <div>
                <p className="text-sm font-semibold text-foreground">Apex Node AI</p>
                <p className="text-xs text-muted-foreground">Answer engine</p>
              </div>
            </div>
            <Button type="button" variant="ghost" size="icon" aria-label="Close" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </header>

          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
            <div className="mx-auto max-w-3xl space-y-8">
              {messages.length === 0 && !loading && (
                <p className="text-center text-muted-foreground">
                  Ask about services, agents, pricing, or your QA stack.
                </p>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={msg.role === "user" ? "flex justify-end" : ""}>
                  {msg.role === "user" ? (
                    <p className="max-w-[90%] rounded-2xl bg-primary/10 px-4 py-3 text-sm font-medium text-foreground">
                      {msg.content}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <AgentOrb size="sm" className="mt-1" />
                        <div className="min-w-0 flex-1">
                          <AnswerContent content={msg.content} />
                        </div>
                      </div>

                      {i === messages.length - 1 && !loading && (
                        <>
                          <div className="flex flex-wrap items-center gap-2 pl-11">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => void sendMessage("", true)}
                            >
                              <RefreshCw className="size-3.5" />
                              Regenerate
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => void copyLast()}
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

                          {msg.ctas && msg.ctas.length > 0 && (
                            <div className="flex flex-wrap gap-2 pl-11">
                              {msg.ctas.map((cta) => (
                                <Button key={cta.href + cta.label} asChild size="sm" variant="default">
                                  {cta.external ? (
                                    <a href={cta.href} target="_blank" rel="noopener noreferrer">
                                      {cta.label}
                                    </a>
                                  ) : (
                                    <Link href={cta.href} onClick={onClose}>{cta.label}</Link>
                                  )}
                                </Button>
                              ))}
                            </div>
                          )}

                          {msg.sources && msg.sources.length > 0 && (
                            <div className="border-t border-border pt-4 pl-11">
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Sources
                              </p>
                              <ul className="mt-2 space-y-1">
                                {msg.sources.map((s, idx) => (
                                  <li key={`${s.title}-${idx}`} className="text-sm">
                                    {s.href ? (
                                      <Link href={s.href} className="text-primary hover:underline" onClick={onClose}>
                                        {s.title}
                                      </Link>
                                    ) : (
                                      <span className="text-foreground/90">{s.title}</span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3 text-primary">
                  <AgentOrb size="sm" />
                  <p className="text-lg font-medium tracking-tight motion-safe:animate-pulse">
                    Rethinking…
                  </p>
                </div>
              )}

              {error && <p className="text-sm text-destructive">{error}</p>}

              {!loading && related.length > 0 && messages.some((m) => m.role === "assistant") && (
                <div className="border-t border-border pt-6">
                  <p className="text-sm font-semibold text-foreground">
                    What would you like to ask next?
                  </p>
                  <ul className="mt-3 space-y-2">
                    {related.map((q) => (
                      <li key={q}>
                        <button
                          type="button"
                          onClick={() => void sendMessage(q)}
                          className="w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-muted"
                        >
                          {q}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <footer className="shrink-0 border-t border-border bg-card/80 px-4 py-4 backdrop-blur-sm sm:px-6">
            <form
              className="mx-auto flex max-w-3xl items-center gap-3 rounded-full border border-border bg-background px-3 py-2 shadow-sm"
              onSubmit={(e) => {
                e.preventDefault();
                void sendMessage(input);
              }}
            >
              <AgentOrb size="sm" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Please ask a question or initiate a search"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                aria-label="Ask Apex Node AI"
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send">
                <Search className="size-4" />
              </Button>
            </form>
            <p className="mx-auto mt-2 max-w-3xl text-center text-[0.65rem] text-muted-foreground">
              Results from our AI-powered Answer Engine may be inaccurate; please verify.
            </p>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
