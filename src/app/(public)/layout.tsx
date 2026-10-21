import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Footer } from "@/components/layout/footer";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { Navbar } from "@/components/navigation/navbar";
const jakarta = localFont({
  src: "../../../public/fonts/plus-jakarta-sans/PlusJakartaSans.ttf",
  variable: "--font-jakarta",
  display: "swap",
  weight: "200 800",
});
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${jakarta.variable} min-h-screen flex flex-col font-sans`}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <LoadingScreen />
        <Navbar />
        {children}
        <Footer />
      </ThemeProvider>
    </div>
  );
}
