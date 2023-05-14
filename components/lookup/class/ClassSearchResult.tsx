// External libraries
import va from "@vercel/analytics";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { FC } from "react";

// SK Components
import { ListItem, ListItemContent } from "@suankularb-components/react";

// Helpers
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { ClassLookupListItem } from "@/utils/types/class";

/**
 * When searching for classes in Lookup Classes, the user is presented with a
 * list of suggestions. This is one of the List Items.
 *
 * @param classItem An instance of `ClassLookupListItem`, an item from the array fetched from the `getLookupClasses` backend function.
 *
 * @returns A List Item.
 */
const ClassSearchResult: FC<{ classItem: ClassLookupListItem }> = ({
  classItem,
}) => {
  const locale = useLocale();
  const { t } = useTranslation("common");

  return (
    <ListItem
      align="center"
      lines={classItem.classAdvisors.length ? 2 : 1}
      stateLayerEffect
      href={`/lookup/class/${classItem.number}`}
      onClick={() =>
        va.track("Search Class", { number: `M.${classItem.number}` })
      }
      element={Link}
    >
      <ListItemContent
        // Formatted class number
        title={t("class", { number: classItem.number })}
        // A list of all class advisors
        desc={classItem.classAdvisors
          .map(({ name }) =>
            nameJoiner(locale, name, undefined, {
              prefix: "teacher",
              middleName: false,
              lastName: "abbr",
            })
          )
          .join(", ")}
      />
    </ListItem>
  );
};

export default ClassSearchResult;
