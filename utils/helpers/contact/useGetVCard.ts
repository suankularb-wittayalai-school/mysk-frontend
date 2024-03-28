import useConvertContactsForVCard from "@/utils/helpers/contact/useConvertContactsForVCard";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { Student, Teacher } from "@/utils/types/person";
import { useTranslation } from "next-i18next";

/**
 * Returns a function for converting a Student or Teacher into a VCard file.
 */
export default function useGetVCard() {
  const locale = useLocale();
  const { t } = useTranslation("common");

  const convertContactsForVCard = useConvertContactsForVCard();

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
          })};;${person.role === "teacher" ? t("vCard.teacherPrefix") : ""};`,
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
          convertContactsForVCard(person.contacts),

          // Role within the school
          person.role === "teacher" &&
            [
              `ORG:${t("vCard.org")};${getLocaleString(
                person.subject_group.name,
                locale,
              )}`,
              `TITLE:${t("vCard.title")}`,
              person.class_advisor_at &&
                `NOTE:${t("vCard.note", {
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
