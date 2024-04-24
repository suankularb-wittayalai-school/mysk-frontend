import getFirstLetterOfName from "@/utils/helpers/getFirstLetterOfName";
import { LangCode, MultiLangString } from "@/utils/types/common";
import { Person } from "@/utils/types/person";
import { sift } from "radash";

/**
 * Formats a segment of a name for `getLocaleName`.
 *
 * @param segment The segment to format.
 * @param locale The preferred resulting locale of the segment.
 * @param preference The preference to show or abbreviate the segment.
 *
 * @returns The formatted segment.
 *
 * @private
 */
function formatSegment(
  segment: MultiLangString | null | undefined,
  locale: LangCode,
  preference?: boolean | "abbr",
) {
  return (
    // Hide the segment if the preference is false or if it is not available.
    preference !== false &&
    segment?.[locale] &&
    (preference === "abbr"
      ? // Show the first letter of the segment if the preference is `abbr`.
        getFirstLetterOfName(segment?.[locale] || "") + "." // Followed by a period.
      : // Show the segment if the preference is true.
        segment?.[locale])
  );
}

/**
 * Joins segments of a name into a single string.
 *
 * @param locale The language of the resulting string.
 * @param name An object with `firstName`, `middleName`, and `lastName`, each as a multi-language string.
 * @param prefix A multi-language string.
 * @param options Options to show or abbreviate a segment.
 * @param options.prefix Shows prefix, defaults to false; "teacher" shows "T." or "ครู".
 * @param options.firstName Shows first name, defaults to true; "abbr" only shows the first letter.
 * @param options.middleName Shows middle name, defaults to true; "abbr" only shows the first letter.
 * @param options.lastName Shows last name, defaults to true; "abbr" only shows the first letter.
 *
 * @returns The name formatted into a single string.
 */
export default function getLocaleName(
  locale: LangCode,
  name: Partial<
    Pick<Person, "prefix" | "first_name" | "middle_name" | "last_name">
  >,
  options: Partial<{
    prefix: boolean | "teacher";
    firstName: boolean | "abbr";
    middleName: boolean | "abbr";
    lastName: boolean | "abbr";
  }> = {
    prefix: false,
    firstName: true,
    middleName: "abbr",
    lastName: true,
  },
) {
  // Detect the locale of the `th` first name.
  // (Foreigners use the Thai name field for their English name.)
  const detectedLocale =
    name.first_name?.th &&
    /^[a-zA-Z]/.test(name.first_name?.[locale] || name.first_name.th)
      ? "en-US"
      : "th";
  // Try to use the locale passed to the function, but fallback to `th` if the
  // first name is not available in the passed locale, as `th` is required.
  const closestLocale = name.first_name?.[locale] ? locale : "th";

  const teacherPrefix = { th: "ครู", "en-US": "T." };

  return sift([
    options?.prefix === "teacher"
      ? teacherPrefix[detectedLocale]
      : options?.prefix && name.prefix?.[detectedLocale],
    [
      formatSegment(name.first_name, closestLocale, options?.firstName),
      formatSegment(name.middle_name, closestLocale, options?.middleName),
      formatSegment(name.last_name, closestLocale, options?.lastName),
    ]
      .filter((segment) => segment)
      .join(" "),
  ]).join(detectedLocale === "en-US" ? " " : "");
}
