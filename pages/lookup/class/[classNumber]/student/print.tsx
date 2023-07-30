// External libraries
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useEffect, useState } from "react";

// Supabase
import { supabase } from "@/utils/supabase-backend";

// Backend

// Internal components
import PrintStudentList from "@/components/class/PrintStudentList";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import {  Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import { UserRole, Student } from "@/utils/types/person";
import { getCurrentAcademicYear } from "@/utils/helpers/date";
import getClassroomOverview from "@/utils/backend/classroom/getClassroomOverview";
import getStudentsOfClass from "@/utils/backend/classroom/getStudentsOfClass";
import { getStudentsByIDs } from "@/utils/backend/person/getStudentsByIDs";
import { useLoggedInPerson } from "@/utils/helpers/auth";

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
  }
  , [user]);

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

  const {data, error} = await supabase.from("classrooms").select("id").eq("number", classNumber).eq("year", getCurrentAcademicYear()).single();

  if (error) return { notFound: true };

  const classID = data.id;

  const { data: classItem, error: classError } = await supabase.from("classrooms").select("id, number").eq("id", classID).single();

  if (classError) return { notFound: true };

  const { data: classroomOverview } = await getClassroomOverview(
    supabase,
    classID
  );

  const { data: compactStudentList } = await getStudentsOfClass(
    supabase,
    classID,
  );

  const { data: studentList } = await getStudentsByIDs(
    supabase,
    compactStudentList!.map((student) => student.id),
    { detailed: true}
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
      studentList: studentList!.sort((a, b) => a.class_no - b.class_no),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: classNumbers, error } = await supabase.from("classrooms").select("number").eq("year", getCurrentAcademicYear());
  
  if (error) return { paths: [], fallback: "blocking" };

  return {
    paths: classNumbers!.map((classroom) => ({
      params: { classNumber: classroom.number.toString() },
    })),
    fallback: "blocking",
  };
};

export default StudentsListPrintPage;
