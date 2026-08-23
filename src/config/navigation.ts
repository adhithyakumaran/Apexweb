export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export const mainNav: NavItem[] = [
  { label: "About Us", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Services", href: "/what-we-do" },
  { label: "Agents", href: "/agents" },
  { label: "Contact", href: "/contact" },
];

export const whatsappCta = {
  label: "Let's Talk",
};

export const tryItCta: NavItem = {
  label: "Try it Free",
  href: "/book-demo",
};
