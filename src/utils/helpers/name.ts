import { Person } from "@utils/types/person";

export function nameJoiner(
  locale: string,
  name: Person["name"],
  prefix?: Person["prefix"],
  options?: {
    prefix?: boolean;
    firstName?: boolean;
    middleName?: boolean;
    lastName?: boolean;
  }
) {
  const cleanedLocale = locale == "th" ? "th" : "en-US";

  if (options)
    return [
      options.prefix ? prefix : undefined,
      [
        options.firstName ? name[cleanedLocale].firstName : undefined,
        options.middleName ? name[cleanedLocale].middleName : undefined,
        options.lastName ? name[cleanedLocale].lastName : undefined,
      ]
        .map((item) => item != undefined)
        .join(" "),
    ]
      .map((item) => item != undefined)
      .join("");
  else
    return [
      name[cleanedLocale].firstName,
      name[cleanedLocale].middleName,
      name[cleanedLocale].lastName,
    ]
      .map((item) => item != undefined)
      .join(" ");
}
