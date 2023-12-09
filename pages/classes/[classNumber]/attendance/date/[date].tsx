// Imports
import AttendanceListFooter from "@/components/attendance/AttendanceListFooter";
import AttendanceListHeader from "@/components/attendance/AttendanceListHeader";
import AttendanceListItem from "@/components/attendance/AttendanceListItem";
import ClassAttendanceLayout from "@/components/attendance/ClassAttendanceLayout";
import TodaySummary from "@/components/attendance/TodaySummary";
import PageHeader from "@/components/common/PageHeader";
import SnackbarContext from "@/contexts/SnackbarContext";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {
  getStudentFromUserID,
  getTeacherFromUserID,
} from "@/utils/backend/account/getLoggedInPerson";
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import getAttendanceOfClass from "@/utils/backend/attendance/getAttendanceOfClass";
import getHomeroomOfClass from "@/utils/backend/attendance/getHomeroomOfClass";
import getClassroomByNumber from "@/utils/backend/classroom/getClassroomByNumber";
import useAttendanceActions from "@/utils/helpers/attendance/useAttendanceActions";
import cn from "@/utils/helpers/cn";
import { YYYYMMDDRegex } from "@/utils/patterns";
import {
  AttendanceEvent,
  HomeroomContent,
  StudentAttendance,
} from "@/utils/types/attendance";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { List, Snackbar } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { isFuture, isWeekend } from "date-fns";
import { LayoutGroup, motion } from "framer-motion";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useContext, useState } from "react";

/**
 * Date Attendance page displays Attendance of a Classroom at specific date.
 *
 * @param date The date to display Attendance of, in YYYY-MM-DD format.
 * @param teacherID The ID of the Teacher who is viewing this page. Used in Attendance.
 * @param editable Whether the Attendance data is editable.
 * @param attendances The Attendance data to display.
 * @param homeroomContent An object containing the content of this day’s homeroom.
 * @param classroom The Classroom that this page is for.
 */
const DateAttendancePage: CustomPage<{
  date: string;
  teacherID?: string;
  editable?: boolean;
  attendances: StudentAttendance[];
  homeroomContent?: HomeroomContent;
  classroom: Pick<Classroom, "id" | "number">;
}> = ({
  date,
  teacherID,
  editable,
  attendances: initialAttendances,
  homeroomContent,
  classroom,
}) => {
  const { t } = useTranslation("attendance");
  const { t: tx } = useTranslation("common");

  const { setSnackbar } = useContext(SnackbarContext);

  const [event, setEvent] = useState<AttendanceEvent>("assembly");

  const {
    attendances,
    loading,
    replaceAttendance,
    handleSave,
    handleMarkAllPresent,
    handleClear,
  } = useAttendanceActions(initialAttendances, date, teacherID);

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader parentURL="/classes">{t("title")}</PageHeader>
      <ClassAttendanceLayout date={date}>
        <LayoutGroup id="attendance">
          <TodaySummary
            attendances={attendances}
            homeroomContent={
              homeroomContent || { id: null, date, homeroom_content: "" }
            }
            classroomID={classroom.id}
          />
          <motion.div layout="position" layoutId="list">
            <List
              divided
              className={cn(
                `!-mx-4 !block sm:!mx-0 [&>:first-child]:!border-b-outline`,
                editable && `[&>:nth-last-child(2)]:!border-b-0`,
              )}
            >
              <AttendanceListHeader event={event} onEventChange={setEvent} />
              {attendances.map((attendance) => (
                <AttendanceListItem
                  key={attendance.student.id}
                  attendance={attendance}
                  shownEvent={event}
                  editable={editable}
                  onAttendanceChange={replaceAttendance}
                />
              ))}
              {editable && (
                <AttendanceListFooter
                  loading={loading}
                  onMarkAllPresent={handleMarkAllPresent}
                  onClear={handleClear}
                  onSave={async () => {
                    if (await handleSave())
                      setSnackbar(
                        <Snackbar>{t("today.snackbar.saved")}</Snackbar>,
                      );
                    else
                      setSnackbar(
                        <Snackbar>{t("today.snackbar.incomplete")}</Snackbar>,
                      );
                  }}
                />
              )}
            </List>
          </motion.div>
        </LayoutGroup>
      </ClassAttendanceLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
  req,
  res,
}) => {
  const { classNumber, date } = params as { [key: string]: string };
  if (
    !YYYYMMDDRegex.test(date) ||
    isFuture(new Date(date)) ||
    isWeekend(new Date(date))
  )
    return { notFound: true };

  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: classroom, error } = await getClassroomByNumber(
    supabase,
    Number(classNumber),
  );
  if (error) return { notFound: true };

  const session = await getServerSession(req, res, authOptions);
  const { data: user } = await getUserByEmail(supabase, session!.user!.email!);

  // Check if user is allowed to view or edit Attendance data on this page
  let editable = false;
  let teacherID = null;

  // Admins can view and edit all Attendance
  if (user?.is_admin) editable = true;

  switch (user?.role) {
    // Students can only view their own Attendance and cannot edit
    case UserRole.student:
      const { data: student } = await getStudentFromUserID(supabase, user.id);
      if (student?.classroom?.id !== classroom.id && !user?.is_admin)
        return { notFound: true };
      break;
    // Teachers can edit Attendance of their own Classrooms
    case UserRole.teacher:
      const { data: teacher } = await getTeacherFromUserID(supabase, user.id);
      if (teacher?.class_advisor_at?.id === classroom.id) editable = true;
      teacherID = teacher?.id || null;
      break;
    // Management cannot edit Attendance of all Classrooms
    case UserRole.management:
      break;
    // Other users are not allowed to view Attendance
    default:
      if (!user?.is_admin) return { notFound: true };
  }

  const { data: attendances } = await getAttendanceOfClass(
    supabase,
    classroom.id,
    date,
  );
  const { data: homeroomContent } = await getHomeroomOfClass(
    supabase,
    classroom.id,
    date,
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "attendance",
      ])),
      date,
      teacherID,
      editable,
      attendances,
      homeroomContent,
      classroom,
    },
  };
};

export default DateAttendancePage;
