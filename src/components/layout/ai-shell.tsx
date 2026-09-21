"use client";

import { usePathname } from "next/navigation";
import { AiProvider } from "@/components/ai/ai-context";

export function AiShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";

  return (
    <AiProvider pageContext={{ pathname }}>
      {children}
    </AiProvider>
  );
}
