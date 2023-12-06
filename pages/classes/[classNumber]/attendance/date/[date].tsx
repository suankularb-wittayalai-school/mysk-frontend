// Imports
import AttendanceListHeader from "@/components/attendance/AttendanceListHeader";
import AttendanceListItem from "@/components/attendance/AttendanceListItem";
import ClassAttendanceLayout from "@/components/attendance/ClassAttendanceLayout";
import PageHeader from "@/components/common/PageHeader";
import SnackbarContext from "@/contexts/SnackbarContext";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {
  getStudentFromUserID,
  getTeacherFromUserID,
} from "@/utils/backend/account/getLoggedInPerson";
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import getAttendanceOfClass from "@/utils/backend/attendance/getAttendanceOfClass";
import recordAttendances from "@/utils/backend/attendance/recordAttendances";
import getClassroomByNumber from "@/utils/backend/classroom/getClassroomByNumber";
import cn from "@/utils/helpers/cn";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { YYYYMMDDRegex } from "@/utils/patterns";
import {
  AttendanceEvent,
  StudentAttendance,
} from "@/utils/types/attendance";
import { CustomPage, LangCode } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import {
  Actions,
  Button,
  List,
  MaterialIcon,
  Snackbar,
  Text,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import va from "@vercel/analytics";
import { isToday } from "date-fns";
import { LayoutGroup } from "framer-motion";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { mapValues, omit, replace } from "radash";
import { useContext, useEffect, useState } from "react";

/**
 * Date Attendance page displays Attendance of a Classroom at specific date.
 */
const DateAttendancePage: CustomPage<{
  date: string;
  teacherID?: string;
  editable?: boolean;
  attendances: StudentAttendance[];
}> = ({ date, teacherID, editable, attendances: initialAttendances }) => {
  const { t } = useTranslation("attendance");
  const { t: tx } = useTranslation("common");

  const [attendances, setAttendances] =
    useState<StudentAttendance[]>(initialAttendances);
  useEffect(() => setAttendances(initialAttendances), [initialAttendances]);

  const [event, setEvent] = useState<AttendanceEvent>("assembly");

  const [loading, toggleLoading] = useToggle();
  const { setSnackbar } = useContext(SnackbarContext);
  const supabase = useSupabaseClient();

  /**
   * Save the Attendance data.
   */
  async function handleSave() {
    if (!teacherID) return;
    withLoading(
      async () => {
        const { error } = await recordAttendances(
          supabase,
          attendances,
          date,
          teacherID,
        );
        va.track("Save Attendance", {
          isToday: date !== undefined && isToday(new Date(date)),
        });
        setSnackbar(
          <Snackbar>Saved changes for assembly and homeroom</Snackbar>,
        );
        if (error) return false;
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }

  /**
   * Mark all Students in the client state as present.
   */
  async function handleMarkAllPresent() {
    va.track("Mark All Students as Present", {
      isToday: date !== undefined && isToday(new Date(date)),
    });
    setAttendances(
      attendances.map((attendance) => ({
        student: attendance.student,
        ...mapValues(omit(attendance, ["student"]), (value) =>
          value.is_present !== null
            ? value
            : {
                ...value,
                is_present: true,
                absence_type: null,
                absence_reason: null,
              },
        ),
      })),
    );
  }

  /**
   * Clear the Attendance data in the client state.
   */
  async function handleClear() {
    va.track("Clear Attendance", {
      isToday: date !== undefined && isToday(new Date(date)),
    });
    setAttendances(
      attendances.map((attendance) => ({
        student: attendance.student,
        ...mapValues(omit(attendance, ["student"]), (value) => ({
          ...value,
          is_present: null,
          absence_type: null,
          absence_reason: null,
        })),
      })),
    );
  }

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: "Attendance" })}</title>
      </Head>
      <PageHeader>Attendance</PageHeader>
      <ClassAttendanceLayout date={date}>
        <div>
          <Text type="headline-small" element="h2" className="mb-2">
            {
              attendances.filter(
                (attendance) => attendance.assembly.absence_type === "late",
              ).length
            }
            {" late • "}
            {
              attendances.filter((attendance) => {
                const availableAttendance =
                  attendance[
                    attendances.some(
                      (attendance) => attendance.homeroom.is_present !== null,
                    )
                      ? "homeroom"
                      : "assembly"
                  ];
                return (
                  availableAttendance.is_present === false &&
                  availableAttendance.absence_type !== "late"
                );
              }).length
            }
            {" absent"}
          </Text>
          <Button appearance="tonal" icon={<MaterialIcon icon="add" />}>
            Add homeroom
          </Button>
        </div>

        <List
          divided
          className={cn(
            `!-mx-4 !block sm:!mx-0 [&>:first-child]:!border-b-outline`,
            editable && `[&>:nth-last-child(2)]:!border-b-0`,
          )}
        >
          <AttendanceListHeader event={event} onEventChange={setEvent} />
          <LayoutGroup id="attendance">
            {attendances.map((attendance) => (
              <AttendanceListItem
                key={attendance.student.id}
                attendance={attendance}
                shownEvent={event}
                editable
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
          </LayoutGroup>
          {editable && (
            <div
              className={cn(`sticky bottom-20 z-10 flex flex-row gap-2
              overflow-auto border-t-1 border-t-outline bg-surface px-4 pb-4
              pt-2 sm:bottom-0 sm:px-0`)}
            >
              <div className="flex w-fit flex-row-reverse gap-2 sm:contents [&_.skc-button]:whitespace-nowrap">
                <Actions align="left" className="!contents grow sm:!flex">
                  <Button
                    appearance="outlined"
                    icon={<MaterialIcon icon="done_all" />}
                    onClick={handleMarkAllPresent}
                    className="!col-span-2"
                  >
                    Mark all present
                  </Button>
                  <Button
                    appearance="outlined"
                    icon={<MaterialIcon icon="delete" />}
                    onClick={handleClear}
                    dangerous
                  >
                    Clear
                  </Button>
                </Actions>
                <Button
                  appearance="filled"
                  icon={<MaterialIcon icon="save" />}
                  disabled={loading}
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </List>
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
  if (!YYYYMMDDRegex.test(date)) return { notFound: true };

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
      if (student?.classroom?.id !== classroom.id) return { notFound: true };
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
      return { notFound: true };
  }

  const { data: attendances } = await getAttendanceOfClass(
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
    },
  };
};

export default DateAttendancePage;
