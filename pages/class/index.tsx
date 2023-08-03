// External libraries
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Internal components
import ClassOverview from "@/components/class/ClassOverview";
import MySKPageHeader from "@/components/common/MySKPageHeader";
import ClassTabs from "@/components/lookup/class/ClassTabs";

// Backend
// import { getUserMetadata } from "@/utils/backend/account/getUserByEmail";
// import {
//   getClassFromUser,
//   getClassOverview,
// } from "@/utils/backend/classroom/classroom";
import getClassroomOverview from "@/utils/backend/classroom/getClassroomOverview";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
// import {
//   ClassOverview as ClassOverviewType,
//   ClassWNumber,
// } from "@/utils/types/class";
import { CustomPage, LangCode } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Classroom } from "@/utils/types/classroom";

const ClassroomOverviewPage: CustomPage<{
  classroom: Pick<
    Classroom,
    "id" | "number" | "class_advisors" | "contacts" | "subjects"
  >;
  editable: boolean;
  userRole: UserRole;
}> = ({ classroom, editable, userRole }) => {
  const { t } = useTranslation(["class", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t(`overview.title.${userRole}`), t)}</title>
      </Head>
      <MySKPageHeader title={t(`overview.title.${userRole}`)}>
        <ClassTabs number={classroom.number} type="class" />
      </MySKPageHeader>
      <ClassOverview {...{ classroom, editable }} />
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

  const { data: user, error } = await getLoggedInPerson(
    supabase,
    authOptions,
    req,
    res,
    { includeContacts: true, detailed: true },
  );

  const userRole = user!.role;

  let classroom: Pick<Classroom, "id" | "number"> | null = null;
  let editable = false;

  switch (userRole) {
    case "student":
      classroom = user?.classroom!;
      break;
    case "teacher":
      classroom = user?.class_advisor_at!;
      editable = true;
      break;
  }

  if (!classroom) return { notFound: true };

  const { data: classroomOverview, error: classroomOverviewError } = await getClassroomOverview(
    supabase,
    classroom!.id,
  );

  // console.log({classroomOverview, classroomOverviewError});

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
        "class",
      ])),
      classroom: classroomOverview,
      editable,
      userRole,
    },
  };
};

export default ClassroomOverviewPage;
