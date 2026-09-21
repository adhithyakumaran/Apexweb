import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/content-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy policy"
      intro="This placeholder policy should be replaced with counsel-approved legal text before production launch."
    />
  );
}
