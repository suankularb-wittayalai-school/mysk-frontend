// External libraries
import { motion } from "framer-motion";
import { FC, useContext, useState } from "react";

// SK Components
import { transition, useAnimationConfig } from "@suankularb-components/react";

// Internal components
import HoverList from "@/components/person/HoverList";
import PeriodDetails from "@/components/schedule/PeriodDetails";

// Contexts
import ScheduleContext from "@/contexts/ScheduleContext";

// Helpers
import { getLocaleObj } from "@/utils/helpers/i18n";
import { getSubjectName } from "@/utils/helpers/schedule";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { PeriodContentItem } from "@/utils/types/schedule";

const SubjectPeriod: FC<{ period: PeriodContentItem }> = ({ period }) => {
  // Translation
  const locale = useLocale();

  // Animation
  const { duration, easing } = useAnimationConfig();

  // Context
  const { role, constraintsRef } = useContext(ScheduleContext);

  // Dialog control
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  return (
    <>
      <motion.li
        layoutId={`period-${period.id}`}
        transition={transition(duration.medium2, easing.standard)}
        drag={role === "teacher"}
        whileDrag={{ boxShadow: "var(--shadow-3)" }}
        dragConstraints={constraintsRef}
        dragMomentum={false}
        onDragEnd={(_, info) => console.log(info.point)}
        className="rounded-sm transition-shadow"
      >
        <button
          className="tap-highlight-none flex w-24 flex-col rounded-sm
            bg-secondary-container px-4 py-2 text-on-secondary-container
            transition-shadow hover:shadow-1 focus:shadow-2"
          style={{
            width:
              // Calculate period width by duration
              period.duration * 96 +
              // Correct for missing gap in the middle of multi-period periods
              (period.duration - 1) * 8,
          }}
          onClick={() => role === "student" && setDetailsOpen(true)}
        >
          <span
            className="skc-title-medium truncate"
            title={getLocaleObj(period.subject.name, locale).name}
          >
            {getSubjectName(period.duration, period.subject.name, locale)}
          </span>
          <span className="skc-body-small">
            <HoverList people={period.subject.teachers} />
          </span>
        </button>
      </motion.li>
      <PeriodDetails
        period={period}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </>
  );
};

export default SubjectPeriod;
