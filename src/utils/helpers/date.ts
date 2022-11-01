// Types
import { LangCode } from "@utils/types/common";

export function getLocaleYear(
  locale: LangCode,
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

export function getCurrentSemester(): 1 | 2 {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month < 8) return 1;
  else return 2;
}

export function getCurrentAcademicYear(): number {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  if (month <= 3) return year - 1;
  else return year;
}
