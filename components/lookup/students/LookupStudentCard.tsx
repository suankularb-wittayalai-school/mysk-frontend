// Imports
import DynamicAvatar from "@/components/common/DynamicAvatar";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { StudentLookupItem } from "@/utils/types/person";
import { Card, CardHeader } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A card that displays a Student in the list side of Search Students.
 *
 * @param student The Student to display.
 * @param selected The currently selected Student.
 * @param onClick The function to set the selected Student.
 */
const LookupStudentCard: StylableFC<{
  student: StudentLookupItem;
  selected?: string;
  onClick: (value: string) => void;
}> = ({ student, selected, onClick, style, className }) => {
  const locale = useLocale();
  const { t: tx } = useTranslation("common");

  return (
    <Card
      appearance="outlined"
      direction="row"
      stateLayerEffect
      onClick={() => onClick(student.id)}
      style={style}
      className={cn(
        `w-full !rounded-none !border-transparent !bg-transparent text-left
        sm:!rounded-full`,
        student.id === selected &&
          `sm:!border-outline-variant sm:!bg-primary-container
          sm:!text-on-primary-container sm:focus:!border-primary`,
        className,
      )}
    >
      <CardHeader
        avatar={
          <DynamicAvatar
            first_name={student.first_name}
            last_name={student.last_name}
            className={
              student.id === selected
                ? `sm:!bg-primary sm:!text-on-primary`
                : undefined
            }
          />
        }
        title={getLocaleName(locale, student)}
        subtitle={
          student.classroom
            ? tx("class", { number: student.classroom.number })
            : undefined
        }
      />
    </Card>
  );
};

export default LookupStudentCard;
