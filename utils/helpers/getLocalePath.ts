// Imports
import { LangCode } from "@/utils/types/common";

export default function getLocalePath(path: string, locale: LangCode): string {
  return [locale == "th" ? "" : "/en-US", path].join("");
}
