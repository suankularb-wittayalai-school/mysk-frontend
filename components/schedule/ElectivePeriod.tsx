import ElectivePeriodDetails from "@/components/schedule/ElectivePeriodDetails";
import cn from "@/utils/helpers/cn";
import periodDurationToWidth from "@/utils/helpers/schedule/periodDurationToWidth";
import { StylableFC } from "@/utils/types/common";
import { SchedulePeriod } from "@/utils/types/schedule";
import {
  DURATION,
  EASING,
  Interactive,
  Text,
  transition,
} from "@suankularb-components/react";
import va from "@vercel/analytics";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useState } from "react";

/**
 * When many Schedule Periods overlap, they are grouped into a single Elective
 * Period.
 *
 * @param period The Schedule Period to render.
 * @param isInSession Whether the Schedule Period is currently in session.
 */
const ElectivePeriod: StylableFC<{
  period: SchedulePeriod;
  isInSession?: boolean;
}> = ({ period, isInSession, style, className }) => {
  // Translation
  const { t } = useTranslation("schedule");

  // Animation

  // Dialog control
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  return (
    <>
      {!detailsOpen ? (
        <motion.li
          layoutId={`elective-period-${period.id}`}
          transition={transition(DURATION.medium2, EASING.standard)}
          style={style}
          className={cn(`relative`, className)}
        >
          <Interactive
            className={cn(
              `flex h-full flex-col justify-center rounded-sm px-4 py-2
              text-left transition-shadow hover:shadow-1 focus:shadow-2`,
              isInSession
                ? `bg-tertiary-container text-on-tertiary-container shadow-1
                  hover:shadow-2`
                : `bg-surface-variant text-primary`,
            )}
            style={{ width: periodDurationToWidth(period.duration) }}
            onClick={() => {
              va.track("Open Period Details");
              setDetailsOpen(true);
            }}
          >
            <Text type="title-medium" className="!leading-none">
              {t("schedule.elective")}
            </Text>
          </Interactive>
        </motion.li>
      ) : (
        <li
          style={{ width: periodDurationToWidth(period.duration) }}
          className="h-14 w-24"
        />
      )}
      <ElectivePeriodDetails
        period={period}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </>
  );
};

export default ElectivePeriod;
