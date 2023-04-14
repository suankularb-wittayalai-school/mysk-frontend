// Helpers
import { getLocaleString } from "@/utils/helpers/i18n";

// Types
import { LangCode, MultiLangString } from "@/utils/types/common";
import { Person } from "@/utils/types/person";

/**
 * If a given string starts with a vowel (“เ”, “แ”, “โ”, “ไ”, “ใ”).
 * @param string A string to test.
 * @returns True if it does, false if not.
 */
export function startsWithThaiVowel(string: string) {
  return ["เ", "แ", "โ", "ไ", "ใ"].includes(string[0]);
}

/**
 * Joins segments of a name (usually the return of `db2PersonName`) into a
 * single string.
 *
 * @param locale The language of the resulting string.
 * @param name An object with `firstName`, `middleName`, and `lastName`, each as a multi-language string.
 * @param prefix A multi-language string.
 * @param options Options to show or abbreviate a segment.
 * @param options.prefix Shows prefix, defaults to false.
 * @param options.firstName Shows first name, defaults to true.
 * @param options.middleName Shows middle name, defaults to true.
 * @param options.lastName Shows last name, defaults to true; "abbr" only shows the first letter.
 *
 * @returns The name formatted into a single string.
 */
export function nameJoiner(
  locale: LangCode,
  name: Person["name"],
  prefix?: MultiLangString,
  options?: Partial<{
    prefix: boolean;
    firstName: boolean;
    middleName: boolean;
    lastName: boolean | "abbr";
  }>
) {
  if (options)
    return [
      options.prefix && prefix ? getLocaleString(prefix, locale) : undefined,
      [
        options.firstName === true || options.firstName === undefined
          ? name[locale]?.firstName || name.th.firstName
          : undefined,
        options.middleName === true || options.middleName === undefined
          ? name[locale]?.middleName || name.th.middleName
          : undefined,
        options.lastName === "abbr"
          ? [(name[locale]?.lastName || name.th.lastName)[0], "."].join("")
          : options.lastName === true || options.lastName === undefined
          ? name[locale]?.lastName || name.th.lastName
          : undefined,
      ]
        .filter((item) => item)
        .join(" "),
    ]
      .filter((item) => item)
      .join(locale === "en-US" ? " " : "");
  else
    return [
      name[locale]?.firstName || name.th.firstName,
      name[locale]?.middleName || name.th.middleName,
      name[locale]?.lastName || name.th.lastName,
    ]
      .filter((item) => item)
      .join(" ");
}
