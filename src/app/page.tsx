import { Hero } from "@/components/hero/hero";
import { TrustedPartners } from "@/components/sections/trusted-partners";
import { Agents } from "@/components/sections/agents";
import { Moat } from "@/components/sections/moat";
import { Testimonials } from "@/components/sections/testimonials";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <TrustedPartners />
      <Agents />
      <Moat />
      <Testimonials />
      <Contact />
    </main>
  );
}
