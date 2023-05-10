import { LangCode, MultiLangObj, MultiLangString } from "@/utils/types/common";

export function getLocaleString(
  multiLangString: MultiLangString,
  locale: LangCode
): string {
  return multiLangString[locale] || multiLangString.th;
}

export function getLocaleObj(
  multiLangString: MultiLangObj,
  locale: LangCode
): any {
  return multiLangString[locale] || multiLangString.th;
}

export function getLocalePath(path: string, locale: LangCode): string {
  return [locale == "th" ? "" : "/en-US", path].join("");
}
