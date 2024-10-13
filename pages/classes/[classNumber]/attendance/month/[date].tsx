import AttendanceViewSelector, {
  AttendanceView,
} from "@/components/attendance/AttendanceViewSelector";
import MonthAttendanceLegend from "@/components/attendance/MonthAttendanceLegend";
import MonthAttendanceSummary from "@/components/attendance/MonthAttendanceSummary";
import MonthStudentCard from "@/components/attendance/MonthStudentCard";
import PageHeader from "@/components/common/PageHeader";
import getMonthAttendanceOfClass from "@/utils/backend/attendance/getMonthAttendanceOfClass";
import getClassroomByNumber from "@/utils/backend/classroom/getClassroomByNumber";
import tallyAttendances from "@/utils/helpers/attendance/tallyAttendances";
import { supabase } from "@/utils/supabase-backend";
import { StudentAttendance } from "@/utils/types/attendance";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage } from "@/utils/types/common";
import { ContentLayout } from "@suankularb-components/react";
import { GetStaticPaths, GetStaticProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { group } from "radash";

/**
 * Month Attendance page displays Attendance of a Classroom of a specific month.
 *
 * @param date The month to display Attendance for in `YYYY-MM`.
 * @param classroom The Classroom to display Attendance for.
 * @param students The list of Students in the Classroom with their Attendance.
 */
const MonthAttendancePage: CustomPage<{
  date: string;
  classroom: Pick<Classroom, "id" | "number">;
  students: {
    student: StudentAttendance["student"];
    attendances: (Omit<StudentAttendance, "student"> & { date: string })[];
  }[];
}> = ({ date, classroom, students }) => {
  const { t } = useTranslation("attendance/common");
  const { t: tx } = useTranslation("common");

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
      <ContentLayout>
        <AttendanceViewSelector
          view={AttendanceView.month}
          date={date}
          classroom={classroom}
          className="mx-4 -mb-2 sm:mx-0"
        />
        <MonthAttendanceLegend className="-mb-4 -mt-2" />
        <h2 className="sr-only">{t("month.chart")}</h2>
        <ul className="mx-4 space-y-2 sm:mx-0 md:space-y-0">
          <li key={classroom.id} className="top-0 z-10 md:sticky">
            <MonthAttendanceSummary
              date={new Date(date)}
              classroom={classroom}
              counts={Object.entries(
                group(
                  students.map((student) => student.attendances).flat(),
                  (attendance) => attendance.date,
                ),
              ).map(([date, attendances]) => ({
                date: new Date(date),
                ...tallyAttendances(
                  attendances!.map((attendance) => attendance.assembly),
                ),
              }))}
            />
          </li>
          {students.map(({ student, attendances }) => (
            <li key={student.id} className="md:[&:last-child>*]:!border-b-0">
              <MonthStudentCard
                student={student}
                date={new Date(date)}
                attendances={attendances}
              />
            </li>
          ))}
        </ul>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { classNumber, date } = params as { [key: string]: string };

  const { data: classroom, error } = await getClassroomByNumber(
    supabase,
    Number(classNumber),
  );
  if (error) return { notFound: true };

  const { data: students } = await getMonthAttendanceOfClass(
    supabase,
    classroom.id,
    date as `${number}-${number}`,
  );

  return { props: { date, classroom, students }, revalidate: 10 };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default MonthAttendancePage;
