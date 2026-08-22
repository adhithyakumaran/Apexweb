import { Hero } from "@/components/hero/hero";
import { TrustedPartners } from "@/components/sections/trusted-partners";
import { Agents } from "@/components/sections/agents";
import { Moat } from "@/components/sections/moat";
import { Testimonials } from "@/components/sections/testimonials";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <ScrollReveal>
        <TrustedPartners />
      </ScrollReveal>
      <ScrollReveal>
        <Agents />
      </ScrollReveal>
      <ScrollReveal>
        <Moat />
      </ScrollReveal>
      <ScrollReveal>
        <Testimonials />
      </ScrollReveal>
      <ScrollReveal>
  <Contact />
</ScrollReveal>
    </main>
  );
}