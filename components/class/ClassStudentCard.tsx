// External libraries
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
import { Student } from "@/utils/types/person";
import { cn } from "@/utils/helpers/className";
import Link from "next/link";

const ClassStudentCard: FC<{
  student: Student;
  seperated?: boolean;
  selectedID?: number;
  setSelectedID?: (id: number) => void;
}> = ({ student, seperated, selectedID, setSelectedID }) => {
  const locale = useLocale();
  const { atBreakpoint } = useBreakpoint();
  const thisSelected = selectedID === student.id;

  return (
    <li
      aria-label={nameJoiner(locale, student.name)}
      className={
        seperated
          ? `border-t-outline px-4 sm:px-0
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
              href: `/lookup/class/${student.class.number}/student/${student.id}`,
              element: Link,
            }
          : // If the user is on tablet/desktop, show the selected Student in
            // the detail section
            { onClick: () => setSelectedID && setSelectedID(student.id) })}
        className={cn([
          `w-full items-center pr-3 text-left`,
          thisSelected ? `!bg-primary-container` : `!border-transparent`,
        ])}
      >
        <CardHeader
          avatar={
            <DynamicAvatar
              name={student.name}
              className={
                thisSelected ? "!bg-primary !text-on-primary" : undefined
              }
            />
          }
          title={nameJoiner(locale, student.name)}
          className="grow"
        />
        <span
          className={cn([
            `skc-display-small text-outline [font-feature-settings:"tnum"on,"lnum"on]`,
            thisSelected && `!text-primary`,
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
