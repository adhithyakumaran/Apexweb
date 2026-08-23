import type { Metadata } from "next";
import { ServicesPageContent } from "@/components/pages/services-page-content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Enterprise AI modernization, QA automation, cloud DevOps, and AI accelerator platforms from Apex Node Technologies.",
};

export default function WhatWeDoPage() {
  return <ServicesPageContent />;
}
