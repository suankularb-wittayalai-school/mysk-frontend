import ScheduleSubjectChip from "@/components/schedule/ScheduleSubjectChip";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Subject } from "@/utils/types/subject";
import { Card, ChipSet, Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * Displays a Card with a set of Chips, each denoting a Subject, that a Teacher
 * can drag onto the Schedule.
 *
 * @param subjects An array of Subjects this Teacher is in charge of. The data return of `getSubjectsInCharge`.
 */
const SubjectsInChargeCard: StylableFC<{
  subjects: Pick<Subject, "id" | "name" | "code" | "short_name">[];
}> = ({ subjects, style, className }) => {
  const { t } = useTranslation("schedule");

  return (
    <Card
      appearance="filled"
      style={style}
      className={cn(
        `mx-4 min-h-[3rem] gap-2 sm:mx-0 md:!flex-row md:items-center md:gap-4
        md:py-2`,
        className,
      )}
    >
      <Text
        type="title-medium"
        element="h3"
        className="whitespace-nowrap px-4 pt-2 md:pt-0"
      >
        {t("schedule.yourSubjects")}
      </Text>
      <div>
        <ChipSet className="px-4 pb-4 sm:pb-3 md:pb-0 md:pl-0">
          {subjects.map((subject) => (
            <ScheduleSubjectChip key={subject.id} subject={subject} />
          ))}
        </ChipSet>
      </div>
    </Card>
  );
};

export default SubjectsInChargeCard;
