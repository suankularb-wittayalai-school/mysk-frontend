import { MultiLangString } from "@/utils/types/common";

/**
 * Merge the Thai and English locale strings (values with keys suffixed with
 * locale like `_th` or `_en`) from the database into a single `MultiLangString`
 * object.
 *
 * @param data An object containing the locale strings.
 * @param key The key to index into the object without the locale suffix.
 *
 * @returns A `MultiLangString` object.
 */
export default function mergeDBLocales<Key extends string>(
  data: { [key in `${Key}_${"th" | "en"}`]: string | null } | null,
  key: Key,
): MultiLangString {
  return data?.[`${key}_th`]
    ? { th: data[`${key}_th`]!, "en-US": data[`${key}_en`] }
    : { th: "", "en-US": null };
}
