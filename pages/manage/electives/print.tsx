import StudentListPrintout from "@/components/classes/StudentListPrintout";
import EnrollmentPrintoutHeader from "@/components/elective/EnrollmentPrintoutHeader";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import { getStudentsByIDs } from "@/utils/backend/person/getStudentsByIDs";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getCurrentSemester from "@/utils/helpers/getCurrentSemester";
import sortStudents from "@/utils/helpers/person/sortStudents";
import { supabase } from "@/utils/supabase-backend";
import { CustomPage, LangCode } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { objectify, unique } from "radash";

/**
 * A preview and options page for printing a list of Students enrolled for all
 * Elective Subjects of this semester.
 *
 * @param electiveSubjects The list of Elective Subjects to print the Student List for, including full Student details.
 */
const ElectivesBulkPrintPage: CustomPage<{
  electiveSubjects: ElectiveSubject[];
}> = ({ electiveSubjects }) => {
  const { t } = useTranslation("elective", { keyPrefix: "print" });
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <h1 className="sr-only">{t("title")}</h1>
      <StudentListPrintout
        data={electiveSubjects.map((electiveSubject) => ({
          header: ({ locale }) => (
            <EnrollmentPrintoutHeader
              electiveSubject={electiveSubject}
              locale={locale}
            />
          ),
          students: electiveSubject.students,
        }))}
        columns={[
          "index",
          "studentID",
          "prefix",
          "fullName",
          "nickname",
          "classroom",
          "allergies",
          "shirtSize",
          "pantsSize",
          "randomized",
        ]}
        filters={["hasAllergies"]}
        parentURL="/teach/electives"
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const mysk = await createMySKClient();

  // Fetch all Elective Subjects of this semester.
  const { data: electiveSubjects } = await mysk.fetch<ElectiveSubject[]>(
    "/v1/subjects/electives",
    {
      query: {
        fetch_level: "detailed",
        descendant_fetch_level: "compact",
        filter: {
          data: {
            year: getCurrentAcademicYear(),
            semester: getCurrentSemester(),
          },
        },
        sort: { by: ["session_code"], ascending: true },
      },
    },
  );
  if (!electiveSubjects) return { notFound: true };

  // Append full Student details to each Elective Subject.
  const studentIDs = unique(
    electiveSubjects.flatMap((subject) =>
      subject.students.map((student) => student.id),
    ),
  );
  const { data: students } = await getStudentsByIDs(
    supabase,
    mysk,
    studentIDs,
    { detailed: true },
  );
  if (!students) return { notFound: true };
  const studentsMap = objectify(students, (student) => student.id);
  for (const electiveSubject of electiveSubjects) {
    electiveSubject.students = sortStudents(
      electiveSubject.students.map((student) => studentsMap[student.id]),
    );
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "classes",
        "elective",
      ])),
      electiveSubjects,
    },
    revalidate: 60,
  };
};

export default ElectivesBulkPrintPage;
