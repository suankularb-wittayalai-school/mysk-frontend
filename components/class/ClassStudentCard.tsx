// External libraries
import { FC } from "react";

// SK Component
import { Card, CardHeader } from "@suankularb-components/react";

// Internal components
import DynamicAvatar from "@/components/common/DynamicAvatar";

// Helpers
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { Student } from "@/utils/types/person";
import { cn } from "@/utils/helpers/className";

const ClassStudentCard: FC<{
  student: Student;
  selectedID?: number;
  setSelectedID?: (id: number) => void;
}> = ({ student, selectedID, setSelectedID }) => {
  const locale = useLocale();

  const thisSelected = selectedID === student.id;

  return (
    <li
      aria-label={nameJoiner(locale, student.name)}
      className="border-t-outline px-4 sm:px-0
        [&:nth-child(10n+1):not(:first-child)]:border-t-1
        [&:nth-child(10n+1):not(:first-child)]:pt-2"
    >
      <Card
        appearance="outlined"
        direction="row"
        stateLayerEffect
        onClick={() => setSelectedID && setSelectedID(student.id)}
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
