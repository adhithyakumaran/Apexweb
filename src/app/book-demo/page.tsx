import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";

export const metadata: Metadata = {
  title: "Book a Demo",
};

export default function BookDemoPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:py-24">
      <h1 className="text-4xl font-semibold tracking-tight">Book a demo</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        See Apex Node agents on your workflows. We&apos;ll tailor the session to your stack
        and release cadence.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Button asChild size="lg">
          <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
            Chat on WhatsApp
          </a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href={`mailto:${siteConfig.contact.email}`}>Email us</Link>
        </Button>
      </div>
    </main>
  );
}
