import {
  Pacifico,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Space_Grotesk,
  Sora,
  DM_Serif_Display,
} from "next/font/google";

const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["800"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });
const sora = Sora({ subsets: ["latin"], weight: ["700"] });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400" });

const prowessFont = jakarta.className;

export function PartnerWordmark({ id }: { id: string }) {
  switch (id) {
    case "geetham":
      return (
        <div className="flex flex-col items-center leading-none">
          <span className={`${pacifico.className} text-[2.4rem] text-success sm:text-[2.85rem]`}>
            Geetham
          </span>
          <span className="mt-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-success/75">
            Enterprises
          </span>
        </div>
      );

    case "swayup":
      return (
        <div className={`${spaceGrotesk.className} flex items-center gap-2 text-foreground`}>
          <span className="text-2xl tracking-tight sm:text-[1.65rem]">SwayUp</span>
          <span className="hidden h-7 w-px bg-border sm:block" />
          <span className="hidden flex-col text-[0.55rem] font-medium uppercase leading-tight tracking-[0.18em] text-muted-foreground sm:flex">
            <span>The Internet</span>
            <span>Company</span>
          </span>
        </div>
      );

    case "prowess":
      return (
        <span className={`${prowessFont} text-2xl tracking-tight sm:text-[1.65rem]`}>
          <span className="text-secondary">Prowess</span>
          <span className="text-brand-orange">IQ</span>
        </span>
      );

    case "borrowbox":
      return (
        <div className="flex flex-col items-center leading-none">
          <span className={`${jakarta.className} text-2xl text-foreground sm:text-[1.6rem]`}>
            Borrowbox
          </span>
          <span className={`${playfair.className} mt-1 text-sm italic text-muted-foreground`}>
            care for Mother Earth
          </span>
        </div>
      );

    case "grewbie":
      return (
        <div className={`${sora.className} flex flex-col items-center leading-tight text-foreground`}>
          <span className="text-xl sm:text-[1.45rem]">Grewbie</span>
          <span className="text-base text-success sm:text-[1.2rem]">Technologies</span>
        </div>
      );

    case "chatpilot":
      return (
        <span className={`${dmSerif.className} text-[1.75rem] text-foreground sm:text-[1.9rem]`}>
          Chatpilot
        </span>
      );

    default:
      return null;
  }
}
