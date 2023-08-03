// Imports
import PrintStudentList from "@/components/class/PrintStudentList";
import getClassroomOverview from "@/utils/backend/classroom/getClassroomOverview";
import getStudentsOfClass from "@/utils/backend/classroom/getStudentsOfClass";
import { getStudentsByIDs } from "@/utils/backend/person/getStudentsByIDs";
import { useLoggedInPerson } from "@/utils/helpers/auth";
import { getCurrentAcademicYear } from "@/utils/helpers/date";
import { createTitleStr } from "@/utils/helpers/title";
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
  classItem: Pick<Classroom, "id" | "number">;
  classroomOverview: Pick<
    Classroom,
    "id" | "number" | "class_advisors" | "contacts" | "subjects"
  >;
  studentList: Student[];
}> = ({ classItem, classroomOverview, studentList }) => {
  const { t } = useTranslation(["class", "common"]);

  const { person: user } = useLoggedInPerson();
  const [userRole, setUserRole] = useState<UserRole>("student");

  useEffect(() => {
    if (user?.role) setUserRole(user.role);
  }, [user]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("student.print.title"), t)}</title>
      </Head>
      <PrintStudentList
        {...{ classItem, classroomOverview, studentList, userRole }}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const classNumber = Number(params?.classNumber);
  if (Number.isNaN(classNumber)) return { notFound: true };

  const { data, error } = await supabase
    .from("classrooms")
    .select("id")
    .eq("number", classNumber)
    .eq("year", getCurrentAcademicYear())
    .single();

  if (error) return { notFound: true };

  const classID = data.id;

  const { data: classItem, error: classError } = await supabase
    .from("classrooms")
    .select("id, number")
    .eq("id", classID)
    .single();

  if (classError) return { notFound: true };

  const { data: classroomOverview } = await getClassroomOverview(
    supabase,
    classID,
  );

  const { data: compactStudentList } = await getStudentsOfClass(
    supabase,
    classID,
  );

  const { data: studentList } = await getStudentsByIDs(
    supabase,
    compactStudentList!.map((student) => student.id),
    { detailed: true },
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "class",
        "lookup",
      ])),
      classItem,
      classroomOverview,
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
