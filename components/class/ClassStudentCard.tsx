// External libraries
import Link from "next/link";
import { FC } from "react";

// SK Component
import { Card, CardHeader, useBreakpoint } from "@suankularb-components/react";

// Internal components
import DynamicAvatar from "@/components/common/DynamicAvatar";

// Helpers
import { cn } from "@/utils/helpers/className";
import { getLocaleObj } from "@/utils/helpers/i18n";
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { Student } from "@/utils/types/person";

const ClassStudentCard: FC<{
  student: Student;
  seperated?: boolean;
  classNumber?: number;
  selectedID?: number;
  setSelectedID?: (id: number) => void;
}> = ({ student, seperated, classNumber, selectedID, setSelectedID }) => {
  const locale = useLocale();
  const { atBreakpoint } = useBreakpoint();
  const thisSelected = selectedID === student.id;

  return (
    <li
      aria-label={nameJoiner(locale, student.name)}
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
              name={student.name}
              className={
                thisSelected ? "sm:!bg-primary sm:!text-on-primary" : undefined
              }
            />
          }
          title={nameJoiner(locale, student.name)}
          subtitle={getLocaleObj(student.name, locale).nickname}
          className="grow"
        />
        <span
          className={cn([
            `skc-display-small text-outline
             [font-feature-settings:"tnum"on,"lnum"on]`,
            thisSelected && `sm:!text-primary`,
          ])}
        >
          {student.classNo < 10 && (
            <span className="font-light opacity-30">0</span>
          )}
          {student.classNo}
        </span>
      </Card>
    </li>
  );
};

export default ClassStudentCard;
