import StudentListPrintout from "@/components/classes/StudentListPrintout";
import EnrollmentPrintoutHeader from "@/components/elective/EnrollmentPrintoutHeader";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import { getStudentsByIDs } from "@/utils/backend/person/getStudentsByIDs";
import sortStudents from "@/utils/helpers/person/sortStudents";
import { supabase } from "@/utils/supabase-backend";
import { CustomPage, LangCode } from "@/utils/types/common";
import { ElectiveSubject } from "@/utils/types/elective";
import { Student, UserRole } from "@/utils/types/person";
import { GetStaticPaths, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { sift } from "radash";
import shortUUID from "short-uuid";

/**
 * A preview and options page for printing a list of Students enrolled in an
 * Elective Subject.
 *
 * @param electiveSubject The Elective Subject to print the Student List for.
 * @param students The list of Students enrolled in the Elective Subject.
 */
const EnrollmentListPrintPage: CustomPage<{
  electiveSubject: ElectiveSubject;
  students: Student[];
}> = ({ electiveSubject, students }) => {
  const { t } = useTranslation("elective", { keyPrefix: "print" });
  const { t: tx } = useTranslation("common");

  const mysk = useMySKClient();
  const canSeeSensitive =
    mysk.user && (mysk.user.is_admin || mysk.user.role !== UserRole.student);

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <h1 className="sr-only">{t("title")}</h1>
      <StudentListPrintout
        data={[
          {
            header: ({ locale }) => (
              <EnrollmentPrintoutHeader
                electiveSubject={electiveSubject}
                locale={locale}
              />
            ),
            students,
          },
        ]}
        columns={sift([
          "index",
          canSeeSensitive && "studentID",
          "prefix",
          "fullName",
          "nickname",
          "classroom",
          "allergies",
          "shirtSize",
          "pantsSize",
          "randomized",
        ])}
        filters={["hasAllergies"]}
        parentURL="/teach/electives"
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const { toUUID } = shortUUID();

  const id = params?.id as string;
  if (!id) return { notFound: true };

  const mysk = await createMySKClient();

  const { data: electiveSubject } = await mysk.fetch<ElectiveSubject>(
    `/v1/subjects/electives/${toUUID(id)}`,
    { query: { fetch_level: "detailed", descendant_fetch_level: "compact" } },
  );
  if (!electiveSubject) return { notFound: true };

  // Even with `detailed` fetch level, some columns are still missing from the
  // Student list. We need to fetch them separately.
  const { data: students } = await getStudentsByIDs(
    supabase,
    mysk,
    electiveSubject.students.map((student) => student.id),
    { detailed: true },
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "classes",
        "elective",
      ])),
      electiveSubject,
      students: sortStudents(students!),
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default EnrollmentListPrintPage;
