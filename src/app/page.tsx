import { Hero } from "@/components/hero/hero";
import { TrustedPartners } from "@/components/sections/trusted-partners";
import { Agents } from "@/components/sections/agents";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Moat } from "@/components/sections/moat";
import { Testimonials } from "@/components/sections/testimonials";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <ScrollReveal delay={0.05}>
        <TrustedPartners />
      </ScrollReveal>
      <ScrollReveal delay={0.08}>
        <Agents />
      </ScrollReveal>
      <ScrollReveal delay={0.06}>
        <HowItWorks />
      </ScrollReveal>
      <Moat />
      <ScrollReveal delay={0.06}>
        <Testimonials />
      </ScrollReveal>
      <Contact />
    </main>
  );
}
