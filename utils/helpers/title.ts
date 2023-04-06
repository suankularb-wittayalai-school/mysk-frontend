import { TFunction } from "next-i18next";

export function createTitleStr(pageName: string, t: TFunction) {
  if (window.matchMedia("(display-mode: standalone)").matches) return pageName;
  return `${pageName} - ${t("brand.name", { ns: "common" })}`;
}
