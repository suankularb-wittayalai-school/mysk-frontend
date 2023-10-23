// External libraries
import { useTranslation } from "next-i18next";
import { FC } from "react";

// SK Components
import { Card, ChipSet, Text } from "@suankularb-components/react";

// Internal components
import ScheduleSubjectChip from "@/components/schedule/ScheduleSubjectChip";

// Types
import cn from "@/utils/helpers/cn";
import { Subject } from "@/utils/types/subject";

/**
 * Displays a Card with a set of Chips, each denoting a Subject, that a Teacher
 * can drag onto the Schedule.
 *
 * @param subjects An array of Subjects this Teacher is in charge of. The data return of `getSubjectsInCharge`.
 *
 * @returns A Card.
 */
const SubjectsInChargeCard: FC<{
  subjects: Pick<Subject, "id" | "name" | "code" | "short_name">[];
}> = ({ subjects }) => {
  // Translation
  const { t } = useTranslation("schedule");

  return (
    <Card
      appearance="filled"
      className={cn(`mx-4 min-h-[3rem] gap-2 px-4 pb-4 pt-2 sm:mx-0 sm:pb-3
        md:!flex-row md:items-center md:gap-4 md:py-2`)}
    >
      <Text type="title-medium" element="h3" className="whitespace-nowrap">
        {t("schedule.yourSubjects")}
      </Text>
      <ChipSet>
        {subjects.map((subject) => (
          <ScheduleSubjectChip key={subject.id} subject={subject} />
        ))}
      </ChipSet>
    </Card>
  );
};

export default SubjectsInChargeCard;
