// External libraries
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

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
import { Role } from "@/utils/types/person";

const ClassTeachersPage: CustomPage<{
  classItem: ClassWNumber;
  teacherList: ClassTeachersListSection[];
  userRole: Role;
}> = ({ classItem, teacherList, userRole }) => {
  const { t } = useTranslation(["class", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t(`teacher.title.${userRole}`), t)}</title>
      </Head>
      <MySKPageHeader title={t(`teacher.title.${userRole}`)} parentURL="/class">
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
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data: metadata } = await getUserMetadata(supabase, session!.user.id);

  const userRole = metadata!.role;

  let classItem: ClassWNumber;
  if (userRole === "student") {
    const { data } = await getClassFromUser(supabase, session!.user);
    classItem = data!;
  } else if (userRole === "teacher") {
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
      userRole,
    },
  };
};

export default ClassTeachersPage;
