// Imports
import { LangCode, MultiLangString } from "@/utils/types/common";

export default function getLocaleString(
  multiLangString: MultiLangString,
  locale: LangCode,
): string {
  return multiLangString[locale] || multiLangString.th;
}
