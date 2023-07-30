// External libraries
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Internal components
import ClassStudents from "@/components/class/ClassStudents";
import MySKPageHeader from "@/components/common/MySKPageHeader";
import ClassTabs from "@/components/lookup/class/ClassTabs";

// Backend
// import { getUserMetadata } from "@/utils/backend/account/getUserByEmail";
// import {
//   getClassFromUser,
//   getClassStudentList,
// } from "@/utils/backend/classroom/classroom";
// import { getClassAdvisorAt } from "@/utils/backend/person/teacher";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import { UserRole, Student } from "@/utils/types/person";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getClassStudentList from "@/utils/backend/classroom/getClassStudentList";

const ClassStudentsPage: CustomPage<{
  classItem: Pick<Classroom, "id" | "number">;
  studentList: Pick<Student, "id" | "first_name" | "last_name" | "nickname" | "class_no">[];
  userRole: UserRole;
}> = ({ classItem, studentList, userRole }) => {
  const { t } = useTranslation(["class", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t(`student.title.${userRole}`), t)}</title>
      </Head>
      <MySKPageHeader title={t(`student.title.${userRole}`)} parentURL="/class">
        <ClassTabs number={classItem.number} type="class" />
      </MySKPageHeader>
      <ClassStudents {...{ studentList }} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: user } = await getLoggedInPerson(
    supabase,
    authOptions,
    req,
    res,
  );

  const userRole = user!.role;

  let classItem: Pick<Classroom, "id" | "number"> = user!.role === "student" ? user!.classroom! : user!.class_advisor_at!;
  // }

  const { data: studentList, error } = await getClassStudentList(
    supabase,
    classItem!.id
  );

  console.log({studentList, error});

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "class",
        "lookup",
      ])),
      classItem: classItem!,
      studentList,
      userRole,
    },
  };
};

export default ClassStudentsPage;
