import AttendanceCountsGrid from "@/components/attendance/AttendanceCountsGrid";
import AttendanceFigure from "@/components/attendance/AttendanceFigure";
import TodayAttendanceCard from "@/components/lookup/students/TodayAttendanceCard";
import getAttendancesOfStudent from "@/utils/backend/attendance/getAttendancesOfStudent";
import tallyAttendances from "@/utils/helpers/attendance/tallyAttendances";
import cn from "@/utils/helpers/cn";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import { SEMESTER_1_START_MONTH } from "@/utils/helpers/getCurrentSemester";
import { StudentAttendance } from "@/utils/types/attendance";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import {
  Button,
  MaterialIcon,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { addDays, isWithinInterval } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { last } from "radash";
import { useEffect, useState } from "react";

/**
 * How far back to show the Attendance Figure for (in days).
 */
const FIGURE_DATES_COUNT = 15;

/**
 * A summary of a Student’s Attendance for display in Student Details Card.
 *
 * @param studentID The ID of the Student. Used in fetching.
 * @param classroom The Classroom the Student is in.
 */
const StudentAttendanceSummary: StylableFC<{
  studentID: string;
  classroom: Pick<Classroom, "number"> | null;
}> = ({ studentID, classroom, style, className }) => {
  const now = new Date();
  const interval = {
    start: addDays(now, -FIGURE_DATES_COUNT),
    end: now,
  };
  const academicYear = getCurrentAcademicYear();

  const { duration, easing } = useAnimationConfig();

  const [attendances, setAttendances] = useState<
    (Omit<StudentAttendance, "student"> & { date: string })[]
  >([]);

  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await getAttendancesOfStudent(supabase, studentID, {
        start: new Date(academicYear, SEMESTER_1_START_MONTH - 1, 1), // April 1st
        end: new Date(academicYear + 1, SEMESTER_1_START_MONTH - 2, 30), // March 30th
      });
      if (data) setAttendances(data);
      setLoading(false);
    })();
  }, [studentID]);

  return (
    <section
      aria-labelledby="detail-attendance"
      style={style}
      className={cn(`space-y-2`, className)}
    >
      <div className="flex flex-row items-center rounded-md bg-surface pl-3 pr-1">
        <Text
          type="title-medium"
          element={(props) => <h3 id="detail-attendance" {...props} />}
          className="grow"
        >
          Attendance
        </Text>
        <Button appearance="text" icon={<MaterialIcon icon="history" />}>
          See history
        </Button>
      </div>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={loading ? "loading" : "loaded"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition(duration.short4, easing.standard)}
          className={cn(
            `grid grid-cols-2 gap-2 *:h-20 *:rounded-md md:grid-cols-4
            [&>:last-child]:col-span-2`,
            loading && `animate-pulse *:bg-surface`,
          )}
        >
          {classroom && !loading ? (
            <>
              <TodayAttendanceCard
                attendance={last(attendances)?.assembly}
                classroom={classroom}
              />
              <AttendanceCountsGrid
                counts={tallyAttendances(
                  attendances.map((attendance) => attendance.assembly),
                )}
                className={cn(`!grid !grid-cols-2 !items-stretch gap-1
                  *:gap-0.5 *:rounded-md *:bg-surface *:pl-2 *:pr-3`)}
              />
              <AttendanceFigure
                interval={interval}
                attendances={attendances.filter((attendance) =>
                  isWithinInterval(new Date(attendance.date), interval),
                )}
                className="!h-auto bg-surface p-2"
              />
            </>
          ) : (
            <>
              <div />
              <div />
              <div />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default StudentAttendanceSummary;
