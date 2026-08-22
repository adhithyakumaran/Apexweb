import { siteConfig } from "@/config/site";

export function getWhatsAppLink(customMessage?: string) {
  const message = customMessage ?? siteConfig.whatsapp.message;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodedMessage}`;
}