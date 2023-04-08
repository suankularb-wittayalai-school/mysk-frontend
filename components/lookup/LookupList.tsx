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
 * @param query Search’s field value, as Search is a controlled component.
 * @param setQuery Triggered when Search’s field value changes.
 */
const LookupList: FC<{
  children: ReactNode;
  length: number;
  searchAlt: string;
  onSearch: (value: string) => void;
}> = ({ children, length, searchAlt, onSearch }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("lookup", { keyPrefix: "common.list" });

  // Query
  const [query, setQuery] = useState<string>("");
  useEffect(() => {
    if (!query) onSearch("");
  }, [query]);

  return (
    <aside className="flex flex-col gap-6">
      {/* Search */}
      <Search
        alt={searchAlt}
        value={query}
        locale={locale}
        onChange={setQuery}
        onSearch={() => onSearch(query)}
      >
        <p className="px-4 text-on-surface-variant">{t("searchHelper")}</p>
      </Search>

      {/* List */}
      <div className="flex flex-col gap-2">
        {/* List content */}
        {children}

        {/* Card at the end to explain why the list has stopped */}
        {length > 10 && (
          <Card appearance="outlined">
            <p className="py-2 px-4 text-on-surface-variant">
              {length === 100 ? t("maxNote") : t("endOfList")}
            </p>
          </Card>
        )}
      </div>
    </aside>
  );
};

export default LookupList;
