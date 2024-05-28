import getContactIsLinkable from "@/utils/helpers/contact/getContactIsLinkable";
import getContactURL from "@/utils/helpers/contact/getContactURL";
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
        // implementation.
        if (["phone", "email", "website"].includes(contact.type))
          return `${{
            phone: "TEL",
            email: "EMAIL",
            website: "URL",
          }[contact.type as string]!}:${contact.value}`;

        // Lines 34-49 are commentend out because I made this before realizing
        // that `SOCIALPROFILE` is a ”proposed” property not in current use.
        // Would’ve been nice though.

        // // Other contact types use the `SOCIALPROFILE` property.
        // // See: https://www.rfc-editor.org/rfc/rfc9554#section-3.5
        // return `${sift([
        //   `SOCIALPROFILE`,
        //   ["facebook", "line", "instagram", "discord"].includes(contact.type) &&
        //     `SERVICE_TYPE=${
        //       {
        //         facebook: t("contact.facebook"),
        //         line: t("contact.line"),
        //         instagram: t("contact.instagram"),
        //         discord: t("contact.discord"),
        //       }[contact.type as string]
        //     }`,
        //   !isURL(contact.value) && `USERNAME:${contact.value}`,
        //   `VALUE:${getContactIsLinkable(contact) ? "uri" : "text"}`,
        // ]).join(";")}:${contact.value}`;

        // Other contact types are just links.
        if (getContactIsLinkable(contact))
          return sift([
            `item${idx + 1}.URL:${getContactURL(contact)}`,
            contact.type !== "other" &&
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
