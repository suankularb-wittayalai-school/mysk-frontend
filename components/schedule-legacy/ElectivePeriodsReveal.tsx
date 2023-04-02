// External libraries
import { motion } from "framer-motion";
import { FC } from "react";

// SK Components
import { transition, useAnimationConfig } from "@suankularb-components/react";

// Internal components
import SubjectPeriod from "@/components/schedule-legacy/SubjectPeriod";

// Types
import { Role } from "@/utils/types/person";
import {
  PeriodContentItem,
  SchedulePeriod as SchedulePeriodType,
} from "@/utils/types/schedule";

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
  // Animation
  const { duration, easing } = useAnimationConfig();

  return (
    <>
      <motion.div
        className="relative -top-2 -left-2 z-20 mx-0 w-fit rounded-sm border-2
          border-primary bg-surface-2 p-2 text-on-surface-variant"
        onMouseLeave={() => setShow(false)}
        layoutId={`sp-${schedulePeriod.id}-button`}
        transition={transition(duration.medium4, easing.standard)}
      >
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
      </motion.div>
      <div className="fixed inset-0 z-10" onTouchEnd={() => setShow(false)} />
    </>
  );
};

export default ElectivePeriodsReveal;
