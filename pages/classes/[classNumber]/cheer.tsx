import CheerAttendanceLegend from "@/components/cheer/CheerAttendanceLegend";
import ClassCheerAttendanceSummary from "@/components/cheer/ClassCheerAttendanceSummary";
import StudentCheerAttendanceSummaryCard from "@/components/cheer/StudentCheerAttendanceSummaryCard";
import PageHeader from "@/components/common/PageHeader";
import CheerAttendanceRemedialGuidelineGlance from "@/components/home/glance/CheerAttendanceRemedialGuidelineGlance";
import getClassroomByNumber from "@/utils/backend/classroom/getClassroomByNumber";
import getStudentsOfClass from "@/utils/backend/classroom/getStudentsOfClass";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import tallyCheerAttendances from "@/utils/helpers/attendance/cheer/tallyCheerAttendances";
import {
  CheerAttendanceRecord,
  CheerPracticePeriod,
} from "@/utils/types/cheer";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage } from "@/utils/types/common";
import { ContentLayout } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { parallel } from "radash";

const ClassroomCheerAtttendanceSummaryPage: CustomPage<{
  classroom: Pick<Classroom, "id" | "number">;
  studentsWithAttendances: {
    student: Classroom["students"][number];
    attendances: CheerAttendanceRecord[];
  }[];
  practiceDates: string[];
  summaries: ({ practice_period: CheerPracticePeriod } & ReturnType<
    typeof tallyCheerAttendances
  >)[];
}> = ({ classroom, studentsWithAttendances, practiceDates, summaries }) => {
  const { t } = useTranslation("classes/cheer");
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
        {t("header", { classNumber: classroom.number })}
      </PageHeader>
      <ContentLayout>
        <CheerAttendanceRemedialGuidelineGlance />
        <CheerAttendanceLegend className="my-1" />
        <ul className="mx-4 space-y-2 sm:mx-0 md:space-y-0">
          <li key={classroom.id} className="top-0 z-10 md:sticky">
            <ClassCheerAttendanceSummary
              classroom={{ number: classroom.number }}
              practiceDates={practiceDates}
              summaries={summaries}
            />
          </li>
          {studentsWithAttendances.map((student) => (
            <li
              key={student.student.id}
              className="md:[&:last-child>*]:!border-b-0"
            >
              <StudentCheerAttendanceSummaryCard
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

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res,
}) => {
  const { classNumber } = params as { [key: string]: string };
  const mysk = await createMySKClient(req);
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });
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
  const studentsWithAttendances: {
    student: Classroom["students"][number];
    attendances: CheerAttendanceRecord[];
  }[] = students.map((student) => {
    return { student: student, attendances: [] };
  });

  const practiceDates: string[] = [];
  const summaries: ({ practice_period: CheerPracticePeriod } & ReturnType<
    typeof tallyCheerAttendances
  >)[] = [];
  const { data: classPracticePeriods, error: classPracticePeriodsError } =
    await mysk.fetch<CheerPracticePeriod[]>("/v1/attendance/cheer/periods", {
      query: {
        fetch_level: "compact",
        filter: { data: { classroom_id: classroom.id } },
      },
    });
  if (classPracticePeriodsError || !classPracticePeriods)
    return { notFound: true };
  await parallel(
    classPracticePeriods.length,
    classPracticePeriods,
    async (practicePeriod) => {
      practiceDates.push(practicePeriod.date);
      const { data: periodAttendances, error: periodAttendancesError } =
        await mysk.fetch<CheerAttendanceRecord[]>("/v1/attendance/cheer", {
          query: {
            fetch_level: "compact",
            filter: {
              data: {
                classroom_id: classroom.id,
                practice_period_id: practicePeriod.id,
              },
            },
          },
        });
      if (periodAttendancesError || !periodAttendances) return;

      periodAttendances.forEach((attendance) => {
        attendance.practice_period = practicePeriod;
      });

      for (const student of studentsWithAttendances) {
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
            disabled: false,
            condition: null,
          };
          student.attendances.push(defaultAttendance);
          periodAttendances.push(defaultAttendance);
        }
      }

      summaries.push({
        practice_period: practicePeriod,
        ...tallyCheerAttendances(periodAttendances),
      });
    },
  );

  return {
    props: { classroom, studentsWithAttendances, practiceDates, summaries },
  };
};

export default ClassroomCheerAtttendanceSummaryPage;
