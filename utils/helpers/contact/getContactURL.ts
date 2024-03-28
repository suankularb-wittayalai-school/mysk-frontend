import isURL from "@/utils/helpers/isURL";
import { Contact } from "@/utils/types/contact";

/**
 * Converts Contact value into a URL depending on the type.
 *
 * @param contact The Contact to be converted.
 *
 * @returns A URL that can be used in links.
 */
export default function getContactURL({ type, value }: Contact) {
  switch (type) {
    case "phone":
      return `tel:${value}`;
    case "email":
      return `mailto:${value}`;
    case "facebook":
      return `https://www.facebook.com/search/people/?q=${value}`;
    case "line":
      if (isURL(value)) return value;
      return `https://line.me/ti/p/~${value}`;
    case "instagram":
      return `https://www.instagram.com/${value}`;
    case "discord":
      if (isURL(value)) return value;
      return `https://discord.gg/invite/${value}`;
    default:
      return value;
  }
}
