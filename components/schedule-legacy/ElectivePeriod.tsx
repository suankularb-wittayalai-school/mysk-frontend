// External libraries
import { LayoutGroup, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { FC, useState } from "react";

// SK Components
import { transition, useAnimationConfig } from "@suankularb-components/react";

// Internal components
import ElectivePeriodsReveal from "@/components/schedule-legacy/ElectivePeriodsReveal";

// Types
import { Role } from "@/utils/types/person";
import { PeriodContentItem, SchedulePeriod } from "@/utils/types/schedule";

const ElectivePeriod: FC<{
  isInSession: boolean;
  periodWidth: number;
  schedulePeriod: SchedulePeriod;
  day: Day;
  role: Role;
  allowEdit?: boolean;
  setEditPeriod?: ({
    show,
    day,
    schedulePeriod,
  }: {
    show: boolean;
    day: Day;
    schedulePeriod: PeriodContentItem;
  }) => void;
  setDeletePeriod?: ({
    show,
    periodID,
  }: {
    show: boolean;
    periodID: number;
  }) => void;
  toggleFetched?: () => void;
}> = ({
  isInSession,
  periodWidth,
  schedulePeriod,
  day,
  role,
  allowEdit,
  setEditPeriod,
  setDeletePeriod,
  toggleFetched,
}) => {
  const { t } = useTranslation("schedule");
  const { duration, easing } = useAnimationConfig();

  // Dialog control
  const [showPeriods, setShowPeriods] = useState<boolean>(false);

  return (
    <LayoutGroup>
      {!showPeriods ? (
        <motion.button
          className={[
            `skc-title-medium group relative h-14 w-full rounded-sm text-left
            align-middle !leading-none`,
            isInSession
              ? "bg-tertiary-translucent-12 shadow text-on-tertiary-container"
              : "bg-surface-2 text-on-surface-variant",
          ].join(" ")}
          onMouseEnter={() => setShowPeriods(true)}
          onClick={() => setShowPeriods(true)}
          layoutId={`sp-${schedulePeriod.id}-button`}
          transition={transition(duration.medium4, easing.standard)}
        >
          <div className="px-4 py-2">
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={transition(duration.medium4, easing.standard)}
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
          setEditPeriod={setEditPeriod}
          setDeletePeriod={setDeletePeriod}
          toggleFetched={toggleFetched}
          setShow={setShowPeriods}
        />
      )}
    </LayoutGroup>
  );
};

export default ElectivePeriod;
