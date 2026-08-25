"use client";

/**
 * Public site shell — wraps every page with theme, navbar, footer, and chat.
 *
 * Admin routes (`/admin/*`) skip the marketing chrome (navbar, footer, chat,
 * loading screen) so the CMS has its own layout via AdminShell.
 */
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Footer } from "@/components/layout/footer";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { ChatWidget } from "@/components/chat/chat-widget";
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
        <div className="min-w-0 flex-1">{children}</div>
        {!isAdmin && <Footer />}
        {!isAdmin && <ChatWidget />}
      </div>
    </ThemeProvider>
  );
}
