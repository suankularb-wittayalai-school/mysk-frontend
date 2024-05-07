import ClassroomPrintoutHeader from "@/components/classes/ClassroomPrintoutHeader";
import StudentListPrintout from "@/components/classes/StudentListPrintout";
import getClassroomByNumber from "@/utils/backend/classroom/getClassroomByNumber";
import getClassroomOverview from "@/utils/backend/classroom/getClassroomOverview";
import getStudentsOfClass from "@/utils/backend/classroom/getStudentsOfClass";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import { getStudentsByIDs } from "@/utils/backend/person/getStudentsByIDs";
import { supabase } from "@/utils/supabase-backend";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Student, UserRole } from "@/utils/types/person";
import { GetStaticPaths, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { sift, sort } from "radash";

/**
 * A preview and options page for printing a list of Students in a Classroom,
 * formatted in the same way as the official Student List printout you get in
 * front of the Records Office.
 *
 * @param classroom The Classroom to print the Student List for.
 * @param studentList The list of Students in the Classroom.
 */
const StudentsListPrintPage: CustomPage<{
  classroom: Pick<
    Classroom,
    "id" | "number" | "class_advisors" | "contacts" | "subjects"
  >;
  students: Student[];
}> = ({ classroom, students }) => {
  const { t } = useTranslation("classes", { keyPrefix: "print" });
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
        header={({ locale }) => (
          <ClassroomPrintoutHeader classroom={classroom} locale={locale} />
        )}
        columns={sift([
          "classNo",
          canSeeSensitive && "studentID",
          "prefix",
          "fullName",
          "nickname",
          "allergies",
          "shirtSize",
          "pantsSize",
          canSeeSensitive && "elective",
        ])}
        filters={sift([canSeeSensitive && "noElective", "hasAllergies"])}
        students={students}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const mysk = await createMySKClient();

  // 1. Fetch a compact Classroom object with the 3-digit class number.
  // 2. Fetch the Classroom Overview which contains enough information for this
  //    page.
  // 3. Fetch the list of compact Students objects in the Classroom.
  // 4. Fetch the detailed Student objects using those compact objects as IDs.

  // That’s a lot of steps! This is why we need a tailor-made API.

  const classNumber = Number(params?.classNumber);
  if (Number.isNaN(classNumber)) return { notFound: true };

  const { data, error } = await getClassroomByNumber(supabase, classNumber);
  if (error) return { notFound: true };

  const { data: classroom } = await getClassroomOverview(supabase, data.id);
  const { data: compactStudentList } = await getStudentsOfClass(
    supabase,
    data.id,
  );
  const { data: students } = await getStudentsByIDs(
    supabase,
    mysk,
    compactStudentList!.map((student) => student.id),
    { detailed: true },
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "classes",
      ])),
      classroom,
      students: sort(students!, (student) => student.class_no || 0),
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default StudentsListPrintPage;
