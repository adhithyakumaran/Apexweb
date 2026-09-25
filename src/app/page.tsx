import { Hero } from "@/components/hero/hero";
import { AiAnswerEntry } from "@/components/sections/ai-answer-entry";
import { TrustedPartners } from "@/components/sections/trusted-partners";
import { Agents } from "@/components/sections/agents";
import { Moat } from "@/components/sections/moat";
import { Testimonials } from "@/components/sections/testimonials";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main className="min-w-0 overflow-x-clip">
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
