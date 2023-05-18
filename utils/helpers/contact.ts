// Types
import { Contact } from "@/utils/types/contact";

/**
 * Converts Contact value into a URL depending on the type.
 *
 * @param contact The Contact to be converted.
 *
 * @returns A URL that can be used in links.
 */
export function getContactURL({ type, value }: Contact) {
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

/**
 * Checks if a given Contact can be converted into a link.
 *
 * @param contact The Contact to be checked.
 *
 * @returns A boolean.
 */
export function getContactIsLinkable({ type, value }: Contact): boolean {
  if (type !== "Other") return true;
  try {
    new URL(value);
    return true;
  } catch (TypeError) {
    return false;
  }
}
