// External libraries
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse
} from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Internal components
import ClassStudents from "@/components/class/ClassStudents";
import MySKPageHeader from "@/components/common/MySKPageHeader";
import ClassTabs from "@/components/lookup/class/ClassTabs";

// Backend
import {
  getClassFromUser,
  getClassStudentList
} from "@/utils/backend/classroom/classroom";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { ClassWNumber } from "@/utils/types/class";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Student } from "@/utils/types/person";

const ClassStudentsPage: CustomPage<{
  classItem: ClassWNumber;
  studentList: Student[];
}> = ({ classItem, studentList }) => {
  const { t } = useTranslation(["class", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr("Your classmates", t)}</title>
      </Head>
      <MySKPageHeader title="Your classmates" parentURL="/class">
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
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: classItem } = await getClassFromUser(supabase, session!.user);
  const { data: studentList } = await getClassStudentList(
    supabase,
    classItem!.id
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "class",
        "lookup",
      ])),
      classItem,
      studentList,
    },
  };
};

export default ClassStudentsPage;
