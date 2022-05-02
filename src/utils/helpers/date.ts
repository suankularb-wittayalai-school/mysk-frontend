export function getLocaleYear(
  locale: "en-US" | "th",
  year: number,
  fromType?: "AD" | "BE"
): number {
  if (fromType == "BE") {
    // From BE to AD
    if (locale == "en-US") return year - 543;
    // From BE to BE
    else return year;
  } else {
    // From AD to AD
    if (locale == "en-US") return year;
    // From AD to BE
    else return year + 543;
  }
}
