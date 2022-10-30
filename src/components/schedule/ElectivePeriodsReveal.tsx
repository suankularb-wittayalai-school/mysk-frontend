// External libraries
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";

// SK Components
import { Actions, Button } from "@suankularb-components/react";

// Components
import SubjectPeriod from "@components/schedule/SubjectPeriod";

// Animations
import { animationTransition } from "@utils/animations/config";

// Types
import { Role } from "@utils/types/person";
import { SchedulePeriod as SchedulePeriodType } from "@utils/types/schedule";

const ElectivePeriodsReveal = ({
  schedulePeriod,
  periodWidth,
  day,
  role,
  allowEdit,
  toggleShow,
}: {
  schedulePeriod: SchedulePeriodType;
  periodWidth: number;
  day: Day;
  role: Role;
  allowEdit?: boolean;
  toggleShow: () => void;
}): JSX.Element => {
  const { t } = useTranslation("schedule");

  return (
    <motion.div
      className="mx-0 w-fit rounded-xl border-2 border-primary bg-surface-2 p-2
        text-on-surface-variant"
      layoutId={`sp-${schedulePeriod.id}-button`}
      transition={animationTransition}
    >
      <div className="flex flex-row gap-2">
        <div className="px-2">
          <motion.h1
            className="truncate font-display text-xl font-medium"
            layoutId={`sp-${schedulePeriod.id}-header`}
            transition={animationTransition}
          >
            {t("schedule.elective")}
          </motion.h1>
        </div>
        <ul className="flex flex-row gap-2">
          {schedulePeriod.content.map((item) => (
            <li
              key={item.id}
              style={{ width: periodWidth * schedulePeriod.duration - 12 }}
            >
              <SubjectPeriod
                schedulePeriod={item}
                isInSession={false}
                day={day}
                role={role}
                allowEdit={allowEdit}
                className="shadow"
              />
            </li>
          ))}
        </ul>
      </div>
      <Actions className="pt-2">
        <Button
          label={t("schedule.electiveReveal.action.close")}
          type="text"
          onClick={toggleShow}
        />
      </Actions>
    </motion.div>
  );
};

export default ElectivePeriodsReveal;
