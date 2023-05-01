// External libraries
import { useTranslation } from "next-i18next";
import { FC, ReactNode, useEffect, useState } from "react";

// SK Components
import { Card, Search } from "@suankularb-components/react";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

/**
 * The left side of a Lookup page.
 *
 * @param children The list content.
 * @param length How many items in the list.
 * @param searchAlt The alt text for Search.
 * @param query Search’s field value, if you want Search to be a controlled component.
 * @param onQueryChange Triggered when Search’s field value changes.
 * @param onSearch Triggered when the Search Button is pressed.
 * @param liveFilter If the list is updated live as the user type. If this is `false`, the user is informed that they need to press the Search Button to perform the search.
 */
const LookupList: FC<{
  children: ReactNode;
  length: number;
  searchAlt: string;
  searchFilters?: ReactNode;
  query?: string;
  onQueryChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  liveFilter?: boolean;
}> = ({
  children,
  length,
  searchAlt,
  searchFilters,
  query,
  onQueryChange,
  onSearch,
  liveFilter,
}) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("lookup", { keyPrefix: "common.list" });

  // Form control
  const [internalQuery, setInternalQuery] = useState<string>("");

  return (
    <aside aria-labelledby="header-list" className="flex flex-col gap-3 !pt-0">
      <h2 id="header-list" className="sr-only">
        {t("title")}
      </h2>

      {/* Search */}
      <div
        className="sticky top-[3.25rem] z-10 flex flex-col gap-3 bg-background
          pb-3 pt-6 sm:top-0"
      >
        <Search
          alt={searchAlt}
          value={query || internalQuery}
          locale={locale}
          onChange={(value) => {
            // Reset the list immediately as the user removes the query
            if (onSearch && value === "") onSearch("");
            // (Controlled) Trigger `onQueryChange`
            if (query !== undefined && onQueryChange) {
              onQueryChange(value);
              return;
            }
            // (Apparent uncontrolled)
            // Trigger `onQueryChange` AND update internal form control
            if (onQueryChange) onQueryChange(value);
            setInternalQuery(value);
          }}
          onSearch={() => onSearch && onSearch(query || internalQuery)}
        >
          {!liveFilter && (
            <p className="px-4 text-on-surface-variant">{t("searchHelper")}</p>
          )}
        </Search>
        {searchFilters}
      </div>

      {/* List */}
      <ul className="flex flex-col gap-2">
        {/* List content */}
        {children}

        {/* Card at the end to explain why the list has stopped */}
        {(length === 0 || length > 10) && (
          <li>
            <Card appearance="outlined">
              <p className="px-4 py-2 text-on-surface-variant">
                {length === 100
                  ? t("maxNote")
                  : length === 0
                  ? t("noResults")
                  : t("endOfList")}
              </p>
            </Card>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default LookupList;
