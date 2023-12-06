// Imports
import RecentAttendanceItem from "@/components/classes/RecentAttendanceItem";
import getAttendanceSummaryOfClass from "@/utils/backend/attendance/getAttendanceSummaryOfClass";
import cn from "@/utils/helpers/cn";
import getISODateString from "@/utils/helpers/getISODateString";
import { AttendanceAtDate } from "@/utils/types/attendance";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import {
  Card,
  MaterialIcon,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { isWeekend } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { list } from "radash";
import { forwardRef, useEffect, useState } from "react";
import Balancer from "react-wrap-balancer";

/**
 * A list of recent Attendance events grouped into dates for Class Details
 * Card.
 *
 * @param classroom The Classroom to display Attendance for.
 * @param teacherID The ID of the Teacher currently logged in, if the user is a Teacher.
 * @param isOwnClass Whether the Classroom belongs to the current user.
 */
const RecentAttendanceList: StylableFC<{
  classroom: Pick<Classroom, "id" | "number">;
  teacherID?: string;
  isOwnClass?: boolean;
}> = ({ classroom, teacherID, isOwnClass, style, className }) => {
  const { t } = useTranslation("classes", { keyPrefix: "detail.attendance" });

  const { duration, easing } = useAnimationConfig();

  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(true);

  /**
   * Fetch the Attendance data for the Classroom.
   */
  async function fetchAttendance() {
    if (!loading) setLoading(true);
    const { data } = await getAttendanceSummaryOfClass(supabase, classroom.id);
    if (data) setAttendanceList(data);
    setLoading(false);
  }

  const [attendanceList, setAttendanceList] = useState<AttendanceAtDate[]>([]);
  useEffect(() => {
    fetchAttendance();
  }, [classroom.id]);

  return (
    <section style={style} className={cn(`space-y-2`, className)}>
      <Text
        type="title-medium"
        element="h4"
        className="rounded-md bg-surface px-3 py-2"
      >
        {t("title")}
      </Text>
      <div className="relative -mx-4 overflow-auto">
        <ul
          className={cn(
            `flex h-[7.5rem] flex-row gap-2 px-4`,
            loading || attendanceList.length ? `w-fit` : `w-full`,
          )}
        >
          {/* Add Attendance */}
          {
            // Only show to Class Advisors of this Classroom
            isOwnClass &&
              teacherID &&
              // Only show if it is a weekday
              !isWeekend(new Date()) &&
              // Only show if there is no Attendance for today
              !attendanceList.find(
                (attendance) =>
                  attendance.date === getISODateString(new Date()),
              ) && (
                <li className="h-full">
                  <Card
                    appearance="filled"
                    stateLayerEffect
                    href={`/classes/${classroom.number}/attendance`}
                    // eslint-disable-next-line react/display-name
                    element={forwardRef((props, ref) => (
                      <Link {...props} ref={ref} title={t("action.addDay")} />
                    ))}
                    className={cn(`!grid h-full w-24 place-items-center
                      !bg-primary-container`)}
                  >
                    <MaterialIcon
                      icon="add"
                      className="text-on-primary-container"
                    />
                  </Card>
                </li>
              )
          }

          {/* Attendance List */}
          <AnimatePresence mode="popLayout">
            {!loading ? (
              attendanceList.length ? (
                // Show list once loaded
                attendanceList.map((attendance) => (
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
                      classroom={classroom}
                      teacherID={teacherID}
                      isOwnClass={isOwnClass}
                    />
                  </motion.li>
                ))
              ) : (
                // Show empty state if no Attendance
                <Card
                  appearance="filled"
                  className="!grid relative z-20 w-full place-items-center !bg-surface"
                >
                  <Text type="body-medium" className="text-center">
                    <Balancer>{t("empty")}</Balancer>
                  </Text>
                </Card>
              )
            ) : (
              // Show skeleton while loading
              list(4).map((idx) => (
                <motion.li
                  key={idx}
                  exit={{ opacity: 0 }}
                  transition={transition(duration.short2, easing.standard)}
                  className="w-40 animate-pulse rounded-md bg-surface"
                />
              ))
            )}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  );
};

export default RecentAttendanceList;
