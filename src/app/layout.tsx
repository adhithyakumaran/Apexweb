import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteChrome } from "@/components/layout/site-chrome";
import "./globals.css";

const jakarta = localFont({
  src: "../../public/fonts/plus-jakarta-sans/PlusJakartaSans.ttf",
  weight: "200 800",
  variable: "--font-jakarta",
  display: "swap",
});

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
    <html
      lang="en"
      className={`${jakarta.variable} light h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh min-w-0 flex-col overflow-x-clip font-sans antialiased" suppressHydrationWarning>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
