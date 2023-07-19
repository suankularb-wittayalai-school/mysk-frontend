// Types
import { LangCode } from "@/utils/types/common";

export function getLocaleYear(
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

export function getCurrentSemester(): 1 | 2 {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month < 8) return 1;
  else return 2;
}

export function getCurrentAcademicYear(): number {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  if (month <= 4) return year - 1;
  else return year;
}
