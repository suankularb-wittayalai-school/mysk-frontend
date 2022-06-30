import { LangCode, MultiLangObj, MultiLangString } from "@utils/types/common";

export function getLocaleString(
  multiLangString: MultiLangString | MultiLangObj,
  locale: LangCode
): string | {} {
  return multiLangString[locale] || multiLangString.th;
}
