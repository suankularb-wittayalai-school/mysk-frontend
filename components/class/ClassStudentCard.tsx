// External libraries
import Link from "next/link";
import { FC } from "react";

// SK Component
import { Card, CardHeader, useBreakpoint } from "@suankularb-components/react";

// Internal components
import DynamicAvatar from "@/components/common/DynamicAvatar";

// Helpers
import { cn } from "@/utils/helpers/className";
import { getLocaleName, getLocaleString } from "@/utils/helpers/string";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { Student } from "@/utils/types/person";

const ClassStudentCard: FC<{
  student: Pick<Student, "id" | "first_name" | "last_name" | "nickname" | "class_no">;
  seperated?: boolean;
  classNumber?: number;
  selectedID?: string;
  setSelectedID?: (id: string) => void;
}> = ({ student, seperated, classNumber, selectedID, setSelectedID }) => {
  const locale = useLocale();
  const { atBreakpoint } = useBreakpoint();
  const thisSelected = selectedID === student.id;

  return (
    <li
      aria-label={getLocaleName(locale, student)}
      className={
        seperated
          ? `-mx-4 border-t-outline px-4 sm:mx-0 sm:px-0
             [&:nth-child(10n+1):not(:first-child)]:border-t-1
             [&:nth-child(10n+1):not(:first-child)]:pt-2`
          : undefined
      }
    >
      <Card
        appearance="outlined"
        direction="row"
        stateLayerEffect
        {...(atBreakpoint === "base"
          ? // If the user is on mobile, open a new page
            {
              href: classNumber
                ? `/lookup/class/${classNumber}/student/${student.id}`
                : `/class/student/${student.id}`,
              element: Link,
            }
          : // If the user is on tablet/desktop, show the selected Student in
            // the detail section
            { onClick: () => setSelectedID && setSelectedID(student.id) })}
        className={cn([
          `w-full items-center !border-transparent pr-3 text-left`,
          thisSelected &&
            `sm:!border-outline-variant sm:!bg-primary-container
             sm:focus:!border-primary`,
        ])}
      >
        <CardHeader
          avatar={
            <DynamicAvatar
            first_name={student.first_name}
            last_name={student.last_name}
              className={
                thisSelected ? "sm:!bg-primary sm:!text-on-primary" : undefined
              }
            />
          }
          title={getLocaleName(locale, student)}
          subtitle={student.nickname ? getLocaleString(student.nickname, locale) : ""}
          className="grow"
        />
        <span
          className={cn([
            `skc-display-small text-outline
             [font-feature-settings:"tnum"on,"lnum"on]`,
            thisSelected && `sm:!text-primary`,
          ])}
        >
          {student.class_no < 10 && (
            <span className="font-light opacity-30">0</span>
          )}
          {student.class_no}
        </span>
      </Card>
    </li>
  );
};

export default ClassStudentCard;
