// External libraries
import { FC, ReactNode } from "react";

// SK Components
import { Card, Search } from "@suankularb-components/react";

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
  query: string;
  setQuery: (value: string) => void;
}> = ({ children, length, searchAlt, query, setQuery }) => (
  <aside className="flex flex-col gap-6">
    {/* Search */}
    <Search alt={searchAlt} value={query} onChange={setQuery} />

    {/* List */}
    <div className="flex flex-col gap-2">
      {/* List content */}
      {children}

      {/* Card at the end to explain why the list has stopped */}
      {length > 10 && (
        <Card appearance="outlined">
          <p className="py-2 px-4 text-on-surface-variant">
            {length === 100
              ? "For performance reasons, we limit the number of search results to 100. If you can’t find what you’re looking for, try a more specific query."
              : "You’ve reached the end."}
          </p>
        </Card>
      )}
    </div>
  </aside>
);

export default LookupList;
