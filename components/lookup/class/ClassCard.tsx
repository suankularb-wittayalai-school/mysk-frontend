// External libraries
import { useTranslation } from "next-i18next";
import { FC } from "react";

// Internal components
import HoverList from "@/components/person/HoverList";

// Types
import { ClassLookupListItem } from "@/utils/types/class";

// SK Components
import { Card, CardHeader } from "@suankularb-components/react";

/**
 * A Card representing a class in the list of classes in the Lookup Classes
 * page.
 *
 * @param classItem An instance of `ClassLookupListItem`, an item from the array fetched from the `getLookupClasses` backend function.
 *
 * @returns A Card.
 */
const ClassCard: FC<{ classItem: ClassLookupListItem }> = ({ classItem }) => {
  const { t } = useTranslation("common");

  return (
    <Card
      appearance="filled"
      direction="row"
      stateLayerEffect
      className="[&_*]:!font-body"
    >
      <CardHeader
        title={t("class", {
          ns: "common",
          number: classItem.number,
        })}
        subtitle={<HoverList people={classItem.classAdvisors} />}
        className="!items-start"
      />
    </Card>
  );
};

export default ClassCard;
