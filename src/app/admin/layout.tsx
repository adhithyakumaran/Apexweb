import type { Metadata } from "next";
import localFont from "next/font/local";

const inter = localFont({
  src: "../../../public/fonts/inter/Inter[opsz,wght].ttf",
  weight: "100 900",
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
