// Imports
import getFirstLetterOfName from "@/utils/helpers/getFirstLetterOfName";
import { LangCode } from "@/utils/types/common";
import { Person } from "@/utils/types/person";

/**
 * Joins segments of a name into a single string.
 *
 * @param locale The language of the resulting string.
 * @param name An object with `firstName`, `middleName`, and `lastName`, each as a multi-language string.
 * @param prefix A multi-language string.
 * @param options Options to show or abbreviate a segment.
 * @param options.prefix Shows prefix, defaults to false; "teacher" shows "T." or "ครู".
 * @param options.firstName Shows first name, defaults to true.
 * @param options.middleName Shows middle name, defaults to true.
 * @param options.lastName Shows last name, defaults to true; "abbr" only shows the first letter.
 *
 * @returns The name formatted into a single string.
 */
export default function getLocaleName(
  locale: LangCode,
  name: Partial<
    Pick<Person, "prefix" | "first_name" | "middle_name" | "last_name">
  >,
  options?: Partial<{
    prefix: boolean | "teacher";
    firstName: boolean | "abbr";
    middleName: boolean | "abbr";
    lastName: boolean | "abbr";
  }>,
) {
  const detectedLocale =
    name.first_name?.th &&
    /^[a-zA-Z]/.test(name.first_name?.[locale] || name.first_name.th)
      ? "en-US"
      : "th";
  const closestLocale = name.first_name?.[locale] ? locale : "th";

  const teacherPrefix = { th: "ครู", "en-US": "T." };

  return [
    options?.prefix === "teacher"
      ? teacherPrefix[detectedLocale]
      : options?.prefix && name.prefix?.[detectedLocale],
    [
      options?.firstName !== false &&
        (options?.firstName === "abbr"
          ? getFirstLetterOfName(name.first_name?.[closestLocale] || "")
          : name.first_name?.[closestLocale]),
      options?.middleName !== false &&
        (options?.middleName === "abbr"
          ? getFirstLetterOfName(name.middle_name?.[closestLocale] || "")
          : name.middle_name?.[closestLocale]),
      options?.lastName !== false &&
        (options?.lastName === "abbr"
          ? getFirstLetterOfName(name.last_name?.[closestLocale] || "")
          : name.last_name?.[closestLocale]),
    ]
      .filter((segment) => segment)
      .join(" "),
  ]
    .filter((segment) => segment)
    .join(detectedLocale === "en-US" ? " " : "");
}
