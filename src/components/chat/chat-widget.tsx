"use client";

import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { officeAddress } from "@/config/contact";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  needsHuman?: boolean;
};

type ChatConfig = {
  enabled: boolean;
  welcomeMessage: string;
  suggestions: string[];
};

function PrismIcon({ className }: { className?: string }) {
  return (
    <div className={cn("prism-scene", className)}>
      <div className="prism-shape">
        <div className="prism-face prism-face-1" />
        <div className="prism-face prism-face-2" />
        <div className="prism-face prism-face-3" />
      </div>
    </div>
  );
}

export function ChatWidget() {
  const [config, setConfig] = useState<ChatConfig | null>(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/chat/config")
      .then((r) => r.json())
      .then((data: ChatConfig) => setConfig(data))
      .catch(() => setConfig(null));
  }, []);

  useEffect(() => {
    if (open && messages.length === 0 && config?.welcomeMessage) {
      setMessages([{ role: "assistant", content: config.welcomeMessage }]);
    }
  }, [open, config?.welcomeMessage, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError("");
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        needsHuman?: boolean;
        error?: string;
      };

      if (!response.ok) throw new Error(data.error ?? "Failed to send");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message ?? "",
          needsHuman: data.needsHuman,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!config?.enabled) return null;

  return (
    <>
      <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
        {open && (
          <div className="flex h-[min(32rem,calc(100vh-6rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-black shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-black ring-1 ring-neutral-700">
                  <PrismIcon />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{siteConfig.shortName} Assistant</p>
                  <p className="text-[11px] text-neutral-500">Ask anything about our platform</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-900 hover:text-white"
                aria-label="Close chat"
              >
                <X className="size-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col space-y-3 overflow-x-hidden overflow-y-auto px-4 py-4">
              {messages.map((msg, i) => (
                <div
                  key={`${msg.role}-${i}`}
                  className={cn(
                    "min-w-0 max-w-[90%] shrink-0 rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "ml-auto bg-white text-black"
                      : "bg-neutral-900 text-neutral-100"
                  )}
                >
                  <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{msg.content}</p>
                  {msg.needsHuman && (
                    <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-100">
                      <p className="font-medium">A human specialist can help</p>
                      <p className="mt-1 text-amber-200/80">
                        {siteConfig.contact.phone} · {siteConfig.contact.email}
                      </p>
                      <p className="mt-1 text-amber-200/70">{officeAddress.lines.join(", ")}</p>
                      <a
                        href={`mailto:${siteConfig.contact.email}`}
                        className="mt-2 inline-block font-medium text-white underline"
                      >
                        Email our team
                      </a>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="min-w-0 max-w-[80%] shrink-0 rounded-2xl bg-neutral-900 px-3.5 py-2.5 text-sm text-neutral-400">
                  Thinking…
                </div>
              )}
            </div>

            {messages.length <= 1 && config.suggestions?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 border-t border-neutral-900 px-4 py-2">
                {config.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage(s)}
                    className="rounded-full border border-neutral-800 px-2.5 py-1 text-[11px] text-neutral-300 hover:border-neutral-600 hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {error && <p className="px-4 pb-1 text-xs text-red-400">{error}</p>}

            <form
              className="flex items-center gap-2 border-t border-neutral-800 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                void sendMessage(input);
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about agents, services, contact…"
                className="h-10 flex-1 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-neutral-600"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex size-10 items-center justify-center rounded-xl bg-white text-black disabled:opacity-40"
                aria-label="Send"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="group flex size-14 items-center justify-center rounded-full bg-black shadow-lg ring-1 ring-neutral-800 transition-transform hover:scale-105"
          aria-label={open ? "Close chat" : "Open chat"}
        >
          {open ? (
            <X className="size-5 text-white" />
          ) : (
            <PrismIcon />
          )}
        </button>
      </div>
    </>
  );
}
