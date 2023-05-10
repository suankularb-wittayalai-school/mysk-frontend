// External libraries
import { FC } from "react";

// Types
import { Person } from "@/utils/types/person";

// Helpers
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

const HoverList: FC<{
  people: { name: Person["name"]; prefix?: Person["prefix"] }[];
  options?: Partial<{
    nameJoinerOptions: Parameters<typeof nameJoiner>["3"];
    maxVisibleLength: number;
  }>;
  className?: string;
}> = ({ people, options, className }) => {
  const locale = useLocale();

  /**
   * The number of names shown, the rest are collapsed
   */
  const maxVisibleLength = options?.maxVisibleLength || 1;

  return (
    <span className={className}>
      {people.length > 0 &&
        // Visible names
        people
          .slice(0, maxVisibleLength)
          .map((person) =>
            nameJoiner(
              locale,
              person.name,
              person.prefix,
              options?.nameJoinerOptions || {
                middleName: false,
                lastName: false,
              }
            )
          )
          .join(", ")}
      {
        // Other names are collapsed into a number (i.e. +1), with a tooltip
        // showing the full list of these names
        people.length > maxVisibleLength && (
          <abbr
            tabIndex={0}
            className="text-outline"
            title={people
              .slice(maxVisibleLength)
              .map((person) =>
                nameJoiner(
                  locale,
                  person.name,
                  person.prefix,
                  options?.nameJoinerOptions || { lastName: false }
                )
              )
              .join(", ")}
          >
            +{people.length - maxVisibleLength}
          </abbr>
        )
      }
    </span>
  );
};

export default HoverList;
