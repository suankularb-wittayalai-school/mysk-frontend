// External libraries
import { FC } from "react";

// SK Components
import { Card, ChipSet } from "@suankularb-components/react";

// Internal components
import ScheduleSubjectChip from "@/components/schedule/ScheduleSubjectChip";

// Types
import { SubjectWNameAndCode } from "@/utils/types/subject";

const SubjectsInChargeCard: FC<{ subjects: SubjectWNameAndCode[] }> = ({
  subjects,
}) => {
  return (
    <Card
      appearance="filled"
      className="mx-4 min-h-[3rem] gap-2 px-4 pt-2 pb-4 sm:mx-0 sm:!flex-row
        sm:items-center sm:gap-4 sm:py-2"
    >
      <h3 className="skc-title-medium whitespace-nowrap">Your subjects</h3>
      <ChipSet>
        {subjects.map((subject) => (
          <ScheduleSubjectChip key={subject.id} subject={subject} />
        ))}
      </ChipSet>
    </Card>
  );
};

export default SubjectsInChargeCard;
