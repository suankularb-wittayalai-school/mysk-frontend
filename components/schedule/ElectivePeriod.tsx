// External libraries
import { LayoutGroup, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { FC, useState } from "react";

// Internal components
import ElectivePeriodsReveal from "@/components/schedule/ElectivePeriodsReveal";

// Animations
import { animationTransition } from "@/utils/animations/config";

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

  // Dialog control
  const [showPeriods, setShowPeriods] = useState<boolean>(false);

  return (
    <LayoutGroup>
      {!showPeriods ? (
        <motion.button
          className={[
            `group relative h-14 w-full rounded-sm text-left
              align-middle font-display text-xl font-medium leading-none`,
            isInSession
              ? "bg-tertiary-translucent-12 shadow text-on-tertiary-container"
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
