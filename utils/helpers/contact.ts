// Types
import { ContactVia } from "@/utils/types/contact";

/**
 * Converts Contact value into a URL depending on the type.
 *
 * @param type The type of the Contact.
 * @param value The value to be converted.
 *
 * @returns A URL that can be used in links.
 */
export function getContactURL(type: ContactVia, value: string) {
  switch (type) {
    case "Phone":
      return `tel:${value}`;
    case "Email":
      return `mailto:${value}`;
    case "Facebook":
      return `https://www.facebook.com/search/people/?q=${value}`;
    case "Line":
      if (/^https:\/\/line\.me(\/R)?\/ti\/g\//.test(value)) return value;
      return `https://line.me/ti/p/~${value}`;
    case "Instagram":
      return `https://www.instagram.com/${value}`;
    case "Discord":
      return `https://discord.gg/invite/${value}`;
    default:
      return value;
  }
}
