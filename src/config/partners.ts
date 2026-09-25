export type PartnerWordmark = {
  id: string;
  name: string;
  /** Full-color logo asset (SVG) */
  logoSrc: string;
};

export const partners: PartnerWordmark[] = [
  { id: "geetham", name: "Geetham Enterprises", logoSrc: "/images/partners/geetham.svg" },
  { id: "swayup", name: "SwayUp Software Agency", logoSrc: "/images/partners/swayup.svg" },
  { id: "prowess", name: "Prowess IQ", logoSrc: "/images/partners/prowessiq.svg" },
  { id: "borrowbox", name: "BorrowBox", logoSrc: "/images/partners/borrowbox.svg" },
  { id: "grewbie", name: "Grewbie Technologies", logoSrc: "/images/partners/grewbie.svg" },
  { id: "chatpilot", name: "Chatpilot", logoSrc: "/images/partners/chatpilot.svg" },
];
