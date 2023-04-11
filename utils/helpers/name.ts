// Helpers
import { getLocaleString } from "@/utils/helpers/i18n";

// Types
import { LangCode, MultiLangString } from "@/utils/types/common";
import { Person } from "@/utils/types/person";

export function nameJoiner(
  locale: LangCode,
  name: Person["name"],
  prefix?: MultiLangString,
  options?: Partial<{
    prefix: boolean;
    firstName: boolean;
    middleName: boolean;
    lastName: boolean;
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
        options.lastName === true || options.lastName === undefined
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
      .filter((item) => item != undefined)
      .join(" ");
}
