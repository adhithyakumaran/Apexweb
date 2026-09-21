import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/content-page";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of service"
      intro="This placeholder terms page should be replaced with counsel-approved legal text before production launch."
    />
  );
}
