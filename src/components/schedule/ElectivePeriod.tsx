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
import { SchedulePeriod } from "@utils/types/schedule";

const ElectivePeriod = ({
  isInSession,
  periodWidth,
  schedulePeriod,
}: {
  isInSession: boolean;
  periodWidth: number;
  schedulePeriod: SchedulePeriod;
}) => {
  const { t } = useTranslation("schedule");

  // Dialog control
  const [showPeriods, toggleShowPeriods] = useToggle();

  return (
    <LayoutGroup>
      {!showPeriods ? (
        <motion.button
          className={[
            `group relative h-[3.75rem] w-full rounded-lg
              text-left font-display text-xl font-medium leading-none
              before:pointer-events-none before:absolute before:inset-0
              before:rounded-xl before:transition-[background-color]
              hover:before:bg-on-primary-translucent-08
              hover:before:transition-none`,
            isInSession
              ? "bg-tertiary-translucent-12 text-on-tertiary-container shadow"
              : "bg-surface-2 text-on-surface-variant",
          ].join(" ")}
          onClick={toggleShowPeriods}
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
          <div
            className="pointer-events-none absolute top-0 z-30 h-full w-full
              rounded-lg border-2 border-primary bg-secondary-translucent-12
              opacity-0 transition-[opacity] group-hover:opacity-100
              group-focus:opacity-100"
          >
            <div
              className="primary pointer-events-auto absolute top-0 left-1/2
                -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface
                p-1 text-xl shadow transition-[opacity] hover:transition-none
                focus:opacity-95 focus:transition-none"
            >
              <MaterialIcon icon="open_in_full" allowCustomSize />
            </div>
          </div>
        </motion.button>
      ) : (
        <ElectivePeriodsReveal
          schedulePeriod={schedulePeriod}
          periodWidth={periodWidth}
          toggleShow={toggleShowPeriods}
        />
      )}
    </LayoutGroup>
  );
};

export default ElectivePeriod;
