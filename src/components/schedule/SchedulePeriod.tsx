// Modules
import { motion } from "framer-motion";
import { useRouter } from "next/router";

// Types
import { Role, Teacher } from "@utils/types/person";
import { SchedulePeriod as SchedulePeriodType } from "@utils/types/schedule";

// Animations
import { animationTransition } from "@utils/animations/config";

// Helpers
import { isInPeriod } from "@utils/helpers/schedule";
import { Subject } from "@utils/types/subject";

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
      ? subjectName[locale].shortName ?? subjectName[locale].name
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
              <TeacherTeachingList teachers={schedulePeriod.subject.teachers} />
            </>
          )}
        </div>
      ) : (
        // Empty period
        <div
          className={`h-[3.75rem] w-full rounded-lg ${
            isInPeriod(
              now,
              day,
              schedulePeriod.startTime,
              schedulePeriod.duration
            )
              ? "outline-4 outline-offset-[-4px] outline-secondary"
              : "outline-2 outline-offset-[-2px] outline-outline"
          }`}
        />
      )}
    </motion.li>
  );
};

const TeacherTeachingList = ({
  teachers,
}: {
  teachers: { name: Teacher["name"] }[];
}) => {
  const locale = useRouter().locale == "th" ? "th" : "en-US";

  return (
    <span className="max-lines-1 text-base">
      {teachers.length > 0 &&
        // Show the first teacher’s first name in user locale
        (teachers[0].name[locale]?.firstName || teachers[0].name.th.firstName)}
      {
        // If there are more than one teacher, display +1 and show the remaining teachers on hover
        teachers.length > 1 && (
          <abbr
            className="text-secondary opacity-50"
            title={teachers
              .slice(1)
              .map(
                (teacher) =>
                  teacher.name[locale]?.firstName || teacher.name.th.firstName
              )
              .join(", ")}
          >
            +{teachers.length - 1}
          </abbr>
        )
      }
    </span>
  );
};

export default SchedulePeriod;
