// External libraries
import { useTranslation } from "next-i18next";
import { motion } from "framer-motion";
import { FC, useState } from "react";

// SK Components
import { transition, useAnimationConfig } from "@suankularb-components/react";

// Internal components
import ElectivePeriodDetails from "@/components/schedule/ElectivePeriodDetails";

// Helpers
import { cn } from "@/utils/helpers/className";
import { periodDurationToWidth } from "@/utils/helpers/schedule";

// Types
import { SchedulePeriod } from "@/utils/types/schedule";

const ElectivePeriod: FC<{
  period: SchedulePeriod;
  isInSession?: boolean;
}> = ({ period, isInSession }) => {
  // Translation
  const { t } = useTranslation("schedule");

  // Animation
  const { duration, easing } = useAnimationConfig();

  // Dialog control
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  return (
    <>
      <motion.li
        layoutId={`elective-period-${period.id}`}
        transition={transition(duration.medium2, easing.standard)}
      >
        <button
          className={cn([
            `skc-title-medium tap-highlight-none relative flex h-full flex-col
             justify-center rounded-sm bg-surface-2 px-4 py-2 text-left
             !leading-none text-on-surface transition-shadow before:absolute
             before:inset-0 before:-z-10 before:h-14
             before:rounded-sm before:transition-[transform,box-shadow]
             hover:shadow-1 hover:before:rotate-6 hover:before:shadow-1
             focus:shadow-2 active:before:rotate-0 active:before:shadow-none`,
            isInSession
              ? `bg-tertiary-container text-on-tertiary-container shadow-1
                 before:bg-tertiary-80 hover:shadow-2
                 dark:before:bg-tertiary-20`
              : `bg-surface-2 text-on-surface-variant
                 before:bg-surface-variant`,
          ])}
          style={{ width: periodDurationToWidth(period.duration) }}
          onClick={() => setDetailsOpen(true)}
        >
          {t("schedule.elective")}
        </button>
      </motion.li>
      <ElectivePeriodDetails
        period={period}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </>
  );
};

export default ElectivePeriod;
