// Imports
import ClassStudents from "@/components/class/ClassStudents";
import MySKPageHeader from "@/components/common/MySKPageHeader";
import ClassTabs from "@/components/lookup/class/ClassTabs";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import getStudentsOfClass from "@/utils/backend/classroom/getStudentsOfClass";
import { createTitleStr } from "@/utils/helpers/title";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Student, UserRole } from "@/utils/types/person";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const ClassStudentsPage: CustomPage<{
  classroom: Pick<Classroom, "id" | "number">;
  studentList: Pick<
    Student,
    "id" | "first_name" | "last_name" | "nickname" | "class_no"
  >[];
  userRole: UserRole;
}> = ({ classroom, studentList, userRole }) => {
  const { t } = useTranslation(["class", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t(`student.title.${userRole}`), t)}</title>
      </Head>
      <MySKPageHeader title={t(`student.title.${userRole}`)} parentURL="/class">
        <ClassTabs number={classroom.number} type="class" />
      </MySKPageHeader>
      <ClassStudents studentList={studentList} isOwnClass />
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

  let classroom: Pick<Classroom, "id" | "number"> =
    user!.role === "student" ? user!.classroom! : user!.class_advisor_at!;

  const { data: studentList } = await getStudentsOfClass(
    supabase,
    classroom!.id,
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "class",
        "lookup",
      ])),
      classroom: classroom!,
      studentList,
      userRole,
    },
  };
};

export default ClassStudentsPage;
