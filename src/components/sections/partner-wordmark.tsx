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

const MAIN = "text-[1.35rem] leading-tight sm:text-[1.45rem]";
const SUB = "mt-1 text-[0.62rem] font-medium uppercase tracking-[0.22em]";

export function PartnerWordmark({ id }: { id: string }) {
  switch (id) {
    case "geetham":
      return (
        <div className="flex flex-col items-center leading-none">
          <span className={`${pacifico.className} ${MAIN} text-success`}>Geetham</span>
          <span className={`${SUB} text-success/75`}>Enterprises</span>
        </div>
      );

    case "swayup":
      return (
        <div className={`${spaceGrotesk.className} flex flex-col items-center text-foreground`}>
          <span className={MAIN}>SwayUp</span>
          <span className={`${SUB} text-muted-foreground`}>The Internet Company</span>
        </div>
      );

    case "prowess":
      return (
        <span className={`${jakarta.className} ${MAIN} tracking-tight`}>
          <span className="text-secondary">Prowess</span>
          <span className="text-brand-orange">IQ</span>
        </span>
      );

    case "borrowbox":
      return (
        <div className="flex flex-col items-center leading-none">
          <span className={`${jakarta.className} ${MAIN} text-foreground`}>Borrowbox</span>
          <span className={`${playfair.className} mt-1 text-[0.7rem] italic text-muted-foreground`}>
            care for Mother Earth
          </span>
        </div>
      );

    case "grewbie":
      return (
        <div className={`${sora.className} flex flex-col items-center leading-tight`}>
          <span className={`${MAIN} text-foreground`}>Grewbie</span>
          <span className={`${SUB} text-success`}>Technologies</span>
        </div>
      );

    case "chatpilot":
      return (
        <span className={`${dmSerif.className} ${MAIN} text-foreground`}>Chatpilot</span>
      );

    default:
      return null;
  }
}
