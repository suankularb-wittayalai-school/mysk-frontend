// External libraries
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FC } from "react";

// SK Components
import { ListItem, ListItemContent } from "@suankularb-components/react";

// Helpers
import { getLocaleName } from "@/utils/helpers/string";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { Classroom } from "@/utils/types/classroom";

/**
 * When searching for classes in Lookup Classes, the user is presented with a
 * list of suggestions. This is one of the List Items.
 *
 * @param classroom An item from the array fetched from the `getLookupClassrooms` backend function.
 *
 * @returns A List Item.
 */
const ClassSearchResult: FC<{
  classroom: Pick<Classroom, "number" | "class_advisors">;
}> = ({ classroom }) => {
  const locale = useLocale();
  const { t } = useTranslation("common");

  return (
    <ListItem
      align="center"
      lines={classroom.class_advisors.length ? 2 : 1}
      stateLayerEffect
      href={`/lookup/class/${classroom.number}`}
      onClick={() =>
        va.track("Search Class", { number: `M.${classroom.number}` })
      }
      element={Link}
    >
      <ListItemContent
        // Formatted class number
        title={t("class", { number: classroom.number })}
        // A list of all class advisors
        desc={classroom.class_advisors
          .map((teacher) =>
            getLocaleName(locale, teacher, {
              prefix: "teacher",
              middleName: false,
              lastName: "abbr",
            }),
          )
          .join(", ")}
      />
    </ListItem>
  );
};

export default ClassSearchResult;
