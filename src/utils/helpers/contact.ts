import { ContactVia } from "@utils/types/contact";

export function getContactURL(type: ContactVia, value: string) {
  if (type == "Phone") return `tel:${value}`;
  if (type == "Email") return `mailto:${value}`;
  if (type == "Facebook")
    return `https://www.facebook.com/search/people/?q=${value}`;
  if (type == "Line") return `https://line.me/ti/p/~${value}`;
  if (type == "Instagram") return `https://www.instagram.com/${value}`;
  if (type == "Discord") return `https://discord.gg/invite/${value}`;
  return value;
}
