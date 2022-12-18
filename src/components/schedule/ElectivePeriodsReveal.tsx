// External libraries
import { motion } from "framer-motion";
import { FC, useEffect } from "react";
import { useTranslation } from "next-i18next";

// SK Components
import { Actions, Button } from "@suankularb-components/react";

// Components
import SubjectPeriod from "@components/schedule/SubjectPeriod";

// Animations
import { animationSpeed, animationTransition } from "@utils/animations/config";

// Types
import { Role } from "@utils/types/person";
import {
  PeriodContentItem,
  SchedulePeriod as SchedulePeriodType,
} from "@utils/types/schedule";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

const ElectivePeriodsReveal: FC<{
  show: boolean;
  schedulePeriod: SchedulePeriodType;
  periodWidth: number;
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
  setShow: (value: boolean) => void;
}> = ({
  show,
  schedulePeriod,
  periodWidth,
  day,
  role,
  allowEdit,
  setEditPeriod,
  setDeletePeriod,
  toggleFetched,
  setShow,
}) => {
  const { t } = useTranslation("schedule");

  const [allowClose, toggleAllowClose] = useToggle();
  useEffect(() => {
    if (show) setTimeout(toggleAllowClose, animationSpeed);
    else toggleAllowClose();
  }, [show]);

  return (
    <motion.div
      className="mx-0 w-fit rounded-xl border-2 border-primary bg-surface-2 p-2
        text-on-surface-variant"
      onMouseLeave={() => allowClose && setShow(false)}
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
            {t(`schedule.${role == "teacher" ? "overlap" : "elective"}`)}
          </motion.h1>
        </div>
        <ul className="flex flex-row gap-2">
          {schedulePeriod.content.map((item) => (
            <li
              key={item.id}
              style={{ width: periodWidth * item.duration - 12 }}
            >
              <SubjectPeriod
                schedulePeriod={item}
                isInSession={false}
                day={day}
                role={role}
                allowEdit={allowEdit}
                setEditPeriod={setEditPeriod}
                setDeletePeriod={setDeletePeriod}
                toggleFetched={toggleFetched}
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
          onClick={() => setShow(false)}
        />
      </Actions>
    </motion.div>
  );
};

export default ElectivePeriodsReveal;
