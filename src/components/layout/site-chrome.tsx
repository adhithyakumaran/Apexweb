"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Footer } from "@/components/layout/footer";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { ChatWidget } from "@/components/chat/chat-widget";
import { StickyBottomBar } from "@/components/layout/sticky-bottom-bar";
import { Navbar } from "@/components/navigation/navbar";

type SiteChromeProps = {
  children: React.ReactNode;
};

export function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col overflow-x-clip">
        {!isAdmin && <LoadingScreen />}
        {!isAdmin && <Navbar />}
        <div className="min-w-0 flex-1 pb-20 sm:pb-24">{children}</div>
        {!isAdmin && <Footer />}
        {!isAdmin && <StickyBottomBar />}
        {!isAdmin && <ChatWidget />}
      </div>
    </ThemeProvider>
  );
}
