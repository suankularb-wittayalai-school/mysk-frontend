import { TFunction } from "next-i18next";

export function createTitleStr(pageName: string, t: TFunction) {
  return `${pageName} - ${t("brand.name", { ns: "common" })}`;
}
