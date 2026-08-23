export type Partner =
  | {
      name: string;
      type: "image";
      logo: string;
      width?: number;
      height?: number;
    }
  | {
      name: string;
      type: "text";
      variant: "geetham";
    };

export const partners: Partner[] = [
  { name: "Geetham Enterprises", type: "text", variant: "geetham" },
  {
    name: "SwayUp Software Agency",
    type: "image",
    logo: "/images/partners/swayup.png",
    width: 160,
    height: 40,
  },
  {
    name: "Prowess IQ",
    type: "image",
    logo: "/images/partners/prowessiq.png",
    width: 150,
    height: 44,
  },
  {
    name: "BorrowBox",
    type: "image",
    logo: "/images/partners/borrowbox.png",
    width: 140,
    height: 52,
  },
  {
    name: "Grewbie Technologies",
    type: "image",
    logo: "/images/partners/grewbie.png",
    width: 170,
    height: 48,
  },
  {
    name: "Chatpilot",
    type: "image",
    logo: "/images/partners/chatpilot.png",
    width: 140,
    height: 40,
  },
];

export const PARTNER_STAGGER_S = 0.1;
export const PARTNER_CYCLE_S = 4.8;
