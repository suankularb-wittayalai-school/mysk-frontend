// External libraries
import { motion } from "framer-motion";

// SK Components
import { transition, useAnimationConfig } from "@suankularb-components/react";

// Internal components
import ElectivePeriod from "@/components/schedule/ElectivePeriod";
import SubjectPeriod from "@/components/schedule/SubjectPeriod";
import EmptyPeriod from "@/components/schedule/EmptyPeriod";

// Helpers
import { isInPeriod } from "@/utils/helpers/schedule";

// Types
import { Role } from "@/utils/types/person";
import {
  SchedulePeriod as SchedulePeriodType,
  PeriodContentItem,
} from "@/utils/types/schedule";

// Schedule Period
const SchedulePeriod = ({
  schedulePeriod,
  now,
  day,
  periodWidth,
  role,
  allowEdit,
  setAddPeriod,
  setEditPeriod,
  setDeletePeriod,
  toggleFetched,
}: {
  schedulePeriod: SchedulePeriodType;
  now: Date;
  day: Date;
  periodWidth: number;
  role: Role;
  allowEdit?: boolean;
  setAddPeriod?: ({
    show,
    day,
    startTime,
  }: {
    show: boolean;
    day: Day;
    startTime: number;
  }) => void;
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
}): JSX.Element => {
  // Animation
  const { duration, easing } = useAnimationConfig();

  return (
    <motion.li
      key={
        schedulePeriod.content.length > 0
          ? `sp-${schedulePeriod.id}`
          : `sp-${day.getDay()}-${schedulePeriod.startTime}`
      }
      className="absolute px-1 transition-[width]"
      style={{
        zIndex: schedulePeriod.content.length > 1 ? 30 : undefined,
        width: periodWidth * schedulePeriod.duration,
        left: periodWidth * (schedulePeriod.startTime - 1),
      }}
      layoutId={
        schedulePeriod.content.length > 0
          ? `sp-${schedulePeriod.id}`
          : undefined
      }
      initial={{ scale: 0.8, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.8, y: 20, opacity: 0 }}
      transition={transition(duration.short4, easing.standard)}
    >
      {schedulePeriod.content.length > 1 ? (
        // Elective period
        <ElectivePeriod
          isInSession={isInPeriod(
            now,
            day,
            schedulePeriod.startTime,
            schedulePeriod.duration
          )}
          periodWidth={periodWidth}
          schedulePeriod={schedulePeriod}
          day={day.getDay() as Day}
          role={role}
          allowEdit={allowEdit}
          setEditPeriod={setEditPeriod}
          setDeletePeriod={setDeletePeriod}
          toggleFetched={toggleFetched}
        />
      ) : schedulePeriod.content.length == 1 ? (
        // Filled period
        <SubjectPeriod
          isInSession={isInPeriod(
            now,
            day,
            schedulePeriod.startTime,
            schedulePeriod.duration
          )}
          schedulePeriod={schedulePeriod.content[0]}
          day={day.getDay() as Day}
          role={role}
          allowEdit={allowEdit}
          setEditPeriod={setEditPeriod}
          setDeletePeriod={setDeletePeriod}
          toggleFetched={toggleFetched}
        />
      ) : (
        // Empty period
        <EmptyPeriod
          isInSession={isInPeriod(
            now,
            day,
            schedulePeriod.startTime,
            schedulePeriod.duration
          )}
          day={day.getDay() as Day}
          startTime={schedulePeriod.startTime}
          role={role}
          allowEdit={allowEdit}
          setAddPeriod={setAddPeriod}
          toggleFetched={toggleFetched}
        />
      )}
    </motion.li>
  );
};

export default SchedulePeriod;
