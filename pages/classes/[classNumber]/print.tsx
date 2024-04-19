import StudentListPrintout from "@/components/classes/StudentListPrintout";
import getClassroomByNumber from "@/utils/backend/classroom/getClassroomByNumber";
import getClassroomOverview from "@/utils/backend/classroom/getClassroomOverview";
import getStudentsOfClass from "@/utils/backend/classroom/getStudentsOfClass";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import { getStudentsByIDs } from "@/utils/backend/person/getStudentsByIDs";
import useLoggedInPerson from "@/utils/helpers/useLoggedInPerson";
import { supabase } from "@/utils/supabase-backend";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Student, UserRole } from "@/utils/types/person";
import { GetStaticPaths, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect, useState } from "react";

const StudentsListPrintPage: CustomPage<{
  classroom: Pick<
    Classroom,
    "id" | "number" | "class_advisors" | "contacts" | "subjects"
  >;
  studentList: Student[];
}> = ({ classroom, studentList }) => {
  const { t } = useTranslation("classes", { keyPrefix: "print" });
  const { t: tx } = useTranslation("common");

  const { person: user } = useLoggedInPerson();
  const [userRole, setUserRole] = useState<UserRole>(UserRole.student);

  useEffect(() => {
    if (user?.role) setUserRole(user.role);
  }, [user]);

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <StudentListPrintout
        classroom={classroom}
        studentList={studentList}
        userRole={userRole}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const mysk = await createMySKClient();

  const classNumber = Number(params?.classNumber);
  if (Number.isNaN(classNumber)) return { notFound: true };

  const { data, error } = await getClassroomByNumber(supabase, classNumber);
  if (error) return { notFound: true };

  const { data: classroom } = await getClassroomOverview(supabase, data.id);
  const { data: compactStudentList } = await getStudentsOfClass(
    supabase,
    data.id,
  );
  const { data: studentList } = await getStudentsByIDs(
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
      studentList: studentList!.sort(
        // Put Students with no class No. first
        (a, b) => (a.class_no || 0) - (b.class_no || 0),
      ),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default StudentsListPrintPage;
