import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-admin",
  display: "swap",
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className={inter.variable}>{children}</div>;
}
