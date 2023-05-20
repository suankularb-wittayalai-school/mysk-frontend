// External libraries
import { useTranslation } from "next-i18next";

// Helpers
import { getLocaleString } from "@/utils/helpers/i18n";
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { Contact } from "@/utils/types/contact";
import { Student, Teacher } from "@/utils/types/person";

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

          // Name
          `N:${nameJoiner(locale, person.name, undefined, {
            firstName: false,
          })};${nameJoiner(locale, person.name, undefined, {
            lastName: false,
          })};;${
            person.role === "teacher"
              ? t("people.dialog.share.saveVCard.segment.teacherPrefix")
              : ""
          };`,
          `FN:${nameJoiner(locale, person.name, undefined, {
            prefix: person.role === "teacher" ? "teacher" : false,
          })}`,

          // Birthday
          `BDAY:${person.birthdate.split("-").join("")}`,

          // Contacts
          person.contacts
            .map((contact, idx) => {
              switch (contact.type) {
                case "Phone":
                  return `item${idx + 1}.TEL;type=CELL:${contact.value}`;
                case "Email":
                  return `item${idx + 1}.EMAIL;type=INTERNET:${contact.value}`;
                default:
                  if (getContactIsLinkable(contact))
                    return [
                      `item${idx + 1}.URL:${getContactURL(contact)}`,
                      !["Website", "Other"].includes(contact.value) &&
                        `item${idx + 1}.X-ABLabel:${
                          {
                            Facebook: tx("contact.facebook"),
                            Line: tx("contact.line"),
                            Instagram: tx("contact.instagram"),
                            Discord: tx("contact.discord"),
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
              `item1.ORG:${t(
                "people.dialog.share.saveVCard.segment.org"
              )};${getLocaleString(person.subjectGroup.name, locale)}`,
              `item2.TITLE:${t("people.dialog.share.saveVCard.segment.title")}`,
              person.classAdvisorAt &&
                `NOTE:${t("people.dialog.share.saveVCard.segment.note", {
                  number: person.classAdvisorAt.number,
                })}`,
            ]
              .filter((segment) => segment)
              .join("\n"),

          // VCard metadata
          `KIND:individual`,
          `REV:${new Date().toISOString()}`,

          // File footer
          `END:VCARD`,
        ]
          .filter((segment) => segment)
          .join("\n"),
      ],
      { type: "text/vcard;charset=utf-8" }
    );
}
