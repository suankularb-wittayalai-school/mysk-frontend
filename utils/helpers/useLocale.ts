// Imports
import { LangCode } from "@/utils/types/common";
import { useRouter } from "next/router";

export default function useLocale(): LangCode {
  return useRouter().locale as LangCode;
}
