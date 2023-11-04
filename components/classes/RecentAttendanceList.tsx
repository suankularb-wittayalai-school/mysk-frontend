// Imports
import AttendanceDialog from "@/components/classes/AttendanceDialog";
import RecentAttendanceItem from "@/components/classes/RecentAttendanceItem";
import getAttendanceSummaryOfClass from "@/utils/backend/attendance/getAttendanceSummaryOfClass";
import cn from "@/utils/helpers/cn";
import { AttendanceAtDate } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  Card,
  MaterialIcon,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { list } from "radash";
import { useEffect, useState } from "react";

/**
 * A list of recent Attendance events grouped into dates for Class Details
 * Card.
 *
 * @param classroomID The ID of the Classroom to display Attendance for.
 * @param teacherID The ID of the Teacher currently logged in, if the user is a Teacher. Used for Attendance.
 */
const RecentAttendanceList: StylableFC<{
  classroomID: string;
  classroomSize: number;
  teacherID?: string;
}> = ({ classroomID, classroomSize, teacherID, style, className }) => {
  const { duration, easing } = useAnimationConfig();

  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(true);

  const [attendanceList, setAttendanceList] = useState<AttendanceAtDate[]>([]);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await getAttendanceSummaryOfClass(
        supabase,
        classroomID,
      );
      if (data) setAttendanceList(data);
      setLoading(false);
    })();
  }, [classroomID]);

  const [addOpen, setAddOpen] = useState(false);

  return (
    <section style={style} className={cn(`space-y-2`, className)}>
      <Text
        type="title-medium"
        element="h4"
        className="rounded-md bg-surface px-3 py-2"
      >
        Attendance
      </Text>
      <div className="relative -mx-4 overflow-auto">
        <ul className="flex h-[7.5rem] w-fit flex-row gap-2 px-4">
          {teacherID && (
            <li className="h-full">
              <Card
                appearance="filled"
                stateLayerEffect
                onClick={() => setAddOpen(true)}
                className={cn(`!grid h-full w-24 place-items-center
                !bg-primary-container`)}
              >
                <MaterialIcon
                  icon="add"
                  className="text-on-primary-container"
                />
              </Card>
              <AttendanceDialog
                classroomID={classroomID}
                teacherID={teacherID}
                open={addOpen}
                onClose={() => setAddOpen(false)}
              />
            </li>
          )}
          <AnimatePresence mode="popLayout">
            {!loading
              ? attendanceList.map((attendance) => (
                  <motion.li
                    key={attendance.date}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={transition(
                      duration.short4,
                      easing.standardDecelerate,
                    )}
                  >
                    <RecentAttendanceItem
                      attendance={attendance}
                      classroomID={classroomID}
                      teacherID={teacherID}
                    />
                  </motion.li>
                ))
              : list(3).map((idx) => (
                  <motion.li
                    key={idx}
                    exit={{ opacity: 0 }}
                    transition={transition(duration.short2, easing.standard)}
                    className="w-40 animate-pulse rounded-md bg-surface"
                  />
                ))}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  );
};

export default RecentAttendanceList;
