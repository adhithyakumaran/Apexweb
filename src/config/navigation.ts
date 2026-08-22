export type NavItem = {
  label: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Services", href: "/what-we-do" },
  { label: "Contact", href: "/contact" },
];

export const tryItCta: NavItem = {
  label: "Try it",
  href: "/book-demo",
};

export const whatsappCta = {
  label: "Let's Talk",
};