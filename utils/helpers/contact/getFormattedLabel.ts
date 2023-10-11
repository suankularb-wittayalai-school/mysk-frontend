// Imports
import { Contact } from "@/utils/types/contact";
import { list } from "radash";
import isURL from "@/utils/helpers/isURL";

export default function getFormattedLabel({ type, value }: Contact) {
  if (type === "phone")
    return list(Math.min(Math.ceil(value.length / 3), 3) - 1)
      .map((setIdx) =>
        value.slice(setIdx * 3, setIdx === 2 ? value.length : setIdx * 3 + 3),
      )
      .join(" ");
  else if (isURL(value)) return new URL(value).hostname;

  return value;
}
