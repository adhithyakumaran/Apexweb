import type { ReactNode } from "react";
import {
  Pacifico,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Space_Grotesk,
  Sora,
  DM_Serif_Display,
} from "next/font/google";
import {
  Leaf,
  Globe2,
  BrainCircuit,
  Package,
  Sprout,
  MessageCircle,
} from "lucide-react";

const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["800"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });
const sora = Sora({ subsets: ["latin"], weight: ["700"] });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400" });

const MAIN = "text-[1.55rem] leading-tight sm:text-[1.7rem]";
const SUB = "mt-1.5 text-[0.68rem] font-medium uppercase tracking-[0.2em]";

function WordmarkIcon({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`mb-2.5 flex size-9 items-center justify-center rounded-full border border-border/60 bg-surface ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

export function PartnerWordmark({ id }: { id: string }) {
  switch (id) {
    case "geetham":
      return (
        <div className="flex flex-col items-center leading-none">
          <WordmarkIcon className="border-success/20 bg-success/5">
            <Leaf className="size-4 text-success" strokeWidth={2.2} />
          </WordmarkIcon>
          <span className={`${pacifico.className} ${MAIN} text-success`}>Geetham</span>
          <span className={`${SUB} text-success/75`}>Enterprises</span>
        </div>
      );

    case "swayup":
      return (
        <div className={`${spaceGrotesk.className} flex flex-col items-center text-foreground`}>
          <WordmarkIcon>
            <Globe2 className="size-4 text-foreground/80" strokeWidth={2} />
          </WordmarkIcon>
          <span className={MAIN}>SwayUp</span>
          <span className={`${SUB} text-muted-foreground`}>The Internet Company</span>
        </div>
      );

    case "prowess":
      return (
        <div className="flex flex-col items-center">
          <WordmarkIcon className="border-brand-orange/20 bg-brand-orange/5">
            <BrainCircuit className="size-4 text-brand-orange" strokeWidth={2} />
          </WordmarkIcon>
          <span className={`${jakarta.className} ${MAIN} tracking-tight`}>
            <span className="text-secondary">Prowess</span>
            <span className="text-brand-orange">IQ</span>
          </span>
        </div>
      );

    case "borrowbox":
      return (
        <div className="flex flex-col items-center leading-none">
          <WordmarkIcon>
            <Package className="size-4 text-foreground/75" strokeWidth={2} />
          </WordmarkIcon>
          <span className={`${jakarta.className} ${MAIN} text-foreground`}>Borrowbox</span>
          <span className={`${playfair.className} mt-1.5 text-[0.75rem] italic text-muted-foreground`}>
            care for Mother Earth
          </span>
        </div>
      );

    case "grewbie":
      return (
        <div className={`${sora.className} flex flex-col items-center leading-tight`}>
          <WordmarkIcon className="border-success/20 bg-success/5">
            <Sprout className="size-4 text-success" strokeWidth={2.2} />
          </WordmarkIcon>
          <span className={`${MAIN} text-foreground`}>Grewbie</span>
          <span className={`${SUB} text-success`}>Technologies</span>
        </div>
      );

    case "chatpilot":
      return (
        <div className="flex flex-col items-center">
          <WordmarkIcon>
            <MessageCircle className="size-4 text-foreground/80" strokeWidth={2} />
          </WordmarkIcon>
          <span className={`${dmSerif.className} ${MAIN} text-foreground`}>Chatpilot</span>
        </div>
      );

    default:
      return null;
  }
}
