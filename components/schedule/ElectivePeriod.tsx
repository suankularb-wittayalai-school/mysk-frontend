// External libraries
import { useTranslation } from "next-i18next";
import { motion } from "framer-motion";
import { FC, useState } from "react";

// SK Components
import { transition, useAnimationConfig } from "@suankularb-components/react";

// Internal components
import ElectivePeriodDetails from "@/components/schedule/ElectivePeriodDetails";

// Types
import { SchedulePeriod } from "@/utils/types/schedule";

const ElectivePeriod: FC<{ period: SchedulePeriod }> = ({ period }) => {
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
          className="skc-title-medium tap-highlight-none flex h-full w-24
            flex-col justify-center rounded-sm bg-surface-2 px-4 py-2
            text-left !leading-none text-on-surface transition-shadow
            hover:shadow-1 focus:shadow-2"
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
