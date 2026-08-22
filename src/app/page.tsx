import { Hero } from "@/components/hero/hero";
import { TrustedPartners } from "@/components/sections/trusted-partners";
import { Agents } from "@/components/sections/agents";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

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
    </main>
  );
}