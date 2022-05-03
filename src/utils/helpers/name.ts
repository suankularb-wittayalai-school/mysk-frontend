import { Person } from "@utils/types/person";

export function nameJoiner(
  locale: "en-US" | "th",
  name: Person["name"],
  prefix?: string,
  options?: {
    prefix?: boolean;
    firstName?: boolean;
    middleName?: boolean;
    lastName?: boolean;
  }
) {
  if (options)
    return [
      options.prefix ? prefix : undefined,
      [
        options.firstName == true || options.firstName == undefined
          ? name[locale]?.firstName || name.th.firstName
          : undefined,
        options.middleName == true || options.middleName == undefined
          ? name[locale]?.middleName || name.th.middleName
          : undefined,
        options.lastName == true || options.lastName == undefined
          ? name[locale]?.lastName || name.th.lastName
          : undefined,
      ]
        .filter((item) => item != undefined)
        .join(" "),
    ]
      .filter((item) => item != undefined)
      .join("");
  else
    return [
      name[locale]?.firstName || name.th.firstName,
      name[locale]?.middleName || name.th.middleName,
      name[locale]?.lastName || name.th.lastName,
    ]
      .filter((item) => item != undefined)
      .join(" ");
}
