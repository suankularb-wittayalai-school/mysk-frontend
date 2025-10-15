import PageHeader from "@/components/common/PageHeader";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import getClassroomByNumber from "@/utils/backend/classroom/getClassroomByNumber";
import { supabase } from "@/utils/supabase-backend";
import { CustomPage } from "@/utils/types/common";
import { Classroom } from "@/utils/types/classroom";
import { ContentLayout, Snackbar } from "@suankularb-components/react";
import CheerAttendanceLegend from "@/components/cheer/CheerAttendanceLegend";
import getStudentsOfClass from "@/utils/backend/classroom/getStudentsOfClass";
import {
  CheerAttendanceRecord,
  CheerPracticePeriod,
} from "@/utils/types/cheer";
import { useContext, useEffect, useState } from "react";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import logError from "@/utils/helpers/logError";
import ClassCheerAttendanceSummary from "@/components/cheer/ClassCheerAttendanceSummary";
import tallyCheerAttendances from "@/utils/helpers/attendance/cheer/tallyCheerAttendances";
import StudentCheerAttendanceSummaryCard from "@/components/cheer/StudentCheerAttendanceSummaryCard";
import useTranslation from "next-translate/useTranslation";
import { parallel } from "radash";
import SnackbarContext from "@/contexts/SnackbarContext";

const ClassroomCheerAtttendanceSummaryPage: CustomPage<{
  classroom: Pick<Classroom, "id" | "number">;
  students: Classroom["students"];
}> = ({ classroom, students }) => {
  const [studentWithAttendances, setStudentWithAttendances] = useState<
    {
      student: Classroom["students"][number];
      attendances: CheerAttendanceRecord[];
    }[]
  >(
    students.map((student) => {
      return { student: student, attendances: [] };
    }),
  );
  const [practiceDates, setPracticeDates] = useState<string[]>([]);
  const [summaries, setSummaries] = useState<
    ({ practice_period: CheerPracticePeriod } & ReturnType<
      typeof tallyCheerAttendances
    >)[]
  >([]);

  const mysk = useMySKClient();

  const { t } = useTranslation("classes/cheer");
  const { t: tx } = useTranslation("common");

  const { setSnackbar } = useContext(SnackbarContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: classPracticePeriods, error: classPracticePeriodsError } =
          await mysk.fetch<CheerPracticePeriod[]>(
            "/v1/attendance/cheer/periods",
            {
              query: {
                fetch_level: "compact",
                filter: { data: { classroom_id: classroom.id } },
              },
            },
          );
        if (classPracticePeriodsError || !classPracticePeriods) {
          logError("getClassPracticePeriods", classPracticePeriodsError);
          setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
          return;
        }
        await parallel(
          classPracticePeriods.length,
          classPracticePeriods,
          async (practicePeriod) => {
            setPracticeDates((previousDates) => [
              ...previousDates,
              practicePeriod.date,
            ]);
            const { data: periodAttendances, error: periodAttendancesError } =
              await mysk.fetch<CheerAttendanceRecord[]>(
                "/v1/attendance/cheer",
                {
                  query: {
                    fetch_level: "compact",
                    filter: {
                      data: {
                        classroom_id: classroom.id,
                        practice_period_id: practicePeriod.id,
                      },
                    },
                  },
                },
              );
            if (periodAttendancesError || !periodAttendances) {
              logError("getClassPeriodAttendances", periodAttendancesError);
              setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
              return;
            }
            periodAttendances.forEach((attendance) => {
              attendance.practice_period = practicePeriod;
            });

            const studentWithNewAttendances = studentWithAttendances;
            for (const student of studentWithNewAttendances) {
              let attendanceOfStudent = periodAttendances.find(
                (attendance) => attendance.student.id == student.student.id,
              );
              if (attendanceOfStudent) {
                student.attendances.push(attendanceOfStudent);
              } else {
                let defaultAttendance = {
                  practice_period: practicePeriod,
                  student: student.student,
                  presence: null,
                  absence_reason: null,
                  presence_at_end: null,
                };
                student.attendances.push(defaultAttendance);
                periodAttendances.push(defaultAttendance);
              }
            }

            setStudentWithAttendances(studentWithNewAttendances);
            setSummaries((previousSummaries) => [
              ...previousSummaries,
              {
                practice_period: practicePeriod,
                ...tallyCheerAttendances(periodAttendances),
              },
            ]);
          },
        );
      } finally {
        practiceDates.sort();
      }
    };
    fetchData();
  }, []);
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
        {t("header", { classNumber: classroom.number })}
      </PageHeader>
      <ContentLayout>
        <CheerAttendanceLegend className="-mb-4 -mt-2" />
        <ul className="mx-4 space-y-2 sm:mx-0 md:space-y-0">
          <li key={classroom.id} className="top-0 z-10 md:sticky">
            <ClassCheerAttendanceSummary
              classroom={{ number: classroom.number }}
              practiceDates={practiceDates}
              summaries={summaries}
            />
          </li>
          {studentWithAttendances.map((student) => (
            <li
              key={student.student.id}
              className="md:[&:last-child>*]:!border-b-0"
            >
              <StudentCheerAttendanceSummaryCard
                key={student.student.id}
                student={student.student}
                attendances={student.attendances}
                practiceDates={practiceDates}
              />
            </li>
          ))}
        </ul>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { classNumber } = params as { [key: string]: string };
  const { data: classroom, error: classroomError } = await getClassroomByNumber(
    supabase,
    Number(classNumber),
  );
  if (classroomError) return { notFound: true };

  const { data: students, error: studentsError } = await getStudentsOfClass(
    supabase,
    classroom.id,
  );
  if (studentsError) return { notFound: true };
  return { props: { classroom, students }, revalidate: 300 };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default ClassroomCheerAtttendanceSummaryPage;
