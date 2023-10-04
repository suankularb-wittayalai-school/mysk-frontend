// External libraries
import Link from "next/link";
import { FC } from "react";

// SK Component
import { Card, CardHeader, useBreakpoint } from "@suankularb-components/react";

// Internal components
import DynamicAvatar from "@/components/common/DynamicAvatar";

// Helpers
import getLocaleName from "@/utils/helpers/getLocaleName";

// Hooks
import useLocale from "@/utils/helpers/useLocale";

// Types
import { Teacher } from "@/utils/types/person";

const ClassTeacherCard: FC<{
  teacher: Pick<
  Teacher,
  "id" | "role" | "prefix" | "first_name" | "last_name"
>;
  classNumber?: number;
  selectedID?: string;
  setSelectedID?: (id: string) => void;
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
          ? "sm:!bg-primary-container sm:!text-on-primary-container"
          : undefined
      }
    >
      <CardHeader
        avatar={
          <DynamicAvatar
            first_name={teacher.first_name}
            last_name={teacher.last_name}
            className={
              selectedID === teacher.id
                ? "sm:!bg-primary sm:!text-on-primary"
                : undefined
            }
          />
        }
        title={getLocaleName(locale, teacher, {
          prefix: "teacher",
        })}
        className="!text-left"
      />
    </Card>
  );
};

export default ClassTeacherCard;
