import PersonAvatar from "@/components/common/PersonAvatar";
import cn from "@/utils/helpers/cn";
import getLocaleName from "@/utils/helpers/getLocaleName";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { StudentLookupItem } from "@/utils/types/person";
import { Card, CardHeader } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";

/**
 * A card that displays a Student in the list side of Search Students.
 *
 * @param student The Student to display.
 * @param selected If this Student is currently selected.
 * @param onClick The function to set the selected Student.
 */
const LookupStudentCard: StylableFC<{
  student: StudentLookupItem;
  selected?: boolean;
  onClick: (value: string) => void;
}> = ({ student, selected, onClick, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("common");

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
        selected &&
          `sm:!border-outline-variant sm:!bg-primary-container
          sm:!text-on-primary-container sm:focus:!border-primary`,
        className,
      )}
    >
      <CardHeader
        avatar={
          <PersonAvatar
            {...student}
            className={
              selected ? `sm:!bg-primary sm:!text-on-primary` : undefined
            }
          />
        }
        title={getLocaleName(locale, student)}
        subtitle={
          student.classroom
            ? t("class", { number: student.classroom.number })
            : undefined
        }
      />
    </Card>
  );
};

export default LookupStudentCard;
