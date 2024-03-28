import { LangCode } from "@/utils/types/common";
import { useRouter } from "next/router";

/**
 * Returns the current locale code.
 *
 * @returns A `LangCode` representing the current locale.
 */
export default function useLocale(): LangCode {
  return useRouter().locale as LangCode;
}
