// Imports
import { getContactIsLinkable, getContactURL } from "@/utils/helpers/contact";
import { Contact } from "@/utils/types/contact";
import { useTranslation } from "next-i18next";
import { sift } from "radash";

/**
 * A hook that returns a function for converting Contacts into a string that
 * can be used in a vCard.
 *
 * @note Does not return an actual vCard nor the full string content of a vCard.
 *
 * @note Yes, I know this is a weird hook name.
 */
export default function useConvertContactsForVCard() {
  const { t } = useTranslation("common");

  return (contacts: Contact[]) =>
    sift(
      contacts.map((contact, idx) => {
        // Contact types natively supported by vCard use the native
        // implementation
        if (contact.type === "phone")
          return `item${idx + 1}.TEL:${contact.value}`;
        if (contact.type === "email")
          return `item${idx + 1}.EMAIL:${contact.value}`;

        // Other contact types are just links
        if (getContactIsLinkable(contact))
          return sift([
            `item${idx + 1}.URL:${getContactURL(contact)}`,
            !["website", "other"].includes(contact.value) &&
              `item${idx + 1}.X-ABLabel:${
                {
                  facebook: t("contact.facebook"),
                  line: t("contact.line"),
                  instagram: t("contact.instagram"),
                  discord: t("contact.discord"),
                }[contact.type as string]
              }`,
          ]).join("\n");
      }),
    ).join("\n");
}
