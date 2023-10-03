// Imports
import ElectivePeriodDetails from "@/components/schedule/ElectivePeriodDetails";
import cn from "@/utils/helpers/cn";
import periodDurationToWidth from "@/utils/helpers/schedule/periodDurationToWidth";
import { StylableFC } from "@/utils/types/common";
import { SchedulePeriod } from "@/utils/types/schedule";
import {
  Interactive,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import va from "@vercel/analytics";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useState } from "react";

const ElectivePeriod: StylableFC<{
  period: SchedulePeriod;
  isInSession?: boolean;
}> = ({ period, isInSession, style, className }) => {
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
        style={style}
        className={cn(
          `relative before:absolute
           before:inset-0 before:-z-10 before:h-14
           before:rounded-sm before:transition-[transform,box-shadow]
           hover:before:rotate-6 hover:before:shadow-1
           active:before:rotate-0 active:before:shadow-none`,
          isInSession
            ? `before:bg-tertiary-80 dark:before:bg-tertiary-20`
            : `before:bg-surface-2`,
          className,
        )}
      >
        <Interactive
          className={cn(
            `flex h-full flex-col justify-center rounded-sm bg-surface-2 px-4
            py-2 text-left transition-shadow hover:shadow-1 focus:shadow-2`,
            isInSession
              ? `bg-tertiary-container text-on-tertiary-container shadow-1
                 hover:shadow-2`
              : `bg-surface-2 text-on-surface-variant`,
          )}
          style={{ width: periodDurationToWidth(period.duration) }}
          onClick={() => {
            va.track("Open Period Details");
            setDetailsOpen(true);
          }}
        >
          <Text type="title-medium" className="!leading-none text-on-surface">
            {t("schedule.elective")}
          </Text>
        </Interactive>
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
