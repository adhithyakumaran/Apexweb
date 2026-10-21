import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Apex Node Technologies — Agentic End-to-End Test Automation",
    template: "%s | Apex Node Technologies",
  },
  description:
    "Enterprise AI-powered QA automation platform for agentic, end-to-end test coverage.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
