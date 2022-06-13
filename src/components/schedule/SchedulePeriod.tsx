// Modules
import { motion } from "framer-motion";
import { useRouter } from "next/router";

// Components
import HoverList from "@components/HoverList";

// Types
import { Role } from "@utils/types/person";
import { SchedulePeriod as SchedulePeriodType } from "@utils/types/schedule";

// Animations
import { animationTransition } from "@utils/animations/config";

// Helpers
import { isInPeriod } from "@utils/helpers/schedule";
import { Subject } from "@utils/types/subject";

const EmptySchedulePeriod = ({ isInSession }: { isInSession: boolean }) => {
  return (
    <div
      className={`h-[3.75rem] w-full rounded-lg ${
        isInSession
          ? "outline-4 outline-offset-[-4px] outline-secondary"
          : "outline-2 outline-offset-[-2px] outline-outline"
      }`}
    />
  );
};

const SchedulePeriod = ({
  schedulePeriod,
  now,
  day,
  periodWidth,
  role,
}: {
  schedulePeriod: SchedulePeriodType;
  now: Date;
  day: Date;
  periodWidth: number;
  role: Role;
}): JSX.Element => {
  const locale = useRouter().locale == "th" ? "th" : "en-US";

  // Component-specific utils
  function getSubjectName(
    duration: SchedulePeriodType["duration"],
    subjectName: Subject["name"]
  ) {
    return duration < 2
      ? subjectName[locale].shortName || subjectName[locale].name
      : subjectName[locale].name;
  }

  return (
    <motion.li
      key={schedulePeriod.startTime}
      className="absolute px-1"
      style={{
        width: periodWidth * schedulePeriod.duration,
        left: periodWidth * (schedulePeriod.startTime - 1),
      }}
      initial={{ scale: 0.8, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.8, y: 20, opacity: 0 }}
      transition={animationTransition}
    >
      {schedulePeriod.subject ? (
        // Filled period
        <div
          className={`flex h-[3.75rem] flex-col rounded-lg px-4 py-2 leading-snug ${
            isInPeriod(
              now,
              day,
              schedulePeriod.startTime,
              schedulePeriod.duration
            )
              ? "container-tertiary shadow"
              : "container-secondary"
          }`}
        >
          {role == "teacher" ? (
            <>
              <span className="max-lines-1 font-display text-xl font-medium">
                {/* TODO: Use data here */}
                M.500
              </span>
              <span
                className="max-lines-1 text-base"
                title={schedulePeriod.subject.name[locale].name}
              >
                {getSubjectName(
                  schedulePeriod.duration,
                  schedulePeriod.subject.name
                )}
              </span>
            </>
          ) : (
            <>
              <span
                className="max-lines-1 font-display text-xl font-medium"
                title={schedulePeriod.subject.name[locale].name}
              >
                {getSubjectName(
                  schedulePeriod.duration,
                  schedulePeriod.subject.name
                )}
              </span>
              <HoverList people={schedulePeriod.subject.teachers} />
            </>
          )}
        </div>
      ) : (
        // Empty period
        <EmptySchedulePeriod
          isInSession={isInPeriod(
            now,
            day,
            schedulePeriod.startTime,
            schedulePeriod.duration
          )}
        />
      )}
    </motion.li>
  );
};

export default SchedulePeriod;
