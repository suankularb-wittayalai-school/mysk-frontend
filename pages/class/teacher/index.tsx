// External libraries
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Internal components
import ClassTeachers from "@/components/class/ClassTeachers";
import MySKPageHeader from "@/components/common/MySKPageHeader";
import ClassTabs from "@/components/lookup/class/ClassTabs";

// Backend
import { getUserMetadata } from "@/utils/backend/account";
import {
  getClassFromUser,
  getClassTeachersList,
} from "@/utils/backend/classroom/classroom";
import { getClassAdvisorAt } from "@/utils/backend/person/teacher";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { ClassTeachersListSection, ClassWNumber } from "@/utils/types/class";
import { CustomPage, LangCode } from "@/utils/types/common";

const ClassTeachersPage: CustomPage<{
  classItem: ClassWNumber;
  teacherList: ClassTeachersListSection[];
}> = ({ classItem, teacherList }) => {
  const { t } = useTranslation(["class", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr("Your teachers", t)}</title>
      </Head>
      <MySKPageHeader title="Your teachers" parentURL="/class">
        <ClassTabs number={classItem.number} type="class" />
      </MySKPageHeader>
      <ClassTeachers {...{ teacherList }} />
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
  const { data: metadata } = await getUserMetadata(supabase, session!.user.id);

  let classItem: ClassWNumber;
  if (metadata!.role === "student") {
    const { data } = await getClassFromUser(supabase, session!.user);
    classItem = data!;
  } else if (metadata!.role === "teacher") {
    const { data } = await getClassAdvisorAt(supabase, metadata!.teacher!);
    classItem = data!;
  }

  const { data: teacherList } = await getClassTeachersList(
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
      classItem: classItem!,
      teacherList,
    },
  };
};

export default ClassTeachersPage;
