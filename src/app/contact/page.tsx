import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact/contact-page-content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Apex Node Technologies. Email, phone, WhatsApp, and our Chennai office — we're here to help with enterprise QA automation.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
