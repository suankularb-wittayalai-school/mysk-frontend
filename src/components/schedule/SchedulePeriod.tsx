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
import { Button, MaterialIcon } from "@suankularb-components/react";

const EmptySchedulePeriod = ({ isInSession }: { isInSession: boolean }) => {
  return (
    <button
      className={`group grid h-[3.75rem] w-full place-items-center rounded-lg text-4xl transition-[outline-color]
          hover:bg-primary-translucent-08 hover:outline-primary
          focus:bg-primary-translucent-12 focus:outline-primary ${
            isInSession
              ? "outline-4 outline-offset-[-4px] outline-secondary"
              : "outline-2 outline-offset-[-2px] outline-outline"
          }`}
    >
      <MaterialIcon
        icon="add"
        allowCustomSize
        className="scale-90 text-primary opacity-0 transition-all
            group-hover:scale-100 group-hover:opacity-100
            group-focus:scale-100 group-focus:opacity-100"
      />
      {/* <div
        className="scale-90 opacity-0 transition-all
          group-hover:scale-100 group-hover:opacity-100
          group-focus:scale-100 group-focus:opacity-100"
      >
        <Button name="Add period here" type="filled" icon={<MaterialIcon icon="add" />} iconOnly />
      </div> */}
    </button>
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
