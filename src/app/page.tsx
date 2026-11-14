import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { Hero } from "@/components/hero/hero";
import { AiAnswerEntry } from "@/components/sections/ai-answer-entry";
import { TrustedPartners } from "@/components/sections/trusted-partners";
import { Agents } from "@/components/sections/agents";
import { Moat } from "@/components/sections/moat";
import { Testimonials } from "@/components/sections/testimonials";
import { Contact } from "@/components/sections/contact";

export const metadata = pageMetadata(
  "AI Automation & Software Development",
  siteConfig.description,
  "/",
);

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      alternateName: siteConfig.shortName,
      url: siteConfig.url,
      logo: `${siteConfig.url}/brand-logo.png`,
      description: siteConfig.description,
      knowsAbout: ["AI agent development", "Business process automation", "Custom software development", "QA automation"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      name: siteConfig.name,
      alternateName: siteConfig.shortName,
      url: siteConfig.url,
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
  ],
};

export default function Home() {
  return (
    <main className="min-w-0 overflow-x-clip">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\u003c") }} />
      <Hero />
      <AiAnswerEntry />
      <TrustedPartners />
      <Agents />
      <Moat />
      <Testimonials />
      <Contact />
    </main>
  );
}
