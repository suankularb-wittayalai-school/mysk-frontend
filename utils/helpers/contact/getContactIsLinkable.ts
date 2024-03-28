import isURL from "@/utils/helpers/isURL";
import { Contact } from "@/utils/types/contact";

/**
 * Checks if a given Contact can be converted into a link.
 *
 * @param contact The Contact to be checked.
 *
 * @returns A boolean.
 */
export default function getContactIsLinkable({
  type,
  value,
}: Pick<Contact, "type" | "value">): boolean {
  if (type !== "other" && !(type === "discord" && !isURL(value))) return true;
  return isURL(value);
}
