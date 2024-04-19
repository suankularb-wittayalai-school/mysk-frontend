import { LangCode } from "@/utils/types/common";

const BE_AD_DIFFERENCE = 543;

export default function getLocaleYear(
  locale: LangCode,
  year: number,
  fromType: "AD" | "BE" = "AD",
): number {
  if (fromType === "BE" && locale === "en-US") return year - BE_AD_DIFFERENCE;
  else if (fromType === "AD" && locale === "th") return year + BE_AD_DIFFERENCE;
  else return year;
}
