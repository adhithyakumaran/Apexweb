import type { Metadata } from "next";
import { HubTheme } from "@/components/development/theme";
import { HubNavigation } from "@/components/development/navigation";
import "./hub.css";
import { UploadProvider } from "@/components/development/upload-provider";
import { configuration } from "@/lib/development/supabase";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { default: "TestBuddy Hub", template: "%s | TestBuddy Hub" },
  description: "Shared development, builds, and tester feedback.",
  robots: { index: false, follow: false },
};
export default function DevelopmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UploadProvider configuration={configuration()}>
      <HubTheme>
        <a href="#hub-main" className="hub-skip">
          Skip to content
        </a>
        <HubNavigation />
        <main id="hub-main" className="hub-main">
          {children}
        </main>
        <footer className="hub-footer">
          <span>TestBuddy Hub</span>
          <span>Build. Test. Improve.</span>
        </footer>
      </HubTheme>
    </UploadProvider>
  );
}
