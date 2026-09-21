import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/content-page";

export const metadata: Metadata = {
  title: "Who We Are",
};

export default function WhoWeArePage() {
  return (
    <ContentPage
      title="Who we are"
      intro="Apex Node Technologies builds enterprise AI-powered QA automation for teams that cannot afford quality drift."
      sections={[
        {
          id: "approach",
          title: "Our approach",
          body:
            "We partner with delivery leaders to embed agentic testing into existing pipelines—not bolt on another siloed tool.",
        },
        {
          id: "leadership",
          title: "Leadership",
          body:
            "Our team combines deep QA engineering experience with applied AI for production-grade automation.",
        },
        {
          id: "careers",
          title: "Careers",
          body:
            "We are growing our engineering and customer success teams. Reach out via the contact page to learn about open roles.",
        },
      ]}
    />
  );
}
