import { LangCode } from "@/utils/types/common";

const BE_AD_DIFFERENCE = 543;

/**
 * Converts a year between the Buddhist Era (BE) and the Anno Domini (AD) calendar.
 *
 * @param locale The locale to convert the year to.
 * @param year The year to convert.
 * @param fromType The type of the year to convert from, either "AD" or "BE".
 *
 * @returns The converted year.
 */
export default function getLocaleYear(
  locale: LangCode,
  year: number,
  fromType: "AD" | "BE" = "AD",
): number {
  if (fromType === "BE" && locale === "en-US") return year - BE_AD_DIFFERENCE;
  else if (fromType === "AD" && locale === "th") return year + BE_AD_DIFFERENCE;
  else return year;
}
