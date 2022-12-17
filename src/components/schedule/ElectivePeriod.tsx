// External libraries
import { LayoutGroup, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useState } from "react";

// Components
import ElectivePeriodsReveal from "@components/schedule/ElectivePeriodsReveal";

// Animations
import { animationTransition } from "@utils/animations/config";

// Types
import { Role } from "@utils/types/person";
import { SchedulePeriod } from "@utils/types/schedule";

const ElectivePeriod = ({
  isInSession,
  periodWidth,
  schedulePeriod,
  day,
  role,
  allowEdit,
}: {
  isInSession: boolean;
  periodWidth: number;
  schedulePeriod: SchedulePeriod;
  day: Day;
  role: Role;
  allowEdit?: boolean;
}) => {
  const { t } = useTranslation("schedule");

  // Dialog control
  const [showPeriods, setShowPeriods] = useState<boolean>(false);

  return (
    <LayoutGroup>
      {!showPeriods ? (
        <motion.button
          className={[
            `group relative h-[3.75rem] w-full rounded-lg text-left
              align-middle font-display text-xl font-medium leading-none`,
            isInSession
              ? "bg-tertiary-translucent-12 text-on-tertiary-container shadow"
              : "bg-surface-2 text-on-surface-variant",
          ].join(" ")}
          onMouseEnter={() => setShowPeriods(true)}
          onClick={() => setShowPeriods(true)}
          layoutId={`sp-${schedulePeriod.id}-button`}
          transition={animationTransition}
        >
          <div className="px-4 py-2">
            <motion.span
              layoutId={`sp-${schedulePeriod.id}-header`}
              transition={animationTransition}
            >
              {t(`schedule.${role == "teacher" ? "overlap" : "elective"}`)}
            </motion.span>
          </div>
        </motion.button>
      ) : (
        <ElectivePeriodsReveal
          show={showPeriods}
          schedulePeriod={schedulePeriod}
          periodWidth={periodWidth}
          day={day}
          role={role}
          allowEdit={allowEdit}
          setShow={setShowPeriods}
        />
      )}
    </LayoutGroup>
  );
};

export default ElectivePeriod;
