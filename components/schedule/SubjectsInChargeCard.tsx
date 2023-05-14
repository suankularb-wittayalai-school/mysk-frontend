// External libraries
import { useTranslation } from "next-i18next";
import { FC } from "react";

// SK Components
import { Card, ChipSet } from "@suankularb-components/react";

// Internal components
import ScheduleSubjectChip from "@/components/schedule/ScheduleSubjectChip";

// Types
import { SubjectWNameAndCode } from "@/utils/types/subject";

/**
 * Displays a Card with a set of Chips, each denoting a Subject, that a Teacher
 * can drag onto the Schedule.
 *
 * @param subjects An array of Subjects this Teacher is in charge of. The data return of `getSubjectsInCharge`.
 *
 * @returns A Card.
 */
const SubjectsInChargeCard: FC<{
  subjects: SubjectWNameAndCode[];
}> = ({ subjects }) => {
  // Translation
  const { t } = useTranslation("schedule");

  return (
    <Card
      appearance="filled"
      className="mx-4 min-h-[3rem] gap-2 !overflow-visible px-4 pb-4 pt-2
        sm:mx-0 sm:pb-3 md:!flex-row md:items-center md:gap-4 md:py-2"
    >
      <h3 className="skc-title-medium whitespace-nowrap">
        {t("schedule.yourSubjects")}
      </h3>
      <ChipSet>
        {subjects.map((subject) => (
          <ScheduleSubjectChip key={subject.id} subject={subject} />
        ))}
      </ChipSet>
    </Card>
  );
};

export default SubjectsInChargeCard;
