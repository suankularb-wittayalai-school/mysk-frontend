// External libraries
import { motion } from "framer-motion";
import { FC, useContext } from "react";

// Internal components
import HoverList from "@/components/person/HoverList";

// Contexts
import ScheduleContext from "@/contexts/ScheduleContext";

// Helpers
import { getLocaleObj } from "@/utils/helpers/i18n";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { PeriodContentItem, SchedulePeriod } from "@/utils/types/schedule";
import { Subject } from "@/utils/types/subject";

const SubjectPeriod: FC<{ period: PeriodContentItem }> = ({ period }) => {
  // Translation
  const locale = useLocale();

  // Context
  const { role, constraintsRef } = useContext(ScheduleContext);

  /**
   * Format a Subject Period’s Subject name with the duration in mind
   *
   * @param duration The length of this Period
   * @param subjectName The Subject name object
   *
   * @returns A formatted Subject name to be shown in a Subject Period
   */
  function getSubjectName(
    duration: SchedulePeriod["duration"],
    subjectName: Subject["name"]
  ) {
    return duration < 2
      ? // If short period, use short name
        subjectName[locale]?.shortName ||
          subjectName.th.shortName ||
          // If no short name, use name
          subjectName[locale]?.name ||
          subjectName.th.name
      : // If long period, use name
        subjectName[locale]?.name || subjectName.th.name;
  }

  return (
    <motion.li
      drag={role === "teacher"}
      whileDrag={{ boxShadow: "var(--shadow-3)" }}
      dragConstraints={constraintsRef}
      dragMomentum={false}
      onDragEnd={(_, info) => console.log(info.point)}
      className="rounded-sm transition-shadow"
    >
      <button
        className="flex w-24 flex-col rounded-sm bg-secondary-container px-4
          py-2 text-on-secondary-container transition-shadow hover:shadow-1
          focus:shadow-2"
        style={{
          width:
            // Calculate period width by duration
            period.duration * 96 +
            // Correct for missing gap in the middle of multi-period periods
            (period.duration - 1) * 8,
        }}
      >
        <span
          className="skc-title-medium truncate"
          title={getLocaleObj(period.subject.name, locale).name}
        >
          {getSubjectName(period.duration, period.subject.name)}
        </span>
        <span className="skc-body-small">
          <HoverList people={period.subject.teachers} />
        </span>
      </button>
    </motion.li>
  );
};

export default SubjectPeriod;
