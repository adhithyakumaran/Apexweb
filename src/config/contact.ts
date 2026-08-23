import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";

export type ContactMethod = {
  id: string;
  label: string;
  headline: string;
  value: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
};

export const officeAddress = {
  name: "Apex Node Technologies",
  lines: ["Tidel Park, Taramani", "Chennai, Tamil Nadu 600113", "India"],
  mapQuery: "Tidel Park, Chennai, Tamil Nadu, India",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Tidel+Park,+Chennai,+Tamil+Nadu,+India&z=14&output=embed",
};

export const officeHours = "Mon–Fri, 9:00 AM – 6:00 PM IST";

export const contactMethods: ContactMethod[] = [
  {
    id: "chat",
    label: "Chat to us",
    headline: "Our friendly team is here to help.",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    icon: Mail,
  },
  {
    id: "visit",
    label: "Visit us",
    headline: "Come say hello at our Chennai office.",
    value: officeAddress.lines.join(", "),
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeAddress.mapQuery)}`,
    icon: MapPin,
    external: true,
  },
  {
    id: "call",
    label: "Call us",
    headline: `${officeHours}.`,
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`,
    icon: Phone,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    headline: "Fastest way to reach our QA specialists.",
    value: "Start a conversation",
    href: getWhatsAppLink(),
    icon: MessageCircle,
    external: true,
  },
];

export const helpOptions = [
  "QA automation strategy",
  "Agentic testing rollout",
  "Performance & security testing",
  "AI platform integration",
  "Enterprise modernization",
  "Proof of concept",
] as const;

export const socialLinks = [
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "X", href: "https://x.com" },
  { label: "YouTube", href: "https://youtube.com" },
] as const;
