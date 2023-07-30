// Imports
import { LangCode, MultiLangString } from "@/utils/types/common";
import { Person } from "@/utils/types/person";

/**
 * If a given string starts with a vowel (“เ”, “แ”, “โ”, “ไ”, “ใ”).
 * @param string A string to test.
 * @returns True if it does, false if not.
 */
export function startsWithThaiVowel(string: string) {
  return ["เ", "แ", "โ", "ไ", "ใ"].includes(string?.[0]);
}

export function getLocaleString(
  multiLangString: MultiLangString,
  locale: LangCode,
): string {
  return multiLangString[locale] || multiLangString.th;
}

export function getLocalePath(path: string, locale: LangCode): string {
  return [locale == "th" ? "" : "/en-US", path].join("");
}

export function mergeDBLocales(data: any, key: string): MultiLangString {
  return { th: data[`${key}_th`], "en-US": data[`${key}_en`] };
}

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
export function getLocaleName(
  locale: LangCode,
  name: Partial<
    Pick<Person, "prefix" | "first_name" | "middle_name" | "last_name">
  >,
  options?: Partial<{
    prefix: boolean | "teacher";
    firstName: boolean;
    middleName: boolean;
    lastName: boolean;
  }>,
) {
  const firstNameLocale =
    name.first_name?.th &&
    /^[a-zA-Z]/.test(name.first_name?.[locale] || name.first_name.th)
      ? "en-US"
      : "th";

  const teacherPrefix = {
    th: "ครู",
    "en-US": "T.",
  };

  return [
    options?.prefix && options?.prefix == "teacher"
      ? teacherPrefix[firstNameLocale]
      : name.prefix?.[firstNameLocale] + locale === "en-US"
      ? " "
      : "",
    options?.firstName !== false && name.first_name?.[firstNameLocale],
    options?.middleName !== false && name.middle_name?.[firstNameLocale],
    options?.lastName !== false && name.last_name?.[firstNameLocale],
  ]
    .filter((segment) => segment)
    .join(" ");
}
