// Modules
import { motion } from "framer-motion";
import { useRouter } from "next/router";

// SK Components
import { MaterialIcon } from "@suankularb-components/react";

// Components
import HoverList from "@components/HoverList";

// Types
import { Role, Teacher } from "@utils/types/person";
import { SchedulePeriod as SchedulePeriodType } from "@utils/types/schedule";

// Animations
import { animationTransition } from "@utils/animations/config";

// Helpers
import { isInPeriod } from "@utils/helpers/schedule";
import { Subject } from "@utils/types/subject";
import { useTranslation } from "next-i18next";

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
    </button>
  );
};

const SubjectSchedulePeriod = ({
  isInSession,
  schedulePeriod,
  role,
}: {
  isInSession: boolean;
  schedulePeriod: SchedulePeriodType;
  role: Role;
}): JSX.Element => {
  const { t } = useTranslation("common");
  const locale = useRouter().locale as "en-US" | "th";

  // Component-specific utils
  function getSubjectName(
    duration: SchedulePeriodType["duration"],
    subjectName: Subject["name"]
  ) {
    return duration < 2
      ? // Short name
        subjectName[locale]?.shortName ||
          subjectName.th.shortName ||
          // If no short name, use name
          subjectName[locale]?.name ||
          subjectName.th.name
      : // Use name my default
        subjectName[locale]?.name || subjectName.th.name;
  }

  type MinifiedSubject = {
    name: Subject["name"];
    teachers: Teacher[];
    coTeachers?: Teacher[] | undefined;
  };

  return (
    <div
      className={`flex h-[3.75rem] flex-col rounded-lg px-4 py-2 leading-snug ${
        isInSession ? "container-tertiary shadow" : "container-secondary"
      }`}
    >
      {role == "teacher" ? (
        <>
          <span className="truncate font-display text-xl font-medium">
            {schedulePeriod.class &&
              t("class", { number: schedulePeriod.class.number })}
          </span>
          <span
            className="truncate text-base"
            title={
              (schedulePeriod.subject as MinifiedSubject).name[locale]?.name ||
              (schedulePeriod.subject as MinifiedSubject).name.th.name
            }
          >
            {getSubjectName(
              schedulePeriod.duration,
              (schedulePeriod.subject as MinifiedSubject).name
            )}
          </span>
        </>
      ) : (
        <>
          <span
            className="truncate font-display text-xl font-medium"
            title={
              (schedulePeriod.subject as MinifiedSubject).name[locale]?.name ||
              (schedulePeriod.subject as MinifiedSubject).name.th.name
            }
          >
            {getSubjectName(
              schedulePeriod.duration,
              (schedulePeriod.subject as MinifiedSubject).name
            )}
          </span>
          <HoverList
            people={(schedulePeriod.subject as MinifiedSubject).teachers}
          />
        </>
      )}
    </div>
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
}): JSX.Element => (
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
      <SubjectSchedulePeriod
        isInSession={isInPeriod(
          now,
          day,
          schedulePeriod.startTime,
          schedulePeriod.duration
        )}
        schedulePeriod={schedulePeriod}
        role={role}
      />
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

export default SchedulePeriod;
