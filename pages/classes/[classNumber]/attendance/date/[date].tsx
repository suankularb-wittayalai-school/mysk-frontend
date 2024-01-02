// Imports
import AttendanceEventTabs from "@/components/attendance/AttendanceEventTabs";
import AttendanceListItem from "@/components/attendance/AttendanceListItem";
import ClassAttendanceLayout from "@/components/attendance/ClassAttendanceLayout";
import HomeroomContentDialog from "@/components/attendance/HomeroomContentDialog";
import TodaySummary from "@/components/attendance/TodaySummary";
import PageHeader from "@/components/common/PageHeader";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {
  getStudentFromUserID,
  getTeacherFromUserID,
} from "@/utils/backend/account/getLoggedInPerson";
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import getAttendanceOfClass from "@/utils/backend/attendance/getAttendanceOfClass";
import getHomeroomOfClass from "@/utils/backend/attendance/getHomeroomOfClass";
import getClassroomByNumber from "@/utils/backend/classroom/getClassroomByNumber";
import { SelectorType } from "@/utils/helpers/attendance/useAttendanceView";
import cn from "@/utils/helpers/cn";
import { YYYYMMDDRegex } from "@/utils/patterns";
import {
  AttendanceEvent,
  HomeroomContent,
  StudentAttendance,
} from "@/utils/types/attendance";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import { User, UserRole } from "@/utils/types/person";
import {
  Button,
  Columns,
  List,
  MaterialIcon,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { isFuture, isWeekend } from "date-fns";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { replace } from "radash";
import { useEffect, useState } from "react";

/**
 * Date Attendance page displays Attendance of a Classroom at specific date.
 *
 * @param date The date to display Attendance of, in YYYY-MM-DD format.
 * @param user The currently logged in user.
 * @param teacherID The ID of the Teacher who is viewing this page. Used in Attendance.
 * @param editable Whether the Attendance data is editable.
 * @param attendances The Attendance data to display.
 * @param homeroomContent An object containing the content of this day’s homeroom.
 * @param classroom The Classroom that this page is for.
 */
const DateAttendancePage: CustomPage<{
  date: string;
  user: User;
  teacherID?: string;
  editable?: boolean;
  attendances: StudentAttendance[];
  homeroomContent?: HomeroomContent;
  classroom: Pick<Classroom, "id" | "number">;
}> = ({
  date,
  user,
  teacherID,
  editable,
  attendances: initialAttendances,
  homeroomContent,
  classroom,
}) => {
  const { t } = useTranslation("attendance");
  const { t: tx } = useTranslation("common");

  const [event, setEvent] = useState<AttendanceEvent>("assembly");
  const [homeroomOpen, setHomeroomOpen] = useState(false);

  const [attendances, setAttendances] =
    useState<StudentAttendance[]>(initialAttendances);
  useEffect(() => setAttendances(initialAttendances), [initialAttendances]);

  return (
    <>
      <Head>
        <title>
          {tx("tabName", {
            tabName: t("title", { classNumber: classroom.number }),
          })}
        </title>
      </Head>
      <PageHeader parentURL="/classes">
        {t("title", { classNumber: classroom.number })}
      </PageHeader>
      <ClassAttendanceLayout
        type={SelectorType.classroom}
        user={user}
        date={date}
      >
        <Columns columns={2} className="!grid-cols-1 md:!grid-cols-2">
          <div
            className={cn(`-mx-4 grid sm:mx-0 md:h-[calc(100dvh-12rem-2px)]
              md:overflow-auto md:rounded-lg md:border-1
              md:border-outline-variant md:bg-surface-3 [&>:first-child]:top-0
              [&>:first-child]:z-10 [&>:first-child]:sm:sticky
              [&>:first-child]:sm:bg-surface`)}
          >
            <AttendanceEventTabs
              event={event}
              onEventChange={setEvent}
              className="!-mt-2 sm:!mt-0"
            />
            {event === "homeroom" && (
              <Button
                appearance="filled"
                icon={<MaterialIcon icon="edit" />}
                onClick={() => setHomeroomOpen(true)}
                className="!mx-4 !mt-3 sm:!mx-0 md:!hidden"
              >
                {t("today.action.editHomeroom")}
              </Button>
            )}
            <HomeroomContentDialog
              open={homeroomOpen}
              homeroomContent={
                homeroomContent || { id: null, date, homeroom_content: "" }
              }
              classroomID={classroom.id}
              onClose={() => setHomeroomOpen(false)}
            />
            <List
              className={cn(`!mt-1 sm:!-mx-4 md:!m-0 md:space-y-1 md:!p-2
                [&>*]:bg-surface [&>*]:md:rounded-md`)}
            >
              {attendances.map((attendance) => (
                <AttendanceListItem
                  key={attendance.student.id}
                  attendance={attendance}
                  shownEvent={event}
                  date={date}
                  teacherID={teacherID}
                  editable={editable}
                  onAttendanceChange={(attendance) =>
                    setAttendances(
                      replace(
                        attendances,
                        attendance,
                        (item) => attendance.student!.id === item.student!.id,
                      ),
                    )
                  }
                />
              ))}
            </List>
          </div>
          <TodaySummary
            attendances={attendances}
            homeroomContent={
              homeroomContent || { id: null, date, homeroom_content: "" }
            }
            classroomID={classroom.id}
            className="hidden sm:block"
          />
        </Columns>
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
      user,
      teacherID,
      editable,
      attendances,
      homeroomContent,
      classroom,
    },
  };
};

export default DateAttendancePage;
