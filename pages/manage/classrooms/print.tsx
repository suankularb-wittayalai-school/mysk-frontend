import ClassroomPrintoutHeader from "@/components/classes/ClassroomPrintoutHeader";
import StudentListPrintout from "@/components/classes/StudentListPrintout";
import getClassroomsForBulkPrint from "@/utils/backend/classroom/getClassroomsForBulkPrint";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import { supabase } from "@/utils/supabase-backend";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Student } from "@/utils/types/person";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";

/**
 * A preview and options page for printing a list of Students in all Classrooms
 * of this semester.
 *
 * @param electiveSubjects The list of Classrooms to print the Student List for, including full Student details.
 */
const ClassroomsBulkPrintPage: CustomPage<{
  classrooms: (Pick<Classroom, "id" | "number" | "class_advisors"> & {
    students: Student[];
  })[];
}> = ({ classrooms }) => {
  const { t } = useTranslation("classes/print");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <h1 className="sr-only">{t("title")}</h1>
      <StudentListPrintout
        data={classrooms.map(({ students, ...classroom }) => ({
          header: ({ locale }) => (
            <ClassroomPrintoutHeader classroom={classroom} locale={locale} />
          ),
          students,
        }))}
        columns={[
          "classNo",
          "studentID",
          "prefix",
          "fullName",
          "nickname",
          "allergies",
          "healthProblem",
          "shirtSize",
          "pantsSize",
          "elective",
        ]}
        filters={["noElective", "hasAllergies", "hasHealthProblem"]}
        parentURL="/manage"
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const mysk = await createMySKClient();
  const { data: classrooms } = await getClassroomsForBulkPrint(supabase, mysk);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, ["common"])),
      classrooms,
    },
  };
};

export default ClassroomsBulkPrintPage;
