import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentCursor } from "@/components/hero/agent-cursor";
import { tryItCta, whatsappCta } from "@/config/navigation";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";

export function Hero() {
  const whatsappHref = getWhatsAppLink();

  return (
        <section className="w-full px-4 pt-2 sm:px-6 sm:pt-3 lg:px-10 lg:pt-4">
      <div className="relative flex h-[85vh] min-h-140 w-full cursor-none items-center justify-center overflow-hidden rounded-3xl bg-secondary">
        <AgentCursor />

        {/* Background image — waiting on file at public/images/hero/hero-bg.jpg */}
        <Image
          src="/images/hero/hero-new-bg.png"
          alt=""
          fill
          priority
          className="object-cover"
        />

        {/* Light contrast overlay — just enough for text legibility, image stays vivid */}
        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/5 to-black/25" />

        {/* Bottom fade — soft dissolve at the base of the rounded card */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-black/45" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
          <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-6xl">
            Accelerate Software Quality with AI-Powered Testing Agents.
          </h1>

          <p className="max-w-2xl text-lg text-white/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.35)]">
            Autonomous testing agents that turn complex QA workflows into
            faster, smarter, and more reliable validation.
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="xl"
              className="border-2 border-white bg-transparent text-white hover:bg-white/10"
            >
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                {whatsappCta.label}
              </a>
            </Button>
            <Button
              asChild
              size="xl"
              className="gap-3 border-0 bg-white pr-2 text-black hover:bg-white/90"
            >
              <Link href={tryItCta.href}>
                Book a demo
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-white">
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}