// Imports
import { LangCode } from "@/utils/types/common";

export default function getLocaleYear(
  locale: LangCode,
  year: number,
  fromType?: "AD" | "BE",
): number {
  return (
    year +
    // From BE to AD (year - 543)
    (fromType === "BE" && locale === "en-US"
      ? -543
      : // From AD to BE (year + 543)
      fromType === "AD" && locale === "th"
      ? 543
      : 0)
  );
}
