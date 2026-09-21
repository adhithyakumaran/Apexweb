import type React from "react";
import Link from "next/link";

/** Lightweight markdown-ish renderer for assistant answers (no extra deps). */
export function AnswerMarkdown({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("**") && trimmed.endsWith("**") && !trimmed.includes("\n")) {
          const inner = trimmed.slice(2, -2);
          return (
            <p key={i} className="font-semibold text-foreground">
              {renderInline(inner)}
            </p>
          );
        }

        if (trimmed.startsWith("- ")) {
          const items = trimmed.split("\n").filter((l) => l.startsWith("- "));
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {items.map((item, j) => (
                <li key={j}>{renderInline(item.replace(/^- /, ""))}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i}>{renderInline(trimmed)}</p>
        );
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(text.slice(last, m.index));
    }
    const token = m[0];
    if (token.startsWith("**")) {
      parts.push(
        <strong key={m.index}>{token.slice(2, -2)}</strong>
      );
    } else {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const external = href.startsWith("http");
        if (external) {
          parts.push(
            <a
              key={m.index}
              href={href}
              className="text-primary underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}
            </a>
          );
        } else {
          parts.push(
            <Link
              key={m.index}
              href={href}
              className="text-primary underline-offset-2 hover:underline"
            >
              {label}
            </Link>
          );
        }
      }
    }
    last = m.index + token.length;
  }
  if (last < text.length) {
    parts.push(text.slice(last));
  }
  return parts.length ? parts : text;
}
