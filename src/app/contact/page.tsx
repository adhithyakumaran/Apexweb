import { pageMetadata } from "@/lib/seo";
import { ContactPageContent } from "@/components/contact/contact-page-content";

export const metadata = pageMetadata(
  "Contact Our AI & Software Development Team",
  "Discuss your AI agents, business automation, custom software, or QA testing project with Apex Node Technologies. Contact our development team.",
  "/contact",
);

export default function ContactPage() {
  return <ContactPageContent />;
}
