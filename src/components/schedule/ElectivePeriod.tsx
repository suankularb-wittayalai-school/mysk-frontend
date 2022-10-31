// External libraries
import { LayoutGroup, motion } from "framer-motion";
import { useTranslation } from "next-i18next";

// SK Components
import { MaterialIcon } from "@suankularb-components/react";

// Components
import ElectivePeriodsReveal from "@components/schedule/ElectivePeriodsReveal";

// Animations
import { animationTransition } from "@utils/animations/config";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

// Types
import { Role } from "@utils/types/person";
import { SchedulePeriod } from "@utils/types/schedule";
import { useState } from "react";

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
            `group relative h-[3.75rem] w-full rounded-lg
              text-left font-display text-xl font-medium leading-none`,
            isInSession
              ? "bg-tertiary-translucent-12 text-on-tertiary-container shadow"
              : "bg-surface-2 text-on-surface-variant",
          ].join(" ")}
          onMouseEnter={() => setShowPeriods(true)}
          layoutId={`sp-${schedulePeriod.id}-button`}
          transition={animationTransition}
        >
          <div className="px-4 py-2">
            <motion.span
              layoutId={`sp-${schedulePeriod.id}-header`}
              transition={animationTransition}
            >
              {t("schedule.elective")}
            </motion.span>
          </div>
        </motion.button>
      ) : (
        <ElectivePeriodsReveal
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
