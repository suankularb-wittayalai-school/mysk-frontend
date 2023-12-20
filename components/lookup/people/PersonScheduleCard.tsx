// Imports
import Schedule from "@/components/schedule/Schedule";
import getClassSchedule from "@/utils/backend/schedule/getClassSchedule";
import getTeacherSchedule from "@/utils/backend/schedule/getTeacherSchedule";
import cn from "@/utils/helpers/cn";
import createEmptySchedule from "@/utils/helpers/schedule/createEmptySchedule";
import { StylableFC } from "@/utils/types/common";
import { Person, Student, Teacher, UserRole } from "@/utils/types/person";
import { Schedule as ScheduleType } from "@/utils/types/schedule";
import {
  Progress,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * A Card that contains the Schedule of a Student or Teacher.
 *
 * @param person The Student or Teacher to show the schedule of.
 * @param open If the Card is open and shown.
 */
const PersonScheduleCard: StylableFC<{
  person: Pick<Person, "id"> &
    (Pick<Student, "role" | "classroom"> | Pick<Teacher, "role">);
  open?: boolean;
}> = ({ person, open, style, className }) => {
  const { duration, easing } = useAnimationConfig();

  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();

  const [schedule, setSchedule] = useState<ScheduleType>(
    createEmptySchedule(1, 5),
  );

  // Fetch schedule when open
  useEffect(() => {
    if (!(open && loading)) return;
    if (person.role === "student" && !person.classroom) return;
    (async () => {
      const { data } = await (person.role === UserRole.teacher
        ? getTeacherSchedule(supabase, person.id)
        : getClassSchedule(supabase, person.classroom!.id));
      if (data) setSchedule(data);
      setLoading(false);
      return true;
    })();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          layout="size"
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition(duration.medium2, easing.standardDecelerate)}
          style={{ ...style, borderRadius: 12 }}
          className={cn(`overflow-hidden rounded-md bg-surface`, className)}
        >
          {loading ? (
            <motion.div
              layout="position"
              transition={transition(duration.medium2, easing.standard)}
              className="grid place-content-center p-4"
            >
              <Progress appearance="circular" alt="Loading schedule…" visible />
            </motion.div>
          ) : (
            <motion.div
              layout="position"
              transition={transition(duration.medium2, easing.standard)}
            >
              <Schedule
                schedule={schedule}
                view={person.role}
                className={cn(
                  // Add left padding to Day Cards and Number Row
                  `sm:[&>figure>ul>li>div:first-child]:!pl-3
                  sm:[&>figure>ul>li>ul:first-child>li:first-child]:!w-[9.75rem]`,
                  // Add right padding to content (and fix left padding on mobile)
                  `[&>figure>ul]:!px-3 sm:[&>figure>ul]:!pl-0 sm:[&>figure>ul]:!pr-3`,
                  // Resize and vertical scroll on container
                  `!mt-0 !pb-2 [&>figure]:resize-y [&>figure]:!overflow-y-auto
                  sm:[&>figure]:h-72 sm:[&>figure]:max-h-[24.125rem]`,
                )}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PersonScheduleCard;
