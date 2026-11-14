import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteChrome } from "@/components/layout/site-chrome";
import { siteConfig } from "@/config/site";
import "./globals.css";

const jakarta = localFont({
  src: "../../public/fonts/plus-jakarta-sans/PlusJakartaSans.ttf",
  weight: "200 800",
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: "AI Automation & Software Development | Apex Node Technologies",
    template: "%s | Apex Node Technologies",
  },
  description: siteConfig.description,
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "128x128", type: "image/x-icon" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    title: "AI Automation & Software Development | Apex Node Technologies",
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Apex Node Technologies - AI agents, automation, and custom software" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation & Software Development | Apex Node Technologies",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
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
