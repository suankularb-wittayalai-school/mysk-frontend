// Imports
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import isURL from "@/utils/helpers/isURL";
import useLocale from "@/utils/helpers/useLocale";
import { Contact } from "@/utils/types/contact";
import { Student, Teacher } from "@/utils/types/person";
import { useTranslation } from "next-i18next";

/**
 * Converts Contact value into a URL depending on the type.
 *
 * @param contact The Contact to be converted.
 *
 * @returns A URL that can be used in links.
 */
export function getContactURL({ type, value }: Contact) {
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

/**
 * Checks if a given Contact can be converted into a link.
 *
 * @param contact The Contact to be checked.
 *
 * @returns A boolean.
 */
export function getContactIsLinkable({ type, value }: Contact): boolean {
  if (type !== "other" && !(type === "discord" && !isURL(value))) return true;
  return isURL(value);
}

export function useGetVCard() {
  const locale = useLocale();
  const { t } = useTranslation("lookup");
  const { t: tx } = useTranslation("common");

  return (person: Student | Teacher) =>
    new Blob(
      [
        [
          // File header
          `BEGIN:VCARD`,
          `VERSION:3.0`,

          // Full name
          `N:${getLocaleName(locale, person, {
            firstName: false,
          })};${getLocaleName(locale, person, {
            lastName: false,
          })};;${
            person.role === "teacher"
              ? t("people.dialog.share.saveVCard.segment.teacherPrefix")
              : ""
          };`,
          `FN:${getLocaleName(locale, person, {
            prefix: person.role === "teacher" ? "teacher" : false,
          })}`,

          // Nickname
          (person.nickname?.th || person.nickname?.["en-US"]) &&
            `NICKNAME:${getLocaleString(person.nickname, locale)}`,

          // Birthday
          person.birthdate &&
            `BDAY:${new Date(person.birthdate).toISOString()}`,

          // Contacts
          person.contacts
            .map((contact, idx) => {
              switch (contact.type) {
                case "phone":
                  return `item${idx + 1}.TEL:${contact.value}`;
                case "email":
                  return `item${idx + 1}.EMAIL:${contact.value}`;
                default:
                  if (getContactIsLinkable(contact))
                    return [
                      `item${idx + 1}.URL:${getContactURL(contact)}`,
                      !["Website", "Other"].includes(contact.value) &&
                        `item${idx + 1}.X-ABLabel:${
                          {
                            facebook: tx("contact.facebook"),
                            line: tx("contact.line"),
                            instagram: tx("contact.instagram"),
                            discord: tx("contact.discord"),
                          }[contact.type as string]
                        }`,
                    ]
                      .filter((segment) => segment)
                      .join("\n");
                  break;
              }
            })
            .filter((segment) => segment)
            .join("\n"),

          // Role within the school
          person.role === "teacher" &&
            [
              `ORG:${t(
                "people.dialog.share.saveVCard.segment.org",
              )};${getLocaleString(person.subject_group.name, locale)}`,
              `TITLE:${t("people.dialog.share.saveVCard.segment.title")}`,
              person.class_advisor_at &&
                `NOTE:${t("people.dialog.share.saveVCard.segment.note", {
                  number: person.class_advisor_at.number,
                })}`,
            ]
              .filter((segment) => segment)
              .join("\n"),

          // Profile
          person.profile && `PHOTO:${person.profile}`,

          // VCard metadata
          `KIND:individual`,
          `REV:${new Date().toISOString()}`,

          // File footer
          `END:VCARD`,
        ]
          .filter((segment) => segment)
          .join("\n"),
      ],
      { type: "text/vcard;charset=utf-8" },
    );
}
