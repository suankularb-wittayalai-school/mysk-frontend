// Imports
import { MultiLangString } from "@/utils/types/common";

export default function mergeDBLocales(
  data?: any,
  key?: string,
): MultiLangString {
  return data && key
    ? { th: data[`${key}_th`], "en-US": data[`${key}_en`] }
    : { th: "", "en-US": null };
}
