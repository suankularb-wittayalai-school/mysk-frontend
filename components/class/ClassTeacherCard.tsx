// External libraries
import Link from "next/link";
import { FC } from "react";

// SK Component
import { Card, CardHeader, useBreakpoint } from "@suankularb-components/react";

// Internal components
import DynamicAvatar from "@/components/common/DynamicAvatar";

// Helpers
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { PersonLookupItemGeneric } from "@/utils/types/person";

const ClassTeacherCard: FC<{
  teacher: PersonLookupItemGeneric<null>;
  classNumber?: number;
  selectedID?: number;
  setSelectedID?: (id: number) => void;
}> = ({ teacher, classNumber, selectedID, setSelectedID }) => {
  const locale = useLocale();
  const { atBreakpoint } = useBreakpoint();

  return (
    <Card
      key={teacher.id}
      appearance="outlined"
      stateLayerEffect
      {...(atBreakpoint === "base"
        ? // If the user is on mobile, open a new page
          {
            href: classNumber
              ? `/lookup/class/${classNumber}/teacher/${teacher.id}`
              : `/class/teacher/${teacher.id}`,
            element: Link,
          }
        : // If the user is on tablet/desktop, show the selected Student in
          // the detail section
          { onClick: () => setSelectedID && setSelectedID(teacher.id) })}
      className={
        selectedID === teacher.id
          ? "!bg-primary-container !text-on-primary-container"
          : undefined
      }
    >
      <CardHeader
        avatar={
          <DynamicAvatar
            name={teacher.name}
            className={
              selectedID === teacher.id
                ? "!bg-primary !text-on-primary"
                : undefined
            }
          />
        }
        title={nameJoiner(locale, teacher.name)}
        className="!text-left"
      />
    </Card>
  );
};

export default ClassTeacherCard;
