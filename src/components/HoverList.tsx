// External libraries
import { useRouter } from "next/router";

// Types
import { LangCode } from "@utils/types/common";
import { Person } from "@utils/types/person";

// Helpers
import { nameJoiner } from "@utils/helpers/name";

const HoverList = ({
  people,
  truncate,
  useFullName,
}: {
  people: { name: Person["name"] }[];
  truncate?: boolean;
  useFullName?: boolean;
}) => {
  const locale = useRouter().locale as LangCode;

  return (
    <span className={`text-base ${truncate ? "truncate" : ""}`}>
      {people.length > 0 &&
        // Show the first person’s name in user locale
        (useFullName
          ? nameJoiner(locale, people[0].name)
          : people[0].name[locale]?.firstName || people[0].name.th.firstName)}
      {
        // If there are more than one person, display +1 and show the remaining people on hover
        people.length > 1 && (
          <abbr
            className="text-outline"
            title={people
              .slice(1)
              .map((person) =>
                useFullName
                  ? nameJoiner(locale, person.name)
                  : person.name[locale]?.firstName || person.name.th.firstName
              )
              .join(", ")}
          >
            +{people.length - 1}
          </abbr>
        )
      }
    </span>
  );
};

export default HoverList;
