import { LangCode, MultiLangString } from "@utils/types/common";

export function getLocaleString(
  multiLangString: MultiLangString,
  locale: LangCode
) {
  return multiLangString[locale] || multiLangString.th;
}
